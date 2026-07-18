# Resume Studio AI

Version: 1.0

Status: Approved

Owner: Alxpace

Last Updated: July 2026

---

# Design System

## Purpose

This document defines the visual language of Resume Studio AI.

Every screen, component, interaction, and exported resume must follow this design system.

The goal is to achieve consistency, accessibility, clarity, and maintainability.

A user should feel that the entire application was designed by one design team.

---

# Design Philosophy

Resume Studio AI is not a graphic design tool.

It is a professional productivity application.

The design should communicate

- Trust
- Speed
- Precision
- Professionalism
- Simplicity

Every interface element should help users complete tasks faster.

---

# Design Principles

## Clarity Over Decoration

Every visual element must have a purpose.

Remove anything that does not improve usability.

---

## Content First

Content is more important than visuals.

The interface exists to support information, not compete with it.

---

## Consistency

Identical actions must always look identical.

Never create multiple button styles for the same purpose.

---

## Accessibility

Every component must be usable

- by keyboard
- by screen reader
- with high contrast
- without animation

Accessibility is mandatory.

---

## Responsive by Default

Every component should work on

Desktop

Tablet

Mobile

without requiring redesign.

---

## Predictable Interfaces

Users should never wonder

"What happens if I click this?"

Every interaction should feel obvious.

---

# Visual Personality

The product should feel

Professional

Modern

Minimal

Premium

Fast

Calm

Confident

Avoid

Playful

Over-decorated

Flashy

Noisy

---

# Design Language

Inspired by

- Stripe Dashboard
- Linear
- Vercel
- Notion
- Raycast
- GitHub
- Apple

Characteristics

- Spacious layouts
- Subtle borders
- Low visual noise
- Excellent typography
- Clear hierarchy
- Small animations
- Strong focus indicators

---

# Grid System

Base Grid

8px

Every spacing value should be a multiple of 8 whenever practical.

Examples

4

8

16

24

32

40

48

56

64

96

128

Avoid arbitrary spacing values.

---

# Layout Widths

Application

Maximum

1440px

Content

1280px

Editor

720px

Preview

800px

Dialogs

480px

Forms

640px

Reading Width

680px

Avoid excessively wide text.

---

# Responsive Breakpoints

Mobile

320+

Tablet

768+

Laptop

1024+

Desktop

1280+

Wide

1536+

Design mobile-first.

---

# Spacing Scale

Use a consistent spacing scale.

```
0

2

4

8

12

16

20

24

32

40

48

56

64

80

96

128
```

Never invent new spacing values.

---

# Border Radius

Small

8px

Medium

12px

Large

16px

Extra Large

24px

Cards

16px

Dialogs

20px

Buttons

12px

Consistency is more important than variety.

---

# Border System

Default Border

1px

Strong Border

2px

Avoid heavy borders.

Prefer subtle contrast.

---

# Elevation

Use shadows sparingly.

Level 0

No Shadow

Level 1

Cards

Level 2

Dialogs

Level 3

Dropdowns

Level 4

Command Palette

Avoid excessive blur.

---

# Color Philosophy

Colors should communicate meaning.

Not decoration.

Color must never be the only indicator.

Icons and text should reinforce meaning.

---

# Semantic Colors

Primary

Application actions.

Success

Completed states.

Warning

Needs attention.

Danger

Errors.

Info

Neutral information.

Muted

Secondary content.

Every color must have semantic meaning.

---

# Neutral Palette

The interface should primarily use neutral colors.

Accent colors should occupy less than 10% of the screen.

The application should feel calm.

---

# Typography Philosophy

Typography is the primary design tool.

Hierarchy should come from

Size

Weight

Spacing

Contrast

Not excessive colors.

---

# Font Family

Application

Geist

Fallback

System UI

Segoe UI

Inter

Sans-serif

Resume PDFs

Professional system fonts only.

---

# Font Scale

Display

48

H1

36

H2

30

H3

24

H4

20

H5

18

Body Large

16

Body

14

Small

12

Caption

11

Use a consistent type scale.

---

# Font Weights

Regular

400

Medium

500

Semibold

600

Bold

700

Avoid excessive bold text.

---

# Line Heights

Headings

1.2

Body

1.6

Captions

1.4

Readable text is mandatory.

---

# Letter Spacing

Headings

Slightly tighter.

Body

Normal.

Avoid excessive tracking.

---

# Icons

Use Lucide icons only.

Standard sizes

16

18

20

24

Avoid oversized icons.

Icons support text.

They never replace labels.

---

# Illustration Policy

Illustrations are allowed only for

Empty states

Onboarding

Marketing pages

Never inside resume editing workflows.

---

# Imagery

Use authentic product screenshots.

Avoid stock photography inside the application.

---

# White Space

Whitespace is a feature.

Never try to fill empty areas.

Comfortable spacing improves comprehension.

---

# Density

Medium density.

Not overly compact.

Not overly spacious.

Prioritize readability over information density.

---

# End of Part 1

---

# Design Tokens

All visual values should originate from design tokens.

Never hardcode colors, spacing, radius, or shadows inside components.

Example

```
Primary

Background

Foreground

Muted

Border

Radius

Shadow

Spacing
```

Changing a token should update the entire application.

---

# Color System

The application supports

Light Theme

Dark Theme

System Theme

Exported resumes always use a dedicated print theme.

---

# Primary Color

Purpose

Primary actions.

Selected states.

Important links.

Current page indicator.

Rules

One primary color only.

Never introduce multiple brand colors.

---

# Surface Colors

Level 0

Application background.

Level 1

Cards.

Panels.

Forms.

Level 2

Dialogs.

Dropdowns.

Popover.

Level 3

Floating UI.

Every level should have subtle contrast.

