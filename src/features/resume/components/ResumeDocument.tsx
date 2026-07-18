import type { Resume } from "@/features/resume/validators/resume";
import type { SectionId } from "@/features/resume/constants";

function nonEmpty(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function formatRange(start?: string, end?: string, current?: boolean): string {
  if (!nonEmpty(start)) return "";
  const endLabel = current ? "Present" : end?.trim() || "";
  return endLabel ? `${start} – ${endLabel}` : start;
}

export function ResumeDocument({
  resume,
  template,
  visibleSections,
}: {
  resume: Resume;
  template: "minimal" | "classic";
  visibleSections?: SectionId[];
}) {
  const { profile, experience, projects, skills, education, certificates, achievements, languages } = resume;
  const hasContact = [profile.email, profile.phone, profile.location, profile.website, profile.linkedin, profile.github].some(nonEmpty);
  const summaryText = resume.summary?.trim() || profile.summary?.trim() || "";
  const show = (section: SectionId) => !visibleSections || visibleSections.includes(section);

  return (
    <article className="resume-document" data-template={template}>
      <header className="resume-header">
        <h1>{profile.fullName || "Your Name"}</h1>
        {nonEmpty(profile.jobTitle) ? <p className="resume-title">{profile.jobTitle}</p> : null}
        {hasContact ? (
          <ul className="resume-contact">
            {nonEmpty(profile.email) ? <li>{profile.email}</li> : null}
            {nonEmpty(profile.phone) ? <li>{profile.phone}</li> : null}
            {nonEmpty(profile.location) ? <li>{profile.location}</li> : null}
            {nonEmpty(profile.website) ? <li>{profile.website}</li> : null}
            {nonEmpty(profile.linkedin) ? <li>{profile.linkedin}</li> : null}
            {nonEmpty(profile.github) ? <li>{profile.github}</li> : null}
          </ul>
        ) : null}
      </header>

      {show("summary") && nonEmpty(summaryText) ? (
        <section className="resume-section">
          <h2>Summary</h2>
          <p>{summaryText}</p>
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
              {nonEmpty(item.description) ? <p className="resume-entry-desc">{item.description}</p> : null}
              {item.achievements.filter(nonEmpty).length > 0 ? (
                <ul className="resume-bullets">
                  {item.achievements.filter(nonEmpty).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              ) : null}
              {item.technologies.filter(nonEmpty).length > 0 ? (
                <p className="resume-tech">{item.technologies.filter(nonEmpty).join(", ")}</p>
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
              {nonEmpty(item.description) ? <p className="resume-entry-desc">{item.description}</p> : null}
              {item.achievements.filter(nonEmpty).length > 0 ? (
                <ul className="resume-bullets">
                  {item.achievements.filter(nonEmpty).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              ) : null}
              {item.technologies.filter(nonEmpty).length > 0 ? (
                <p className="resume-tech">{item.technologies.filter(nonEmpty).join(", ")}</p>
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
                  <strong>{group.category}:</strong> {list.join(", ")}
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
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {show("achievements") && achievements.filter(nonEmpty).length > 0 ? (
        <section className="resume-section">
          <h2>Achievements</h2>
          <ul className="resume-bullets">
            {achievements.filter(nonEmpty).map((a, i) => (
              <li key={i}>{a}</li>
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
    </article>
  );
}
