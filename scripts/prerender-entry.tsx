import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "../src/App";
export { metadata, missingMetadata } from "../src/data/metadata";
export { career, education, awards, patents } from "../src/data/site";
export function render(path: string) {
  return renderToString(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>,
  );
}
