# Resume Studio AI

Version: 1.0

Status: Draft

Owner: Alxpace

Last Updated: July 2026

---

# System Design

## Purpose

This document defines the complete technical architecture of Resume Studio AI.

It serves as the blueprint for engineering decisions, scalability planning, component relationships, state management, rendering pipelines, and future SaaS expansion.

The architecture should support:

- High maintainability
- Reusability
- Performance
- ATS compatibility
- AI integration
- Future cloud synchronization
- Multi-template rendering
- Plugin-based extensibility

This document should be considered the source of truth for all architectural decisions.

---

# High Level Architecture

```
                    User
                      │
                      ▼
           ┌────────────────────┐
           │    Next.js App      │
           └────────────────────┘
                      │
      ┌───────────────┼────────────────┐
      │               │                │
      ▼               ▼                ▼
 Resume Editor   Resume Preview   AI Services
      │               │                │
      └───────────────┼────────────────┘
                      ▼
               Resume Engine
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
 Template Engine  PDF Engine   ATS Analyzer
                      │
                      ▼
               Export Pipeline
                      │
                      ▼
                    PDF
```

---

# Architecture Philosophy

The project follows five fundamental architectural principles.

## 1. Feature First

Everything belongs to a feature.

Never organize code only by file type.

Instead of

```
components/

hooks/

utils/
```

Prefer

```
features/

resume/

editor/

preview/

pdf/

ai/

templates/
```

Each feature owns its

- UI
- hooks
- services
- types
- utilities

---

## 2. Component Driven

Every UI element is reusable.

Example

```
ResumeHeader

ExperienceItem

SectionTitle

SkillBadge

ProjectCard
```

Never duplicate UI.

---

## 3. Data Driven

Resume templates never contain user data.

Templates receive data.

```
Template

↓

Profile

Experience

Projects

Education

↓

Render
```

Changing data automatically updates every template.

---

## 4. Single Source of Truth

There is only one profile.

There is only one experience list.

There is only one projects list.

Everything else references those models.

No duplicated resume information.

---

## 5. Future SaaS Ready

Today's architecture should support tomorrow's cloud platform.

MVP

↓

Cloud Sync

↓

Authentication

↓

Collaboration

↓

Team Workspaces

without rewriting the application.

---

# System Layers

```
Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer
```

---

# Presentation Layer

Responsible for

- UI
- User interactions
- Accessibility
- Responsive design
- Theme

Contains

```
Pages

Layouts

Components

Templates
```

No business logic should live here.

---

# Application Layer

Responsible for

Application workflows.

Examples

Resume creation

Template switching

PDF generation

Job description matching

Resume optimization

Export

This layer coordinates multiple services.

---

# Domain Layer

The most important layer.

Contains

Business models.

Example

```
Profile

Experience

Project

Skill

Education

Achievement
```

Business rules belong here.

Never inside components.

---

# Infrastructure Layer

Responsible for

Storage

PDF

AI

Future Database

Authentication

Analytics

External APIs

Everything external belongs here.

---

# Core Modules

The application consists of independent modules.

```
Resume Module

Editor Module

Preview Module

Template Module

PDF Module

AI Module

ATS Module

Storage Module

Theme Module

Settings Module
```

Each module can evolve independently.

---

# Data Flow

```
User

↓

Editor

↓

State Store

↓

Resume Engine

↓

Selected Template

↓

Preview

↓

PDF Engine

↓

Download
```

No component should modify data directly.

All changes pass through the state layer.

---

# State Management Philosophy

Single Global Store

```
Resume State

↓

Profile

Experience

Projects

Skills

Education

Achievements
```

Templates never own state.

Editor never owns resume data.

Everything comes from the global store.

---

# Rendering Pipeline

```
Resume Data

↓

Validation

↓

Transformation

↓

Template

↓

HTML

↓

Print CSS

↓

PDF
```

Every rendering stage has one responsibility.

Validation

↓

Clean Data

↓

Render

↓

Export

---

# Resume Engine

The Resume Engine is the heart of the application.

Responsibilities

