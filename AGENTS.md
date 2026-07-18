<!-- BEGIN:nextjs-agent-rules -->
# AGENTS.md

# Resume Studio AI

Repository AI Instructions

Version: 1.0

Owner: Alxpace

---

# Mission

You are building Resume Studio AI.

Your goal is NOT to simply make the application work.

Your goal is to build a world-class,
production-quality,
ATS-first,
AI-powered Resume Builder
that could be confidently shipped by a senior engineering team.

Every implementation should prioritize

- maintainability
- simplicity
- scalability
- accessibility
- performance
- developer experience

over writing code as quickly as possible.

---

# First Rule

Before writing ANY code,

read the documentation.

Never guess.

If documentation exists,

documentation always wins.

---

# Required Reading Order

Before implementing any feature,
read these files in order.

01-PRD.md

00-PRODUCT_PRINCIPLES.md

02-SYSTEM_DESIGN.md

03-DOMAIN_MODEL.md

04-TECH_STACK.md

05-DESIGN_SYSTEM.md

06-FRONTEND_ARCHITECTURE.md

07-UI_UX_SPECIFICATION.md

08-CODING_STANDARDS.md

Read them completely.

Do not skip sections.

---

# Source of Truth

Priority order

1. User request

2. PRD

3. Domain Model

4. System Design

5. Design System

6. Coding Standards

7. Existing implementation

If implementation conflicts with documentation,

documentation wins.

---

# Never Guess

If required information is missing,

STOP.

Ask questions.

Never invent

- business rules
- API contracts
- resume sections
- database schema
- ATS logic
- AI prompts
- export behavior

---

# Before Every Task

Understand

↓

Plan

↓

Implement

↓

Test

↓

Verify

↓

Document

Never jump directly into coding.

---

# Feature Workflow

Every feature follows this order.

Understand requirements

↓

Locate affected documents

↓

Locate affected features

↓

Plan implementation

↓

Implement

↓

Test

↓

Refactor

↓

Verify accessibility

↓

Verify responsiveness

↓

Update documentation

↓

Commit

Never skip steps.

---

# Architecture Rules

Always follow

Feature-first architecture.

Never create random folders.

Never place unrelated files together.

Business logic belongs inside services.

Rendering belongs inside components.

Behavior belongs inside hooks.

Validation belongs inside schemas.

State belongs inside stores.

---

# Component Rules

Components should

- have one responsibility
- receive explicit props
- remain small
- remain reusable

Target

100–200 lines.

Split components instead of growing them.

---

# State Rules

Keep state as local as possible.

Global state only for

Resume

Theme

Settings

History

Avoid unnecessary global state.

---

# Styling Rules

Use

Tailwind CSS

+

shadcn/ui

Never introduce another UI framework.

Never use inline styles.

Never hardcode colors.

Use design tokens.

---

# Accessibility

Every feature must support

Keyboard navigation

Visible focus

Semantic HTML

Screen readers

Reduced motion

Accessibility is not optional.

---

# Performance Rules

Always prefer

Server Components

over Client Components.

Client Components only when required.

Lazy load expensive features.

Never optimize blindly.

Measure first.

---

# Resume Rules

The exported resume must always be

- ATS friendly
- selectable text
- printable
- professional
- accessible

Never introduce

Icons

Gradients

Animations

Shadows

inside exported resumes.

---

# PDF Rules

Export uses

HTML

↓

Print CSS

↓

PDF

Never generate PDFs from screenshots.

Never rasterize text.

---

# Validation Rules

Every user input must pass

Zod validation.

Never trust imported data.

Never trust AI output.

Never trust browser storage.

---

# AI Rules

AI may

Improve wording

Improve grammar

Suggest keywords

Rewrite bullets

Generate summaries

AI must never

Invent

Companies

Experience

Projects

Achievements

Metrics

Skills

Certifications

Dates

Truthfulness is mandatory.

---

# Error Handling

Recover whenever possible.

Never swallow errors.

Never use empty catch blocks.

Provide meaningful user feedback.

---

# Dependencies

Before installing any package,

ask

Can the platform already do this?

Can existing libraries solve it?

Is this dependency maintained?

Is it worth the bundle size?

Prefer fewer dependencies.

---

# Code Quality

Never use

any

Never disable TypeScript.

Never disable ESLint.

Never ignore compiler errors.

Never leave TODO comments without tracking.

---

# Naming

Names should describe intent.

Prefer

ResumePreview

instead of

Preview

Prefer

calculateATSScore()

instead of

calculate()

---

# Testing

Every feature should include

validation

happy path

error path

edge cases

Accessibility should be verified.

---

# Documentation

Whenever architecture changes,

update documentation.

Never allow docs to become outdated.

---

# Before Finishing Any Task

Verify

✓ TypeScript passes

✓ Lint passes

✓ Build passes

✓ Responsive

✓ Accessible

✓ No console errors

✓ No hydration issues

✓ Documentation updated

Only then consider the task complete.

---

# Forbidden

Never

- invent features
- invent APIs
- invent routes
- invent design patterns
- invent business rules
- duplicate logic
- duplicate validation
- duplicate components
- duplicate state
- bypass architecture
- bypass documentation

---

# If Existing Code Is Wrong

Do not silently rewrite large portions.

Explain

- the issue
- the impact
- the proposed solution

Then implement the smallest safe change.

---

# Communication Style

When working on a task,

always explain

1. What you are changing

2. Why it is needed

3. Files affected

4. Risks

5. Verification performed

Keep explanations concise.

---

# Definition of Success

Success is not

"the feature works."

Success is

The feature

- follows the architecture
- follows the design system
- follows the domain model
- is maintainable
- is accessible
- is responsive
- is fully typed
- is documented
- is production ready

---

# Engineering Principle

Every commit should leave the repository

better

cleaner

simpler

more maintainable

than before.

Optimize for the next engineer.

That engineer may be another AI.

---

# Final Rule

When multiple implementations are possible,

choose the one that

- reduces complexity
- improves maintainability
- preserves architecture
- follows documentation
- minimizes future technical debt

Never optimize for short-term speed at the cost of long-term quality.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