---

# Text Colors

Primary Text

Headings

Important labels

Secondary Text

Descriptions

Muted Text

Helper text

Disabled Text

Unavailable actions

Maintain sufficient contrast.

---

# Status Colors

Success

Completed

Warning

Requires attention

Danger

Errors

Info

Neutral information

Each status should include

Background

Border

Text

Icon

Never rely on color alone.

---

# Button System

Buttons represent actions.

Each button has one purpose.

---

## Primary Button

Purpose

Main action.

Examples

Save Resume

Generate PDF

Optimize Resume

One primary button per section.

---

## Secondary Button

Purpose

Alternative actions.

Examples

Cancel

Back

Duplicate

---

## Ghost Button

Purpose

Low emphasis actions.

Examples

Edit

Copy

Preview

---

## Destructive Button

Purpose

Delete actions.

Always require confirmation.

---

## Icon Button

Purpose

Compact actions.

Must always include

Tooltip

Accessible label

Visible focus state

---

# Button Sizes

Small

Medium

Large

Extra Large

Never create custom button sizes.

---

# Button States

Default

Hover

Pressed

Focused

Loading

Disabled

Every state must be visually distinct.

---

# Loading States

Buttons should never disappear.

During loading

Disable interaction.

Show spinner.

Preserve width.

Avoid layout shift.

---

# Input System

Every input follows identical styling.

Supported types

Text

Email

Phone

Password

URL

Number

Textarea

Search

Date

---

# Input Anatomy

Label

↓

Input

↓

Helper Text

↓

Validation Message

Never omit labels.

Placeholder is not a label.

---

# Input States

Default

Hover

Focus

Filled

Disabled

Read Only

Error

Success

Consistent across every form.

---

# Validation

Validation should occur

On blur

or

On submit

Avoid validating every keystroke unless necessary.

Messages should explain

What is wrong

How to fix it

---

# Textarea

Auto resize.

Minimum height

120px

Maximum height

Reasonable scrolling.

Never allow horizontal scrolling.

---

# Select

Searchable when options exceed

10 items.

Keyboard navigation required.

---

# Checkbox

Use for

Multiple selections.

Never for binary actions requiring confirmation.

---

# Radio Group

Use when exactly one option can be selected.

Always visible.

Avoid dropdowns for fewer than five options.

---

# Toggle Switch

Represents

Immediate setting changes.

Example

Dark Mode

Auto Save

Never use toggle for destructive actions.

---

# Card System

Cards group related information.

Every card contains

Header

Body

Optional Footer

Cards should never nest deeply.

Maximum

Two levels.

---

# Dialogs

Dialogs interrupt workflow.

Use only when necessary.

Examples

Delete confirmation

Export options

Resume settings

Dialogs must trap keyboard focus.

---

# Drawer

Use drawers for

Editing

Settings

Filters

Mobile navigation

Avoid stacking multiple drawers.

---

# Tabs

Use tabs for

Independent content groups.

Examples

Profile

Experience

Projects

Education

Skills

Maximum

Seven tabs.

---

# Accordion

Use only for

Advanced options.

Rarely used content.

Avoid hiding primary actions.

---

# Table

Tables display structured information.

Examples

Resume versions

Application history

Export history

Always support

Responsive layout

Keyboard navigation

---

# Badge

Badges communicate status.

Examples

Draft

Optimized

Exported

ATS Ready

Never use badges as buttons.

---

# Alerts

Four alert types.

Info

Success

Warning

Danger

Every alert should explain

Problem

Impact

Recommended action

---

# Toast

Use for

Temporary confirmation.

Examples

Saved

Copied

Export completed

Maximum duration

4 seconds.

---

# Progress Indicator

Show progress for

AI generation

PDF export

Resume import

Long-running operations

Never leave users wondering.

---

# Search

Instant search.

Debounced.

Keyboard accessible.

Supports

Clear button

Recent searches (future)

---

# Empty States

Every empty screen should include

Illustration (optional)

Explanation

Primary action

Example

"No projects yet."

↓

"Add your first project."

---

# Skeleton Loading

Prefer skeletons over spinners.

Skeletons should resemble final layout.

Avoid layout shifts.

---

# Sidebar

Sidebar contains

Dashboard

Resumes

Templates

ATS

Settings

Collapsed mode supported.

Icons remain visible.

---

# Top Navigation

Minimal.

Contains

Logo

Theme Switch

Profile

Settings

No unnecessary links.

---

# Breadcrumb

Use for deep navigation only.

Never for simple dashboards.

---

# Tooltips

Required for

Icon buttons

Compact actions

Truncated text

Tooltips supplement UI.

Never replace labels.

---

# Focus States

Every interactive element must have

Visible keyboard focus.

Never remove outline without replacement.

---

# Motion Guidelines

Animations should

Communicate

Guide

Confirm

Never distract.

Maximum duration

250ms

Use easing consistently.

Respect

prefers-reduced-motion

---

# Resume Design Rules

The exported resume follows a separate design language.

Requirements

Single column

Professional typography

No shadows

No gradients

No rounded cards

No icons

No decorative graphics

Selectable text

High print contrast

ATS-friendly structure

---

# Resume Typography

Name

Largest text

Section headings

Bold

Body

Readable

Dates

Muted

Bullet spacing

Consistent

Maximum

Two font weights per section.

---

# Definition of Good Design

A screen is complete only if

✓ Clear hierarchy

✓ Consistent spacing

✓ Accessible

✓ Responsive

✓ Keyboard navigable

✓ Minimal visual noise

✓ Predictable interactions

✓ No unnecessary decoration

✓ Fast to scan

✓ Easy to maintain

If a design decision improves aesthetics but harms usability,

usability wins.

---

# End of Part 2