- Combine data
- Apply template
- Validate sections
- Hide empty sections
- Sort experience
- Sort projects
- Format dates
- Build final document

It should know nothing about AI.

It should know nothing about PDF.

It only builds resumes.

---

# Template Engine

Templates never contain logic.

Templates receive

```
ResumeModel
```

and render UI.

Example

```
<SoftwareEngineerTemplate

    profile={...}

    experience={...}

    projects={...}

/>
```

Business rules belong inside the Resume Engine.

Templates remain presentation-only.

---

# PDF Engine

Responsibilities

Convert

HTML

↓

Printable Layout

↓

PDF

Requirements

- Semantic HTML
- Selectable Text
- Proper Margins
- ATS Compatible
- A4 Size
- Consistent Pagination

The PDF Engine should never modify resume content.

It only renders.

---

# ATS Analyzer

Independent module.

Input

Resume

↓

Analyze

↓

Return

```
ATS Score

Keyword Match

Formatting

Missing Skills

Suggestions
```

The analyzer never changes user data.

It only provides recommendations.

---

# Storage Layer

Initial MVP

```
Local Storage
```

Future

```
IndexedDB

↓

Cloud Database

↓

Synchronization
```

Storage implementation should remain replaceable.

No UI component should know where data is stored.

---

# Theme System

Themes should affect

- Application UI

Never

Resume PDF

Resume PDFs remain visually consistent regardless of user theme.

Dark mode should never change exported documents.

---

# Error Handling

Every feature should fail gracefully.

Examples

AI unavailable

↓

Resume Builder still works

PDF fails

↓

Show retry

Storage unavailable

↓

Temporary memory state

No single feature should break the entire application.

---

# Design Patterns

Recommended

✓ Composition

✓ Factory

✓ Strategy

✓ Adapter

✓ Repository (future)

✓ Dependency Injection (future)

Avoid

✗ God Components

✗ Giant Context Providers

✗ Massive Utility Files

✗ Business Logic inside JSX

✗ Prop Drilling

---

# Recommended Folder Structure

The project follows Feature-Based Architecture instead of Type-Based Architecture.

```
src/

│
├── app/
│
├── components/
│
├── features/
│   │
│   ├── resume/
│   │
│   ├── editor/
│   │
│   ├── preview/
│   │
│   ├── templates/
│   │
│   ├── pdf/
│   │
│   ├── ats/
│   │
│   ├── ai/
│   │
│   ├── jd/
│   │
│   ├── storage/
│   │
│   └── settings/
│
├── shared/
│
├── lib/
│
├── hooks/
│
├── store/
│
├── styles/
│
├── types/
│
├── constants/
│
├── utils/
│
└── assets/
```

---

# Feature Architecture

Every feature owns everything it needs.

Example

```
features/

resume/

├── components/

├── hooks/

├── services/

├── utils/

├── types/

├── constants/

├── validators/

└── index.ts
```

Benefits

- Independent
- Easy testing
- Easy maintenance
- Easy extraction
- Better scalability

---

# Shared Layer

Only generic reusable code belongs here.

```
shared/

components/

Button

Input

Textarea

Select

Modal

Dialog

Tooltip

Badge

Card

Avatar
```

Never place Resume-specific components inside shared.

---

# Resume Module

Responsibilities

- Resume Models
- Resume Validation
- Resume Rendering
- Resume Transformations

Folder

```
features/

resume/

├── models/

├── services/

├── transformers/

├── validators/

├── hooks/

└── utils/
```

---

# Editor Module

Responsible for

Editing user information.

Contains

```
Editor Layout

Section Forms

Validation

Auto Save

Undo

Redo
```

Editor never generates PDF.

Editor never renders templates.

---

# Preview Module

Responsible for

Rendering live resume preview.

Contains

```
Preview Container

Zoom

Print Preview

Responsive Preview

Page Break Visualization
```

Preview never edits data.

---

# Template Module

Responsible for

Visual layouts.

Example

```
Software Engineer

Backend

Laravel

Minimal

Professional

Executive
```

