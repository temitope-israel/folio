// src/App.tsx

import { useLenis } from "@/hooks/useLenis";
import CustomCursor from "./components/shared/CustomCursor";
import { personalInfo } from "@/data";
// Root component of my entire React Application
// Every section of the folio app will eventually be imported and rendered here.

function App() {
  useLenis();
  return (
    <>
      <CustomCursor />
      <main className="min-h-screen bg-bg-base">
        <div className="container-customer section-padding">
          <h1 className="text-6xl font-bold text-text-primary mb-4">
            {personalInfo.name}
          </h1>
          <h2 className="text-3xl font-semibold text-text-secondary mb-2">
            {personalInfo.title}
          </h2>
          <p className="text-text-muted mb-12">{personalInfo.location}</p>

          <h2 className="text-gradient text-5xl font-bold mb-12">
            {personalInfo.tagline}
          </h2>

          <div className="flex gap-4 mb-12">
            <button className="btn-primary">View Projects</button>
            <button className="btn-outline">Download Resume</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {["Frontend Dev", "Full-Stack", "API Design"].map((title) => (
              <div key={title} className="card">
                <h3 className="text-text-primary font-semibold mb-2">
                  {title}
                </h3>
                <p className="text-text-muted text-sm">
                  Sample card for a design system testing
                </p>
              </div>
            ))}
          </div>

          {/* TAG TEST */}
          <div className="flex flex-wrap gap-2 mb-12">
            {[
              "React",
              "TypeScript",
              "Node.js",
              "PostgreSQL",
              "Tailwind CSS",
            ].map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          {/* COLOR PALETTE SWATCHES */}
          {/* Scroll test — add enough content to make the page scrollable */}
          <h1 className="text-6xl font-bold text-text-primary mb-4 text-balance">
            {personalInfo.tagline}
          </h1>

          <p className="text-text-secondary text-xl mb-12 max-w-2xl">
            {/*
              max-w-2xl → max-width: 42rem (672px)
              Constrains the paragraph width for comfortable reading.
              Long lines of text are hard to read — we limit to ~65 characters.
            */}
            {personalInfo.subTagline} — {personalInfo.title} based in{" "}
            {personalInfo.location}.
          </p>

          <div className="flex gap-4 mb-16">
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href={personalInfo.resumeUrl} className="btn-outline">
              Download CV
            </a>
          </div>

          {/* Filler sections to test smooth scroll */}
          {["About", "Projects", "Services", "Contact"].map((section) => (
            <section
              key={section}
              id={section.toLowerCase()}
              className="section-padding border-t border-bg-border"
              /*
                border-t          → border-top-width: 1px
                border-bg-border  → border-color: var(--color-bg-border) → #242424
                The two classes together create a subtle top border separator.
              */
            >
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                {section}
              </h2>
              <p className="text-text-secondary">
                This section is coming soon. Scroll to test Lenis smooth scroll.
              </p>
            </section>
          ))}
          <div>
            {[
              { name: "bg-base", color: "bg-bg-base", border: true },
              { name: "bg-surface", color: "bg-bg-surface", border: true },
              { name: "bg-border", color: "bg-bg-border", border: false },
              { name: "brand", color: "bg-brand", border: false },
              { name: "gold", color: "bg-gold", border: false },
            ].map(({ name, color, border }) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 h-12 rounded-lg ${color} ${border ? "border-bg-border" : ""}`}
                >
                  <span className="text-text-muted text-xs">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

// App is exported so that main.tsx can import it and render it into the DOM
export default App;
