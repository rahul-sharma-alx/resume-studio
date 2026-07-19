"use client";

import { TextField, SectionCard } from "@/shared/form-fields";
import { useResumeStore } from "@/features/resume/store";
import { profileFieldErrors } from "@/features/resume/validators/profileErrors";

export function ProfileForm() {
  const profile = useResumeStore((s) => s.resume.profile);
  const setProfile = useResumeStore((s) => s.setProfile);
  const errors = profileFieldErrors(profile);

  return (
    <SectionCard title="Personal Details" collapsible>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Full Name"
          name="fullName"
          value={profile.fullName}
          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
        />
        <TextField
          label="Job Title"
          name="jobTitle"
          value={profile.jobTitle}
          onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={profile.email}
          error={errors.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <TextField
          label="Phone"
          name="phone"
          value={profile.phone ?? ""}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />
        <TextField
          label="Location"
          name="location"
          value={profile.location ?? ""}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
        />
        <TextField
          label="Website"
          name="website"
          value={profile.website ?? ""}
          error={errors.website}
          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
        />
        <TextField
          label="LinkedIn"
          name="linkedin"
          value={profile.linkedin ?? ""}
          error={errors.linkedin}
          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
        />
        <TextField
          label="GitHub"
          name="github"
          value={profile.github ?? ""}
          error={errors.github}
          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
        />
      </div>
    </SectionCard>
  );
}