Templates never fetch data.

Templates never modify data.

---

# PDF Module

Responsible only for exports.

```
Generate PDF

Print CSS

Pagination

Margins

Page Breaks

Header/Footer
```

No UI logic.

---

# ATS Module

Responsible for

Resume quality analysis.

Functions

```
Keyword Matching

Section Validation

Formatting Analysis

Readability

Suggestions
```

The ATS module never edits resumes.

---

# AI Module

Future implementation.

Responsible for

```
Summary Generator

Bullet Optimizer

Grammar

Keyword Suggestions

Cover Letter

HR Email

LinkedIn Summary

Portfolio Summary
```

AI never directly updates state.

Every suggestion requires approval.

---

# Storage Module

Abstract storage.

Current implementation

```
Local Storage
```

Future

```
IndexedDB

↓

Cloud Sync

↓

Database
```

Changing storage should not affect UI.

---

# Component Hierarchy

```
App

↓

Dashboard

↓

Resume Editor

↓

Resume Sections

↓

Section Components

↓

Input Components
```

Preview

↓

Resume Template

↓

Resume Sections

↓

Typography Components

---

# Resume Component Tree

```
Resume

│

├── Header

│

├── Summary

│

├── Skills

│

├── Experience

│

├── Projects

│

├── Education

│

├── Certifications

│

├── Achievements

│

└── Footer
```

Each section should be independently reusable.

---

# Data Models

Every resume follows the same model.

```
Resume

│

├── Profile

├── Skills

├── Experience

├── Projects

├── Education

├── Certifications

├── Achievements

├── Languages

└── Links
```

Templates only consume this object.

---

# Rendering Flow

```
User Input

↓

Validation

↓

State Store

↓

Resume Engine

↓

Selected Template

↓

HTML

↓

Preview
```

PDF uses same HTML.

No duplicate rendering.

---

# State Management

Single Zustand Store.

```
ResumeStore

│

├── Profile

├── Experience

├── Projects

├── Skills

├── Education

├── Certificates

├── Settings

└── History
```

Benefits

- Predictable
- Fast
- Easy Debugging
- No Prop Drilling

---

# State Rules

Never mutate state.

Always use actions.

Example

```
updateProfile()

addExperience()

updateExperience()

deleteExperience()

duplicateResume()
```

Never

```
profile.name = "Rahul"
```

---

# Event Flow

```
User Types

↓

Action

↓

Store Update

↓

Resume Engine

↓

Preview Refresh
```

No manual synchronization.

---

# Validation Pipeline

Every save follows

```
User Input

↓

Zod Validation

↓

Business Rules

↓

State Update

↓

Preview Update
```

Invalid data never reaches the store.

---

# Print Pipeline

```
Resume

↓

Print Layout

↓

Print CSS

↓

Browser Print

↓

PDF
```

Print layout is isolated from screen layout.

---

# Template System

Templates behave like plugins.

```
Template Interface

↓

Software

↓

Backend

↓

Laravel

↓

Minimal
```

Every template implements the same interface.

---

# Template Contract

Every template must support

```
Profile

Summary

Skills

Experience

Projects

Education
```

Optional

```
Certificates

Achievements

Languages
```

---

# Resume Engine Flow

```
Resume Data

↓

Normalize

↓

Validate

↓

Sort

↓

Transform

↓

Render

↓

Preview
```

The engine owns formatting.

Templates own appearance.

---

# Error Boundaries

Every major feature has its own boundary.

```
Editor Error

↓

Editor Fallback

Preview continues.
```

```
AI Error

↓

AI Disabled

Resume Builder continues.
```

Application should never crash because of one feature.

---

# Dependency Rules

Allowed

```
Feature

↓

Shared
```

Allowed

```
Feature

↓

Lib
```

Not Allowed

```
Feature A

↓

Feature B

↓

Feature A
```

Avoid circular dependencies.

---

# Import Rules

Always use aliases.

```
@/features/

@/shared/

@/lib/

@/types/
```

Never use long relative imports.

---

# Scalability

Current

