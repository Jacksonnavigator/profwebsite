const topics = new Set([
  "Research partnership",
  "Consultancy",
  "Speaking invitation",
  "Graduate study",
  "Media",
  "Something else",
]);

const json = (status: number, body: { error: string }) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST")
    return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });

  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return json(403, { error: "This request could not be accepted." });
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 12_000) return json(413, { error: "The message is too large." });

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json(400, { error: "Please check the form and try again." });
  }
  if (!input || typeof input !== "object") return json(400, { error: "Please check the form and try again." });
  const values = input as Record<string, unknown>;
  if (JSON.stringify(input).length > 12_000) return json(413, { error: "The message is too large." });
  if (typeof values.website === "string" && values.website.trim())
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

  const env = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const apiKey = env.RESEND_API_KEY;
  const from = env.CONTACT_FROM_EMAIL;
  const to = env.CONTACT_TO_EMAIL || "thomas.kivevele@nm-aist.ac.tz";
  if (!apiKey || !from) return json(503, { error: "Message delivery is not configured yet." });
  const name = typeof values.name === "string" ? values.name.trim() : "";
  const email = typeof values.email === "string" ? values.email.trim() : "";
  const org = typeof values.org === "string" ? values.org.trim() : "";
  const topic = typeof values.topic === "string" ? values.topic : "";
  const message = typeof values.message === "string" ? values.message.trim() : "";
  if (name.length < 1 || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || org.length > 160 || !topics.has(topic) || message.length < 10 || message.length > 10000)
    return json(400, { error: "Please check the form fields and try again." });

  const safe = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `${topic}: ${name}`,
      text: `${message}\n\n${name}\n${email}${org ? `\n${org}` : ""}`,
      html: `<p>${safe(message).replace(/\n/g, "<br>")}</p><hr><p>${safe(name)}<br>${safe(email)}${org ? `<br>${safe(org)}` : ""}</p>`,
    }),
  }).catch(() => null);

  if (!response?.ok) return json(502, { error: "The message could not be delivered right now." });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
