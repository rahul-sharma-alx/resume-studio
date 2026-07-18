# Resume Studio AI

Version: 1.0

Status: Draft

Owner: Alxpace

Last Updated: July 2026

---

# Domain Model

## Purpose

This document defines every business entity used throughout Resume Studio AI.

The domain model is the single source of truth for:

- TypeScript Interfaces
- Validation Rules
- State Management
- Resume Rendering
- AI Services
- PDF Export
- Future Database
- API Contracts

Every feature must use these domain models.

No duplicate models should exist.

---

# Domain Philosophy

Resume Studio AI follows Domain-Driven Design (DDD).

Business entities are separated from:

- UI
- Storage
- API
- AI
- Database

The domain layer contains only business concepts.

---

# Root Aggregate

The root aggregate of the application is

Resume

```
Resume
│
├── Profile
├── Summary
├── Experience[]
├── Project[]
├── SkillGroup[]
├── Education[]
├── Certification[]
├── Achievement[]
├── Language[]
├── SocialLink[]
├── ResumeSettings
└── Metadata
```

Every feature works through the Resume aggregate.

No feature should bypass it.

---

# Entity Classification

The domain contains three kinds of models.

## Aggregate Roots

- Resume
- JobDescription

---

## Entities

- Experience
- Project
- Education
- Certification
- Achievement
- Profile

Entities have identity.

---

## Value Objects

- Skill
- Language
- Contact
- DateRange
- SocialLink
- Theme
- ResumeScore

Value objects have no identity.

---

# Resume

The Resume entity represents one complete resume.

Responsibilities

- Own all resume sections
- Maintain metadata
- Track settings
- Store section order
- Store template selection

Rules

A Resume

must always contain

- Profile

may contain

- Summary
- Skills
- Experience
- Projects
- Education
- Certifications
- Achievements
- Languages

---

# Profile

Represents personal information.

Contains

- Full Name
- Job Title
- Email
- Phone
- Location
- Website
- Portfolio
- LinkedIn
- GitHub
- Professional Summary

Rules

Email must be valid.

Phone optional.

Portfolio optional.

GitHub optional.

Name required.

Job Title required.

---

# Summary

Represents professional introduction.

Rules

Recommended length

40–90 words

Must not contain

- Buzzword stuffing
- Generic filler
- False claims

Should emphasize

- Experience
- Technologies
- Business impact

---

# Experience

Represents professional work history.

Fields

- Company
- Position
- Employment Type
- Start Date
- End Date
- Current
- Location
- Description
- Achievements
- Technologies

Rules

Company required.

Role required.

Start Date required.

Current and End Date cannot both be active.

Achievements should use measurable impact whenever possible.

---

# Experience Achievement

Each experience contains multiple achievements.

Example

• Reduced API response time by 35%.

• Designed RBAC system.

• Improved deployment speed.

Rules

Minimum

1

Recommended

3–6

Maximum

8

Every achievement should begin with an action verb.

---

# Project

Represents portfolio projects.

Fields

- Name
- Description
- Technologies
- Role
- Duration
- GitHub
- Live Demo
- Features
- Achievements

Rules

Project name required.

Description required.

Technologies required.

Links optional.

Projects should demonstrate measurable engineering value.

---

# Skills

Skills are grouped.

Never store one flat array.

Preferred structure

```
Languages

Frameworks

Databases

Cloud

DevOps

Testing

Tools

Concepts
```

Benefits

Cleaner UI.

Better ATS matching.

Better filtering.

---

# Skill

Represents one technology.

Example

Laravel

Rules

Unique inside a group.

No duplicate skills.

Skill names follow canonical naming.

Example

Node.js

not

NodeJS

or

node js

---

# Education

Represents academic history.

Fields

Institution

Degree

Field

Start Date

End Date

Score

Location

Rules

Institution required.

Degree required.

Field optional.

Score optional.

---

# Certification

Represents professional certifications.

