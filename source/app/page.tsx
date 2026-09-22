import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import advising from "../content/advising.md?raw";
import contact from "../content/contact.md?raw";
import research from "../content/research.md?raw";
import teaching from "../content/teaching.md?raw";
import ScrollHeader from "./scroll-header";

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);

function MarkdownContent({ source }: { source: string }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          a: ({ href = "", children }) => {
            const isArxiv = href.startsWith("https://arxiv.org/");

            return (
              <a
                className={isArxiv ? "arxiv-link" : undefined}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

function SectionFold({ title, source }: { title: string; source: string }) {
  return (
    <details id={title.toLowerCase()} className="section-fold">
      <summary>
        <h2>{title}</h2>
        <span className="fold-icon" aria-hidden="true" />
      </summary>
      <div className="section-content">
        <MarkdownContent source={source} />
      </div>
    </details>
  );
}

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ilia Nekrasov",
    jobTitle: "Lovett Instructor",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Rice University",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Michigan",
    },
    knowsAbout: [
      "Tensor categories",
      "Model theory",
      "Algebra",
      "Topology",
      "Mathematical physics",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <ScrollHeader />

      <main className="page-shell">
        <section className="introduction" aria-labelledby="page-title">
          <figure className="portrait-frame">
            <img
              src="/ilia-nekrasov-portrait.jpg"
              alt="Portrait of Ilia Nekrasov"
              width="3091"
              height="2048"
            />
          </figure>

          <div className="introduction-copy">
            <p>
              I am a mathematician and a{" "}
              <ExternalLink href="https://profiles.rice.edu/faculty/ilia-nekrasov">
                Lovett Instructor
              </ExternalLink>{" "}
              at Rice University. Previously I was a{" "}
              <ExternalLink href="https://math.berkeley.edu/people/past-department-members/past-postdocs-instructors-and-morreys/ilia-nekrasov">
                Morrey Visiting Professor
              </ExternalLink>{" "}
              at UC Berkeley. I received my Ph.D. with{" "}
              <ExternalLink href="https://websites.umich.edu/~asnowden/">
                Andrew Snowden
              </ExternalLink>{" "}
              at the University of Michigan.
            </p>

            <p>
              My primary interests lie in tensor categories and combinatorial
              model theory. More generally, I am interested in algebra,
              topology, and mathematical physics.
            </p>

            <nav className="profile-links" aria-label="Profile links">
              <ExternalLink href="./documents/ilia-nekrasov-cv.pdf">
                CV
              </ExternalLink>
              <ExternalLink href="https://arxiv.org/search/?query=Ilia+Nekrasov&searchtype=author">
                arXiv
              </ExternalLink>
              <ExternalLink href="https://profiles.rice.edu/faculty/ilia-nekrasov">
                Rice profile
              </ExternalLink>
              <a href="mailto:ilia.nekrasov@rice.edu">Email</a>
            </nav>
          </div>
        </section>

        <aside className="current-note" aria-label="Current semester">
          <p>
            This semester, Fall 2026, I am co-organizing the{" "}
            <ExternalLink href="https://docs.google.com/document/d/1rQFiHC4BnTyvsrPLV5t8N7Y9dI28TvK6KeZ8F5Ld6ZY/edit?tab=t.0">
              Algebra Seminar
            </ExternalLink>
            {" "}at Rice University. Write me an email if you want to be added
            to the mailing list or to give a talk.
          </p>
        </aside>

        <section className="sections" aria-label="Homepage sections">
          <SectionFold title="Research" source={research} />
          <SectionFold title="Teaching" source={teaching} />
          <SectionFold title="Advising" source={advising} />
          <SectionFold title="Contact" source={contact} />
        </section>

        <footer className="page-footer">
          <p>Academic homepage of Ilia Nekrasov</p>
        </footer>
      </main>
    </>
  );
}