```
Frontend Only
```

Future

```
Frontend

↓

API

↓

Database

↓

AI Services

↓

Analytics

↓

Payments
```

Frontend architecture should remain unchanged.

---

# Design Principles

Every component should follow

Single Responsibility Principle.

Small.

Reusable.

Predictable.

Testable.

Accessible.

---

# Documentation Rule

Every exported hook.

Every service.

Every utility.

Every complex function.

must contain documentation comments.

Future contributors should understand the project without asking questions.

---

# End of Part 2

---

# Type System

The application follows a Domain-Driven type system.

Every entity must have its own interface.

Never use anonymous objects.

Bad

{
  name: string
}

Good

Profile

Experience

Project

Resume

Skill

Education

Certificate

Achievement

Language

ResumeSettings

---

# Domain Models

The Resume domain contains the following entities.

Resume

Profile

Experience

Project

Skill

Education

Certificate

Achievement

Language

SocialLink

Theme

ResumeMetadata

JobDescription

ATSReport

AISuggestion

Each entity owns its own validation rules.

---

# Resume Aggregate

Resume is the root aggregate.

```
Resume
│
├── Profile
├── Skills
├── Experience
├── Projects
├── Education
├── Certificates
├── Achievements
├── Languages
└── Settings
```

No feature should bypass the Resume aggregate.

---

# Resume Engine

The Resume Engine is responsible for transforming raw user data into a printable resume.

Responsibilities

- Normalize data

- Sort sections

- Remove empty sections

- Format dates

- Format links

- Apply template rules

- Build final render tree

The Resume Engine should never know

- AI

- PDF

- Storage

- Database

It is purely a transformation engine.

---

# Resume Rendering Pipeline

```
Resume Data

↓

Validation

↓

Normalization

↓

Transformation

↓

Template Selection

↓

Render Tree

↓

HTML

↓

Preview

↓

PDF
```

Every stage has one responsibility.

---

# Resume Transformation Layer

Before rendering,

data is transformed.

Examples

```
January 2024

↓

Jan 2024
```

```
GitHub URL

↓

github.com/alxpace
```

```
Empty Summary

↓

Hide Section
```

```
No Certificates

↓

Remove Section
```

Templates should never perform these operations.

---

# Template Strategy Pattern

Every template implements the same interface.

```
ResumeTemplate

↓

Software Template

↓

Backend Template

↓

Laravel Template

↓

Executive Template
```

Templates only define

Typography

Spacing

Section Order

Visual Style

They never define business logic.

---

# Resume Factory

The factory selects the correct template.

Input

```
Backend Engineer
```

↓

Output

```
BackendTemplate
```

Changing templates never changes resume data.

---

# Export Engine

The Export Engine converts HTML into portable documents.

Supported formats

Version 1

PDF

Version 2

DOCX

Markdown

JSON

HTML

Future formats can be added without changing Resume Engine.

---

# Export Pipeline

```
Resume

↓

Template

↓

HTML

↓

Print Layout

↓

Export Adapter

↓

PDF
```

Each export format has its own adapter.

---

# ATS Engine

The ATS Engine evaluates resume quality.

Input

Resume

↓

Analyze

↓

Output

ATS Report

The ATS Engine never edits resumes.

---

# ATS Evaluation Categories

The report contains

Formatting

Section Completeness

Keyword Match

Readability

Resume Length

Contact Information

Experience Quality

Action Verbs

Achievements

Grammar

Each category receives its own score.

---

# ATS Score

Overall score

```
100
```

Built from weighted categories.

Example

Formatting

20%

Keywords

25%

Experience

20%

Readability

15%

Projects

10%

Education

5%

Grammar

5%

Weights remain configurable.

---

# Job Description Engine

Purpose

Understand job descriptions.

Input

Raw text

↓

Output

Structured model

Extract

Role

Company

Experience

Required Skills

Preferred Skills

Responsibilities

Soft Skills

Technologies

Qualifications

The Resume Builder never parses JDs directly.

---

# Resume Matching Engine

Input

Resume

+

