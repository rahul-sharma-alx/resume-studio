import type { Profile } from "./resume";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/i;

// Inline, non-blocking field checks. Returns a message per field only when the
// current value is present but malformed. Empty required fields are NOT flagged
// here (we never block typing); the export step handles missing-required.
export function profileFieldErrors(profile: Profile): Partial<Record<keyof Profile, string>> {
  const errors: Partial<Record<keyof Profile, string>> = {};
  if (profile.email && !EMAIL_RE.test(profile.email)) errors.email = "Enter a valid email address.";
  if (profile.website && !URL_RE.test(profile.website)) errors.website = "URL must start with http(s)://.";
  if (profile.linkedin && !URL_RE.test(profile.linkedin)) errors.linkedin = "URL must start with http(s)://.";
  if (profile.github && !URL_RE.test(profile.github)) errors.github = "URL must start with http(s)://.";
  return errors;
}
