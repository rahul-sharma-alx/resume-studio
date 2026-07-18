# Resume Studio AI

Version: 1.0

Status: Approved

Owner: Alxpace

Last Updated: July 2026

---

# Technology Stack

## Purpose

This document defines every technology used by Resume Studio AI.

It exists to ensure consistency across the project.

No technology should be introduced without updating this document.

The goal is to avoid dependency sprawl and maintain a predictable developer experience.

---

# Engineering Philosophy

Choose technologies that are

- Stable
- Well maintained
- Type-safe
- Production proven
- Tree-shakeable
- Accessible
- Easy to maintain

Prefer fewer high-quality dependencies over many small packages.

---

# Core Stack

## Framework

Next.js 15

Reason

- App Router
- Server Components
- Excellent performance
- Modern React architecture
- Long-term support
- Great deployment experience

---

## Language

TypeScript

Strict Mode enabled.

No JavaScript files inside src.

Rules

- noImplicitAny
- strictNullChecks
- exactOptionalPropertyTypes
- noUncheckedIndexedAccess

No `any` allowed.

---

## UI Library

React 19

Reason

- Component architecture
- Excellent ecosystem
- Server Components
- Strong TypeScript support

---

## Styling

Tailwind CSS v4

Reason

- Utility-first
- Small bundle
- Fast development
- Consistent spacing
- Responsive by default

Rules

Never write inline styles.

Prefer utility classes.

Extract reusable variants when repeated.

---

## UI Components

shadcn/ui

Reason

- Accessible
- Customizable
- No runtime overhead
- Excellent code quality

Never modify generated components directly.

Wrap them when customization is needed.

---

## Icons

Lucide React

Reason

- Tree-shakeable
- Lightweight
- Consistent
- Open source

Icons are used only in the application UI.

Never inside exported resumes.

---

## Fonts

Geist

Fallback

System UI

Segoe UI

Inter

sans-serif

Exported resumes should use professional system fonts.

---

# State Management

## Zustand

Reason

- Small
- Simple
- Fast
- Minimal boilerplate

Rules

One global store.

Feature-specific slices.

Never store derived state.

---

# Forms

React Hook Form

Reason

- Performance
- Type-safe
- Easy validation

---

# Validation

Zod

Every form.

Every domain entity.

Every imported resume.

must pass through Zod.

---

# Animation

Framer Motion

Purpose

Only micro interactions.

Examples

Page transitions

Modal animation

Accordion

Hover effects

Never animate the resume preview itself.

Never animate exported content.

Animation should communicate state, not distract.

---

# Theme

next-themes

Supports

Light

Dark

System

Resume export ignores application theme.

---

# PDF Strategy

Version 1

Browser Print

Print CSS

Reason

- Native
- Fast
- ATS-friendly
- Selectable text

Version 2

Puppeteer

Server-side PDF generation.

Future support

DOCX

Markdown

JSON

Never use

jsPDF

Canvas

Screenshot-based PDF generation

Image export

---

# Storage

Version 1

Local Storage

Version 2

IndexedDB

Version 3

Cloud Database

Storage implementation must remain abstract.

---

# AI

Provider abstraction.

Initial

OpenRouter

Future

OpenAI

Anthropic

Google Gemini

Groq

Local LLM

AI providers should be replaceable.

---

# Networking

Native fetch()

Avoid Axios unless a strong requirement appears.

Reason

Built into modern browsers and Next.js.

---

# Utility Libraries

date-fns

Purpose

Date formatting.

Avoid Moment.js.

---

clsx

Purpose

Conditional classes.

---

tailwind-merge

Purpose

Merge Tailwind classes safely.

---

class-variance-authority

Purpose

Reusable component variants.

---

# Code Quality

ESLint

Prettier

Husky

lint-staged

Every commit should pass

Type check

Lint

Format

Build

---

# Testing

Unit

Vitest

Component

React Testing Library

End-to-End

Playwright

Accessibility

axe-core

Coverage target

80%+

---

# Package Management

pnpm

Reason

Fast

Disk efficient

Reliable lockfile

---

# Build Tool

Next.js Build

No custom Webpack unless necessary.

Prefer official APIs.

---

# Environment Variables

Use

.env.local

Never expose secrets to the client.

Never hardcode API keys.

---

# File Naming

Components

PascalCase

ResumeHeader.tsx

Hooks

camelCase

useResume.ts

Utilities

camelCase

formatDate.ts

Types

PascalCase

Resume.ts

Constants

UPPER_SNAKE_CASE where appropriate.

---

# Import Strategy

Always use aliases.

Example

@/components

@/features

@/shared

@/lib

Avoid deep relative imports.

---

# Dependency Policy

Before adding a dependency ask

Can we build this ourselves easily?

Is it actively maintained?

Is it tree-shakeable?

Does it support TypeScript?

Is it accessible?

Will it increase bundle size significantly?

Prefer removing dependencies over adding new ones.

---

# Performance Targets

Initial JS

<150 KB

Lighthouse

95+

CLS

0

LCP

<2 seconds

INP

<200ms

Resume preview

<100ms update

---

# Accessibility Targets

WCAG AA

Keyboard navigation

Visible focus states

Semantic HTML

Proper labels

ARIA only when required

---

# Browser Support

Chrome

Edge

Firefox

Safari

Latest two versions.

---

# Mobile Support

Minimum width

320px

Maximum width

Unlimited

Responsive from day one.

---

# Technology Decisions

Rejected Technologies

## jsPDF

Reason

Poor typography

Limited CSS support

Inferior ATS compatibility

---

## Bootstrap

Reason

Opinionated

Less flexible

Larger CSS footprint

---

## Redux Toolkit

Reason

Overkill for current requirements.

---

## Material UI

Reason

Heavy

Opinionated design

Less aligned with product vision

---

## Chakra UI

Reason

Good library

But shadcn/ui offers greater control.

---

# Engineering Rule

The simplest production-quality solution always wins.

Avoid introducing new technologies unless they solve a measurable problem.

Consistency is more valuable than novelty.

---

# End of Tech Stack