Examples

AWS

Google ACE

Azure

Oracle

Rules

Certificate Name required.

Issuer required.

Issue Date optional.

Expiry optional.

Credential URL optional.

---

# Achievement

Represents awards and notable accomplishments.

Examples

Hackathon Winner

Open Source Contributor

Employee Award

Top Performer

Rules

Should represent significant accomplishments.

Avoid duplicating work experience bullets.

---

# Language

Represents spoken languages.

Fields

Language

Proficiency

Allowed values

Native

Professional

Intermediate

Basic

---

# Social Link

Represents external profiles.

Examples

GitHub

LinkedIn

Portfolio

Twitter

Medium

Dev.to

Rules

Platform required.

URL required.

Must be valid.

---

# Resume Metadata

Metadata is never shown on the resume.

Contains

Created Date

Updated Date

Version

Resume ID

Selected Template

ATS Score

Last Optimized

Export Count

AI Version

Metadata exists only for application logic.

---

# Resume Settings

Contains UI preferences.

Examples

Theme

Accent Color

Section Order

Visible Sections

Paper Size

Margins

Line Height

Font Family

Export Options

Settings never affect business data.

---

# Domain Invariants

The following rules must always remain true.

A Resume always has one Profile.

A Resume may contain zero or more Experiences.

Every Experience belongs to exactly one Resume.

Projects are independent.

Skills belong to Skill Groups.

Education belongs to one Resume.

Metadata cannot exist without Resume.

Settings cannot exist without Resume.

These invariants must never be violated.

---

# End of Part 1

---

# Type System Principles

Every domain model must follow these rules.

- Strict TypeScript
- No `any`
- Immutable by default
- Explicit interfaces
- Shared enums
- Reusable value objects
- Zod validation for every entity

Every entity must have exactly one interface.

---

# Common Types

The following primitive aliases should exist.

```
ResumeId

UserId

ExperienceId

ProjectId

EducationId

CertificateId

AchievementId

SkillId

TemplateId
```

Every entity must have its own unique identifier.

Never use array indexes as identifiers.

---

# Enumerations

The application should define reusable enums instead of string literals.

Examples

EmploymentType

```
FullTime

PartTime

Internship

Contract

Freelance

SelfEmployed
```

---

WorkMode

```
Remote

Hybrid

Onsite
```

---

SkillCategory

```
Languages

Frameworks

Databases

Cloud

DevOps

Testing

Tools

Concepts

SoftSkills
```

---

LanguageLevel

```
Native

Professional

Advanced

Intermediate

Basic
```

---

ResumeTemplate

```
SoftwareEngineer

BackendEngineer

LaravelDeveloper

PHPDeveloper

FullStackDeveloper

Minimal

Executive
```

---

SectionType

```
Profile

Summary

Skills

Experience

Projects

Education

Certificates

Achievements

Languages

Links
```

---

# Validation Rules

Every entity has two levels of validation.

Level 1

Structural Validation

Examples

- Required fields
- Email format
- URL format
- Maximum length

---

Level 2

Business Validation

Examples

Experience

End Date

must be greater than

Start Date

---

Current Job

cannot have End Date

---

Summary

should contain

40–90 words

---

Projects

should contain

at least

2 technologies

---

# Profile Validation

Required

- Name
- Title
- Email

Optional

- Phone
- Portfolio
- GitHub
- LinkedIn

Constraints

Name

2–80 characters

Title

2–60 characters

Email

RFC compliant

Phone

International format preferred

---

# Experience Validation

Company required.

Role required.

Start date required.

Achievements

minimum

1

recommended

3–6

Technologies

minimum

1

recommended

4–8

---

# Project Validation

Name required.

Description required.

Technology list required.

GitHub optional.

Live Demo optional.

Recommended

Project should include measurable impact.

---

# Skill Validation

Canonical naming.

Examples

Good

```
Node.js

React

TypeScript

MySQL
```

Bad

