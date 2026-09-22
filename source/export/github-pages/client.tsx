import { hydrateRoot } from "react-dom/client";
import ScrollHeader from "../../app/scroll-header";

// Keep the exact approved behavior; all other content is ordinary static HTML.
const header = document.getElementById("site-header-root");
if (header) hydrateRoot(header, <ScrollHeader />);
