import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
const root = document.getElementById("root")!;
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
// Filter/query and hash states differ from the canonical prerendered snapshot.
if (root.hasChildNodes() && !window.location.search && !window.location.hash)
  hydrateRoot(root, app);
else {
  root.replaceChildren();
  createRoot(root).render(app);
}