```
nodejs

NODE

ts

mysql database
```

---

# Domain Events

The application communicates using events.

Examples

ResumeCreated

ResumeUpdated

ResumeDeleted

ExperienceAdded

ExperienceUpdated

ExperienceDeleted

ProjectAdded

TemplateChanged

PDFGenerated

ATSCompleted

AISuggestionGenerated

Events improve scalability.

---

# Entity Relationships

```
Resume

│

├── Profile (1)

├── Summary (0..1)

├── Experience (0..*)

├── Projects (0..*)

├── Education (0..*)

├── Certificates (0..*)

├── Skills (0..*)

├── Languages (0..*)

├── Links (0..*)

└── Metadata (1)
```

Cardinality should never change.

---

# Aggregate Rules

Only Resume can modify

Experience

Projects

Education

Skills

Certificates

Achievements

No entity should modify another directly.

---

# Resume Lifecycle

```
Create

↓

Draft

↓

Editing

↓

Validated

↓

Ready

↓

Exported

↓

Archived
```

Every resume always has one lifecycle state.

---

# Section Lifecycle

```
Hidden

↓

Visible

↓

Edited

↓

Validated

↓

Rendered

↓

Exported
```

Hidden sections are never rendered.

---

# Import Pipeline

Future feature.

Supported formats

PDF

DOCX

JSON

Markdown

Imported data always passes through

Validation

↓

Normalization

↓

Review

↓

Save

---

# Export Contracts

Supported outputs

PDF

JSON

Markdown

DOCX (future)

Every exporter consumes the same Resume model.

Exporters never own business logic.

---

# Versioning Strategy

Resume schema must be versioned.

Example

```
v1

↓

v2

↓

v3
```

Migration scripts should transform old data automatically.

Never break existing resumes.

---

# Domain Services

Services contain business logic that does not belong to one entity.

Examples

ResumeScoreService

KeywordMatchService

ResumeValidationService

DateFormattingService

SectionOrderingService

TemplateResolverService

ExportPreparationService

AISuggestionService

These services remain independent of UI.

---

# Domain Rules

Business rules must always remain true.

✓ Resume always has one Profile

✓ Profile always has one Name

✓ Experience must belong to one Resume

✓ Empty sections are never rendered

✓ Hidden sections are never exported

✓ ATS score cannot exceed 100

✓ AI never changes resume without approval

✓ Resume data is independent of templates

---

# Anti-Patterns

Never

❌ Duplicate Profile

❌ Duplicate Experience

❌ Duplicate Skills

❌ Store UI state inside Resume

❌ Store HTML inside models

❌ Store React components inside models

❌ Couple Resume with PDF generation

❌ Couple Resume with AI provider

❌ Couple Resume with Storage implementation

---

# Domain Ownership

Every feature owns only its own entities.

Resume

owns

Resume

Profile

Experience

Projects

Education

AI

owns

Suggestions

Keyword Extraction

Optimization

PDF

owns

Rendering

Pagination

Export

ATS

owns

Analysis

Scoring

Recommendations

This separation must never be violated.

---

# Future Database Mapping

Every Aggregate Root maps to its own collection/table.

Example

Resume

↓

resume

Experience

↓

resume_experience

Projects

↓

resume_projects

Skills

↓

resume_skills

The frontend should not depend on database structure.

---

# Domain Evolution

Adding a new feature must never require rewriting existing domain entities.

Prefer extension over modification.

Example

Adding

Volunteer Experience

should introduce

VolunteerExperience

instead of modifying

Experience

when business rules differ significantly.

---

# Definition of a Valid Resume

A Resume is considered valid when:

✓ Profile is complete

✓ Required contact information exists

✓ At least one Experience or Project exists

✓ No validation errors remain

✓ Dates are consistent

✓ Links are valid

✓ Sections follow visibility rules

✓ Domain invariants are satisfied

Only valid resumes can be exported.

---

# End of Domain Model