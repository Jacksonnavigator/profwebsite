import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const routes=['/','/about','/projects','/publications','/contact'];
for(const width of [1440,390]) for(const route of routes) {
  test(`original design ${route} at ${width}px`, async({page})=>{
    await page.setViewportSize({width,height:width===1440?1000:844});
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto(route);expect(response?.status()).toBe(200);
    await page.evaluate(()=>document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.locator('h1').evaluate(el=>getComputedStyle(el).fontFamily)).toContain('Fraunces');
    expect(await page.locator('body').evaluate(el=>getComputedStyle(el).fontFamily)).toContain('Plus Jakarta Sans');
    expect(await page.evaluate(()=>document.fonts.check('600 32px Fraunces') && document.fonts.check('400 16px "Plus Jakarta Sans"'))).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
test('original homepage sections, grid and hero remain intact',async({page})=>{
  await page.goto('/');
  const hero=page.getByRole('region',{name:'Highlights'});
  await expect(hero).toHaveClass(/min-h-\[100svh\]/);
  await expect(page.getByRole('heading',{level:1})).toContainText('Powering Africa as');
  await expect(page.locator('main section').nth(3).locator('a.group')).toHaveCount(8);
  const recent=page.locator('main section').filter({has:page.getByRole('heading',{name:'Recent journal articles',exact:true})});
  await expect(recent.locator('article')).toHaveCount(6);
  await expect(page.locator('.animate-marquee')).toHaveCount(1);
  await expect(page.getByRole('heading',{name:'Research, people and partnerships'})).toHaveCount(0);
});
test('existing publication and project filters work',async({page})=>{
  await page.goto('/publications');await page.getByLabel('Search',{exact:true}).fill('zzznomatch');
  await expect(page.getByText('No publications match these filters.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Clear filters'}).click();await expect(page.locator('main ol > li')).toHaveCount(133);
  await page.goto('/projects');await page.getByRole('button',{name:/^Within planned dates/}).click();
  await expect(page.locator('main article').first()).toBeVisible();
  const firstProject=page.locator('main article').first();
  const title=(await firstProject.locator('h2').textContent())?.trim()??'';
  await firstProject.getByRole('link',{name:/View project and photo album/}).click();
  await expect(page.getByRole('heading',{level:1,name:title})).toBeVisible();
});
test('form validates before sending',async({page})=>{
  await page.goto('/contact');await page.getByRole('button',{name:'Send message'}).click();
  await expect(page.getByLabel('Your name (required)')).toBeFocused();
  await expect(page.getByLabel('Your name (required)')).toHaveAttribute('aria-invalid','true');
  await expect(page.getByText(/Your message will be sent securely/)).toBeVisible();
});
test('original fonts are bundled, not substituted',()=>{
  const css=fs.readFileSync(path.resolve('public/fonts/original-fonts.css'),'utf8');
  expect(css).toContain("font-family: 'Fraunces'");expect(css).toContain("font-family: 'Plus Jakarta Sans'");
  expect(css).not.toContain('https://');expect(fs.readdirSync('public/fonts').filter(p=>p.endsWith('.woff2'))).toHaveLength(7);
});
