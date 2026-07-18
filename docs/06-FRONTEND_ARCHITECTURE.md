# Resume Studio AI

Version: 1.0

Status: Approved

Owner: Alxpace

Last Updated: July 2026

---

# Frontend Architecture

## Purpose

This document defines the frontend implementation architecture for Resume Studio AI.

It specifies

- Folder organization
- Component boundaries
- Routing
- State management
- Rendering strategy
- Data flow
- Performance strategy

The goal is to ensure every engineer writes code in the same way.

---

# Frontend Philosophy

The frontend should be

- Modular
- Predictable
- Reusable
- Performant
- Accessible
- Type-safe
- Easy to maintain

The application should scale without requiring major rewrites.

---

# Architecture Style

The project follows

Feature-Based Architecture

combined with

Component-Driven Development

and

Atomic UI Principles.

Business logic must remain inside features.

Shared UI belongs to the shared layer.

---

# Root Folder Structure

```
src/

├── app/
├── features/
├── shared/
├── lib/
├── hooks/
├── store/
├── styles/
├── constants/
├── types/
├── utils/
├── assets/
└── config/
```

Every folder has a single responsibility.

---

# App Router

```
app/

layout.tsx

page.tsx

dashboard/

resume/

templates/

ats/

settings/

editor/

preview/

```

Every route represents a user feature.

Never create routes only for components.

---

# Route Hierarchy

```
/

↓

Dashboard

↓

Resume List

↓

Resume Editor

↓

Preview

↓

Export
```

Navigation should always feel shallow.

Avoid deeply nested routes.

---

# Layout Structure

```
RootLayout

↓

DashboardLayout

↓

Page

↓

Feature

↓

Components
```

Shared navigation belongs inside layouts.

Never duplicate navigation.

---

# Feature Organization

Every feature owns

Components

Hooks

Services

Types

Constants

Utils

Validation

Example

```
features/

resume/

components/

hooks/

services/

validators/

types/

utils/

constants/

index.ts
```

---

# Shared Layer

Contains only reusable UI.

Examples

Button

Input

Modal

Dialog

Card

Badge

Tooltip

Avatar

Spinner

EmptyState

Skeleton

Shared components must never contain resume logic.

---

# Component Categories

The project contains four categories.

## UI Components

Generic

Reusable

No business logic.

---

## Feature Components

Specific to one feature.

Example

ResumeEditor

ProjectForm

ExperienceList

---

## Layout Components

Navigation

Sidebar

Header

Footer

Shell

---

## Template Components

Only responsible for rendering exported resumes.

Never reused elsewhere.

---

# Component Rules

Each component should

Do one thing.

Receive explicit props.

Avoid unnecessary state.

Expose a clean API.

Never exceed approximately 250 lines unless justified.

Break large components into smaller ones.

---

# Component Composition

Prefer

```
<Card>

<CardHeader>

<CardBody>

<CardFooter>

</Card>
```

Instead of giant configurable components.

Composition is preferred over configuration.

---

# Client vs Server Components

Default

Server Component

Use Client Components only when required.

Examples

Forms

State

Animations

Browser APIs

Theme switching

Everything else remains server-rendered.

---

# Rendering Strategy

Server

Landing page

Marketing pages

Documentation

Dashboard shell

Client

Editor

Forms

Resume preview interactions

Theme

Dialogs

---

# State Boundaries

Global State

Resume

Settings

Theme

History

Feature State

Current tab

Dialog open

Search query

Component State

Input focus

Dropdown open

Tooltip visibility

Never move local state into the global store unnecessarily.

---

# Zustand Store Structure

```
store/

resume.ts

settings.ts

history.ts

theme.ts
```

Each store owns one responsibility.

---

# Custom Hooks

Every reusable behavior becomes a hook.

Examples

useResume()

useExport()

useTemplate()

useATS()

useAutoSave()

useUndoRedo()

useKeyboardShortcuts()

Hooks should not render UI.

---

# Services

Business operations belong inside services.

Examples

ResumeService

PDFService

TemplateService

ATSService

AIService

StorageService

Services should remain framework-independent whenever possible.

---

# Utilities

Utilities must be

Pure functions.

Examples

formatDate()

slugify()

normalizeSkill()

calculateDuration()

groupSkills()

Utilities must never access global state.

---

# Configuration

Application configuration belongs inside

config/

Examples

Theme config

Export config

ATS weights

Animation config

Resume defaults

Avoid magic values.

---

# Constants

Store

Labels

Limits

Regex

Defaults

Paths

Separately from business logic.

---

# Type Organization

Types belong close to the feature.

Shared types go inside

types/

Avoid creating a single giant types file.

---

# Validation

Every form uses

React Hook Form

+

Zod

Validation schema lives beside the feature.

Never duplicate validation logic.

---

# Error Boundaries

Each major feature should have its own boundary.

Editor

↓

Editor fallback

Preview continues.

AI

↓

AI fallback

Everything else continues.

No single failure should crash the app.

---

# Suspense

Use Suspense for

Lazy-loaded routes

AI generation

PDF loading

Large templates

Never wrap the entire application.

Use granular boundaries.

---

# End of Part 1

---

# Component Hierarchy

The application follows a strict hierarchy.

```
App

│

├── Layout

│   ├── Sidebar
│   ├── Header
│   └── Main

│
├── Feature

│   ├── Container
│   ├── Section
│   ├── Card
│   └── Form

│
└── Shared UI
```

