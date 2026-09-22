import { renderToStaticMarkup } from "react-dom/server";
import Home from "../../app/page";
import "katex/dist/katex.min.css";
import "../../app/globals.css";

// Render the approved page itself, not a second copy of its content or layout.
export function renderPage() {
  return renderToStaticMarkup(<Home />);
}
