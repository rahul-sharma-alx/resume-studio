import type { Resume } from "@/features/resume/validators/resume";
import { type SectionId, type Variant, FONT_OPTIONS, SPACING_SCALE } from "@/features/resume/constants";

function nonEmpty(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// Highlights keyword terms inside plain text without altering structure.
function Highlighted({ text, terms }: { text: string; terms: Set<string> }) {
  if (terms.size === 0) return <>{text}</>;
  const escaped = [...terms].sort((a, b) => b.length - a.length).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        terms.has(part.toLowerCase()) ? (
          <mark key={i} className="resume-highlight">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function formatRange(start?: string, end?: string, current?: boolean): string {
  if (!nonEmpty(start)) return "";
  const endLabel = current ? "Present" : end?.trim() || "";
  return endLabel ? `${start} – ${endLabel}` : start;
}

// Small inline icons for header contacts. Decorative; the link text/label carries meaning.
function ContactIcon({ kind }: { kind: "email" | "phone" | "location" | "link" | "linkedin" | "github" }) {
  const common = { width: 11, height: 11, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
  switch (kind) {
    case "email":
      return (
        <svg {...common}>
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.24 1z" />
        </svg>
      );
    case "location":
      return (
        <svg {...common}>
          <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.3 18.3V9.9H5.7v8.4h2.6zM7 8.7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11.3 9.6v-4.6c0-2.5-1.3-3.6-3.1-3.6a2.7 2.7 0 0 0-2.4 1.3h-.1V9.9H10a3.6 3.6 0 0 1 .1.9v7.5h2.6v-4.2c0-1.1.2-2.2 1.6-2.2s1.4 1.3 1.4 2.3v4.1h2.6z" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.2-.300000-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.6 4.9.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10z" />
        </svg>
      );
  }
}

function ContactLink({
  kind,
  href,
  label,
}: {
  kind: "email" | "phone" | "location" | "link" | "linkedin" | "github";
  href: string;
  label: string;
}) {
  return (
    <li className="resume-contact-item">
      <a className="resume-contact-link" href={href} aria-label={label}>
        <ContactIcon kind={kind} />
        <span>{label}</span>
      </a>
    </li>
  );
}

export function ResumeDocument({
  resume,
  variant,
  highlightTerms,
}: {
  resume: Resume;
  variant: Variant;
  highlightTerms?: string[];
}) {
  const template = variant.template;
  const visibleSections = variant.visibleSections;
  const fontStack = FONT_OPTIONS.find((f) => f.id === variant.font)?.stack ?? "Georgia, serif";
  const spacingScale = SPACING_SCALE[variant.spacing];
  const docStyle: React.CSSProperties = {
    // ponytail: drive all template theming through CSS vars; no per-template CSS branches needed.
    ["--resume-accent" as string]: variant.accent,
    ["--resume-font" as string]: fontStack,
    ["--resume-size" as string]: `${variant.fontSize}pt`,
    ["--resume-spacing" as string]: `${spacingScale}`,
    textAlign: variant.headerAlign,
  };
  const { profile, experience, projects, skills, education, certificates, achievements, languages, links } = resume;
  const hasContact = [profile.email, profile.phone, profile.location, profile.website, profile.linkedin, profile.github].some(nonEmpty);
  const summaryText = resume.summary?.trim() || profile.summary?.trim() || "";
  const show = (section: SectionId) => !visibleSections || visibleSections.includes(section);
  const terms = new Set((highlightTerms ?? []).map((t) => t.toLowerCase()).filter(Boolean));

  return (
    <article className="resume-document" data-template={template} style={docStyle}>
      <header className="resume-header">
        <h1>{profile.fullName || "Your Name"}</h1>
        {nonEmpty(profile.jobTitle) ? <p className="resume-title">{profile.jobTitle}</p> : null}
        {hasContact ? (
          <ul className="resume-contact">
            {nonEmpty(profile.email) ? (
              <ContactLink kind="email" href={`mailto:${profile.email}`} label={profile.email} />
            ) : null}
            {nonEmpty(profile.phone) ? (
              <ContactLink kind="phone" href={`tel:${profile.phone.replace(/\s+/g, "")}`} label={profile.phone} />
            ) : null}
            {nonEmpty(profile.location) ? (
              <li className="resume-contact-item">
                <span className="resume-contact-text">
                  <ContactIcon kind="location" />
                  <span>{profile.location}</span>
                </span>
              </li>
            ) : null}
            {nonEmpty(profile.linkedin) ? (
              <ContactLink kind="linkedin" href={profile.linkedin} label="LinkedIn" />
            ) : null}
            {nonEmpty(profile.github) ? (
              <ContactLink kind="github" href={profile.github} label="GitHub" />
            ) : null}
            {nonEmpty(profile.website) ? (
              <ContactLink kind="link" href={profile.website} label={profile.website} />
            ) : null}
          </ul>
        ) : null}
      </header>

      {show("summary") && nonEmpty(summaryText) ? (
        <section className="resume-section">
          <h2>Summary</h2>
          <p><Highlighted text={summaryText} terms={terms} /></p>
        </section>
      ) : null}

      {show("experience") && experience.length > 0 ? (
        <section className="resume-section">
          <h2>Experience</h2>
          {experience.map((item) => (
            <div key={item.id} className="resume-entry">
              <div className="resume-entry-head">
                <span className="resume-entry-title">{item.position}{nonEmpty(item.company) ? `, ${item.company}` : ""}</span>
                <span className="resume-entry-date">{formatRange(item.startDate, item.endDate, item.current)}</span>
              </div>
              {nonEmpty(item.description) ? <p className="resume-entry-desc"><Highlighted text={item.description} terms={terms} /></p> : null}
              {item.achievements.filter(nonEmpty).length > 0 ? (
                <ul className="resume-bullets">
                  {item.achievements.filter(nonEmpty).map((a, i) => (
                    <li key={i}><Highlighted text={a} terms={terms} /></li>
                  ))}
                </ul>
              ) : null}
              {item.technologies.filter(nonEmpty).length > 0 ? (
                <p className="resume-tech"><Highlighted text={item.technologies.filter(nonEmpty).join(", ")} terms={terms} /></p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {show("projects") && projects.length > 0 ? (
        <section className="resume-section">
          <h2>Projects</h2>
          {projects.map((item) => (
            <div key={item.id} className="resume-entry">
              <div className="resume-entry-head">
                <span className="resume-entry-title">{item.name}</span>
                <span className="resume-entry-date">{[item.github, item.liveDemo].filter(nonEmpty).join(" · ")}</span>
              </div>
              {nonEmpty(item.description) ? <p className="resume-entry-desc"><Highlighted text={item.description} terms={terms} /></p> : null}
              {item.achievements.filter(nonEmpty).length > 0 ? (
                <ul className="resume-bullets">
                  {item.achievements.filter(nonEmpty).map((a, i) => (
                    <li key={i}><Highlighted text={a} terms={terms} /></li>
                  ))}
                </ul>
              ) : null}
              {item.technologies.filter(nonEmpty).length > 0 ? (
                <p className="resume-tech"><Highlighted text={item.technologies.filter(nonEmpty).join(", ")} terms={terms} /></p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {show("skills") && skills.flatMap((g) => g.skills).filter(nonEmpty).length > 0 ? (
        <section className="resume-section">
          <h2>Skills</h2>
          <ul className="resume-skills">
            {skills.map((group) => {
              const list = group.skills.filter(nonEmpty);
              if (list.length === 0) return null;
              return (
                <li key={group.category}>
                  <strong>{group.category}:</strong> <Highlighted text={list.join(", ")} terms={terms} />
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {show("education") && education.length > 0 ? (
        <section className="resume-section">
          <h2>Education</h2>
          {education.map((item) => (
            <div key={item.id} className="resume-entry">
              <div className="resume-entry-head">
                <span className="resume-entry-title">{item.degree}{nonEmpty(item.field) ? `, ${item.field}` : ""}{nonEmpty(item.institution) ? ` — ${item.institution}` : ""}</span>
                <span className="resume-entry-date">{formatRange(item.startDate, item.endDate)}</span>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {show("certificates") && certificates.filter(nonEmpty).length > 0 ? (
        <section className="resume-section">
          <h2>Certifications</h2>
          <ul className="resume-bullets">
            {certificates.filter(nonEmpty).map((c, i) => (
              <li key={i}><Highlighted text={c} terms={terms} /></li>
            ))}
          </ul>
        </section>
      ) : null}

      {show("achievements") && achievements.filter(nonEmpty).length > 0 ? (
        <section className="resume-section">
          <h2>Achievements</h2>
          <ul className="resume-bullets">
            {achievements.filter(nonEmpty).map((a, i) => (
              <li key={i}><Highlighted text={a} terms={terms} /></li>
            ))}
          </ul>
        </section>
      ) : null}

      {show("languages") && languages.filter((l) => nonEmpty(l.name)).length > 0 ? (
        <section className="resume-section">
          <h2>Languages</h2>
          <ul className="resume-bullets">
            {languages.filter((l) => nonEmpty(l.name)).map((l, i) => (
              <li key={i}>{l.name}{nonEmpty(l.proficiency) ? ` — ${l.proficiency}` : ""}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {show("links") && links.filter((l) => nonEmpty(l.label)).length > 0 ? (
        <section className="resume-section">
          <h2>Links</h2>
          <ul className="resume-bullets">
            {links.filter((l) => nonEmpty(l.label)).map((l, i) => (
              <li key={i}>
                {l.label}
                {nonEmpty(l.url) ? (
                  <>
                    {": "}
                    <a href={l.url} className="resume-link">{l.url}</a>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