Higher-level components orchestrate.

Lower-level components render.

---

# Smart vs Dumb Components

Smart Components

Responsible for

- State
- Services
- Business logic
- Data loading

Examples

ResumeEditor

ResumeDashboard

ATSAnalyzer

PDFExporter

---

Presentational Components

Responsible only for rendering.

Examples

Button

Card

Input

ResumeHeader

ExperienceItem

SkillBadge

These components never fetch data.

---

# Data Flow

The application uses unidirectional data flow.

```
User

↓

Action

↓

Store

↓

Feature Service

↓

UI Update

↓

Render
```

Components never update each other directly.

---

# React Patterns

Preferred patterns

✓ Composition

✓ Custom Hooks

✓ Compound Components

✓ Controlled Forms

✓ Context only when necessary

Avoid

✗ HOCs

✗ Render Props

✗ Deep prop drilling

✗ Global Context for everything

---

# Memoization Rules

Use memoization only when profiling shows benefit.

Allowed

React.memo

useMemo

useCallback

Do not memoize every component by default.

Premature optimization is discouraged.

---

# Lazy Loading

Lazy load only expensive features.

Examples

AI Generator

PDF Engine

Template Gallery

Settings

Documentation

Do not lazy load

Buttons

Inputs

Cards

Small shared components

---

# Code Splitting

Split by route and feature.

```
Dashboard

Resume Editor

ATS

Templates

Settings
```

Each route should load only its required code.

---

# Auto Save Architecture

Auto-save is event driven.

```
User Input

↓

Validation

↓

Debounce (500ms)

↓

Store Update

↓

Storage Service

↓

Success Notification
```

Requirements

- Non-blocking
- Retry on failure
- Never lose user input

---

# Undo / Redo

Every state mutation creates a history entry.

```
Current State

↓

Action

↓

Snapshot

↓

History Stack
```

Commands supported

Undo

Redo

Restore

History size should be configurable.

---

# Keyboard Shortcuts

Global shortcuts

Ctrl + S

Save

Ctrl + Z

Undo

Ctrl + Shift + Z

Redo

Ctrl + P

Export PDF

Ctrl + /

Command Palette (future)

Esc

Close dialogs

All shortcuts must be documented.

---

# Accessibility Architecture

Every interactive element must support

Keyboard

Screen Readers

Visible Focus

Semantic HTML

Proper Labels

Use native HTML elements whenever possible.

Avoid unnecessary ARIA roles.

---

# Error Handling

Errors are categorized.

Recoverable

Validation

Network

Storage

AI timeout

Fatal

Corrupted state

Unexpected rendering failure

Recoverable errors show inline feedback.

Fatal errors activate Error Boundaries.

---

# Notifications

Use toast notifications only for

Save completed

Export completed

Copied

Deleted

Avoid excessive notifications.

Errors requiring action should use dialogs or alerts.

---

# Performance Optimization

Goals

Initial Load

<2 seconds

Route Transition

<150ms

Preview Refresh

<100ms

Export

<3 seconds

Strategies

- Route-based code splitting
- Dynamic imports
- Image optimization
- Font optimization
- Memoized selectors
- Virtualization if future lists become large

---

# Rendering Rules

Never re-render the entire editor when a single field changes.

Only affected components should update.

Selectors should be as granular as possible.

---

# Asset Strategy

Optimize

Icons

Fonts

Images

Illustrations

Avoid large static assets.

Use SVG where appropriate.

---

# Internationalization

Architecture should be i18n-ready.

All visible text should come from translation files.

Avoid hardcoded strings inside components.

Version 1 ships with English.

Future versions may support additional languages.

---

# Security

Never trust user input.

Escape rendered HTML.

Sanitize imported resume data.

Do not expose secrets to the client.

---

# Testing Architecture

Unit Tests

- Utilities
- Hooks
- Services
- Validators

Component Tests

- Forms
- Cards
- Dialogs
- Resume Sections

Integration Tests

- Resume Creation
- Editing
- Export
- ATS Analysis

End-to-End Tests

- Complete resume workflow
- Import → Edit → Export
- Keyboard shortcuts
- Accessibility flows

---

# Logging

Development

Verbose console logging.

Production

Minimal logging.

Never log

- Personal data
- Resume contents
- API keys
- Tokens

---

# Deployment

Primary Platform

Vercel

Requirements

- Zero-downtime deployments
- Environment separation
- Automatic previews
- CI integration

Future

Docker

Self-hosted deployment

---

# Monitoring

Future integrations

- Error tracking
- Performance monitoring
- Usage analytics

Monitoring must never collect resume content without user consent.

---

# Engineering Checklist

Before merging a feature, verify:

✓ TypeScript passes

✓ ESLint passes

✓ Prettier formatted

✓ Responsive

✓ Accessible

✓ Keyboard navigation works

✓ Tests pass

✓ No console errors

✓ No hydration issues

✓ Performance acceptable

✓ Documentation updated

---

# Definition of Done

A frontend feature is complete only if:

✓ Business requirements are implemented

✓ UI follows the Design System

✓ Domain rules are respected

✓ State management is correct

✓ Accessibility requirements are met

✓ Responsive across supported devices

✓ Unit and integration tests pass

✓ No performance regressions

✓ Code reviewed

✓ Documentation updated

Anything less is considered incomplete.

---

# End of Frontend Architecture