Job Description

↓

Compare

↓

Generate

Match Report

The report includes

Matched Skills

Missing Skills

Recommended Skills

Weak Areas

Optimization Suggestions

Coverage Percentage

---

# AI Engine

The AI Engine is completely isolated.

Responsibilities

Summary Generator

Bullet Optimizer

Grammar Fix

Keyword Optimizer

Cover Letter

HR Email

LinkedIn About

Portfolio Summary

Every capability is implemented as an independent service.

---

# AI Safety Rules

AI must never

Invent companies

Invent experience

Invent skills

Invent projects

Invent achievements

Invent metrics

Invent certifications

AI may only improve wording.

---

# Suggestion Flow

```
AI

↓

Suggestions

↓

Preview

↓

User Review

↓

Accept

↓

Resume Update
```

AI never updates resumes automatically.

---

# Command Pattern

Every user action becomes a command.

Examples

Update Profile

Add Experience

Delete Experience

Move Project

Generate PDF

Undo

Redo

Benefits

Easy history

Easy undo

Easy testing

Predictable behavior

---

# History System

Every mutation creates a snapshot.

```
State

↓

Action

↓

History

↓

Undo

↓

Redo
```

Future cloud synchronization becomes much easier.

---

# Event System

Features communicate using events.

Examples

Resume Updated

↓

Preview Refresh

Template Changed

↓

Preview Re-render

Theme Changed

↓

UI Update

Avoid direct coupling.

---

# Plugin Architecture

Everything extensible becomes a plugin.

Templates

Exporters

AI Providers

Storage

Themes

ATS Rules

Future developers can add functionality without modifying the core.

---

# Configuration System

Everything configurable belongs here.

Example

```
ATS Threshold

Resume Length

Supported Templates

Page Margins

Theme Defaults

AI Provider

Export Formats
```

Never hardcode configuration.

---

# Performance Strategy

Avoid unnecessary rendering.

Strategies

Memoization

Lazy Loading

Dynamic Imports

Server Components

Selective State Updates

Small Components

No unnecessary Context Providers.

---

# Caching Strategy

Cache

Templates

Fonts

Theme

AI Responses (future)

Job Description Analysis

Resume Preview

Never recompute expensive operations unnecessarily.

---

# Error Recovery

Every operation should fail gracefully.

Examples

AI Timeout

↓

Retry

↓

Fallback

Storage Failure

↓

Temporary Memory

↓

Recovery

Export Failure

↓

Retry

↓

Alternative Export

No data loss.

---

# Logging Strategy

Development

Verbose logging.

Production

Minimal logging.

Never log

Passwords

Personal Information

Resume Contents

API Keys

Sensitive user data.

---

# Security Principles

Never trust user input.

Always validate.

Escape output.

Prevent XSS.

Prevent HTML injection.

Sanitize imported resumes.

Never expose API keys.

---

# Future SaaS Architecture

Current

```
Frontend Only
```

↓

Phase 2

```
Frontend

↓

API

↓

Authentication

↓

Database
```

↓

Phase 3

```
Frontend

↓

API Gateway

↓

AI Services

↓

Resume Service

↓

Export Service

↓

Analytics

↓

Billing
```

The frontend should not require major rewrites.

---

# Testing Strategy

Unit Tests

Resume Engine

ATS Engine

Validators

Utilities

Integration Tests

Resume Builder

Preview

Export

AI Suggestions

End-to-End

Complete Resume Creation

JD Matching

PDF Export

Accessibility

Every critical user flow must be covered.

---

# System Quality Goals

Maintainability

★★★★★

Performance

★★★★★

Accessibility

★★★★★

Scalability

★★★★★

ATS Compatibility

★★★★★

Developer Experience

★★★★★

Reliability

★★★★★

Extensibility

★★★★★

---

# Architecture Decision

Whenever multiple implementations are possible,

choose the one that

- improves maintainability,
- reduces coupling,
- keeps ATS compatibility intact,
- and scales to future SaaS requirements,

even if it requires slightly more initial effort.

---

# End of System Design