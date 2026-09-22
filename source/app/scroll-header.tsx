"use client";

import { Fragment, useEffect, useRef, useState, type MouseEvent } from "react";

const sections = ["Research", "Teaching", "Advising", "Contact"];

function scrollToSection(id: string, behavior: ScrollBehavior) {
  const section = document.getElementById(id);
  if (!(section instanceof HTMLDetailsElement)) return;

  section.open = true;
  section.querySelector("summary")?.focus({ preventScroll: true });
  section.scrollIntoView({ block: "start", behavior });
}

export default function ScrollHeader() {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateOffset = () => {
      document.documentElement.style.setProperty(
        "--header-scroll-offset",
        `${header.getBoundingClientRect().height + 16}px`,
      );
    };
    const observer = new ResizeObserver(updateOffset);
    observer.observe(header);
    updateOffset();

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-scroll-offset");
    };
  }, []);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 80);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    let frame = 0;
    const openLinkedSection = () => {
      const id = window.location.hash.slice(1);
      if (!sections.some((title) => title.toLowerCase() === id)) return;

      setScrolled(true);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => scrollToSection(id, "instant"));
    };

    openLinkedSection();
    window.addEventListener("hashchange", openLinkedSection);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", openLinkedSection);
    };
  }, []);

  const navigateToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollToSection(id, reduceMotion ? "instant" : "smooth");
  };

  const returnToTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    document.getElementById("page-title")?.focus({ preventScroll: true });
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  };

  return (
    <header
      ref={headerRef}
      id="top"
      className={`site-header${scrolled ? " is-scrolled" : ""}`}
    >
      <div className="site-header-inner">
        <h1 id="page-title" tabIndex={-1}>
          {scrolled ? "Homepage · Ilia Nekrasov" : "Ilia Nekrasov"}
        </h1>
        <div className="header-actions" aria-hidden={!scrolled}>
          <nav className="header-section-links" aria-label="Homepage sections">
            {sections.map((title, index) => {
              const id = title.toLowerCase();
              return (
                <Fragment key={id}>
                  {index > 0 && <span className="header-link-separator" aria-hidden="true">·</span>}
                  <a href={`#${id}`} tabIndex={scrolled ? undefined : -1} onClick={(event) => navigateToSection(event, id)}>
                    {title}
                  </a>
                </Fragment>
              );
            })}
          </nav>
          <button
            type="button"
            className="to-top"
            disabled={!scrolled}
            onClick={returnToTop}
          >
            To top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </header>
  );
}
