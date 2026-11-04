# Estimator Wizard Components (`src/components/estimator`)

## Overview
Decomposed modular step components powering the 3-step live pricing and booking wizard for room surface makeovers.

## Interface
- `StepRoomSize`: Step 1 component managing wall width and height inputs, live area computation, and nesting drops display.
- `StepFinishTier`: Step 2 component offering finish tier selection (Standard Wallpaper, Acoustic Louvers, Smart Blinds + Paneling).
- `StepReviewBook`: Step 3 component providing dynamic pricing breakdown, lead capture inputs (name, phone, society, flat number), and WhatsApp concierge dispatch.
- `AnimatedPrice`: Reusable number counter smoothly interpolating price changes using Framer Motion.

## Invariants
- `StepReviewBook`: Booking WhatsApp submission is strictly disabled until `isValidLeadName(name)` and `isValidLeadPhone(phone)` both return true.
- All step transitions are wrapped with `AnimatePresence` to guarantee smooth lateral slide transitions.
- All interactive controls conform to token-compliant corner radii (`rounded-2xl` or `rounded-3xl`).

## Side Effects
- `StepReviewBook`: Dispatches background POST request to `/api/leads/estimator` to capture intent before opening `https://wa.me/919700675637`.

## Verification
- Run: `node scripts/test-e2e.mjs`
