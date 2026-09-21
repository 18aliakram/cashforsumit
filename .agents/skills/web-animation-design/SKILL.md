---
name: web-animation-design
description: "Design and implement web animations that feel natural and purposeful. Use this skill proactively whenever the user asks questions about animations, motion, easing, timing, duration, springs, transitions, or animation performance. This includes questions about how to animate specific UI elements, which easing to use, animation best practices, or accessibility considerations for motion. Triggers on: easing, ease-out, ease-in, ease-in-out, cubic-bezier, bounce, spring physics, keyframes, transform, opacity, fade, slide, scale, hover effects, microinteractions, Framer Motion, React Spring, GSAP, CSS transitions, entrance/exit animations, page transitions, stagger, will-change, GPU acceleration, prefers-reduced-motion, modal/dropdown/tooltip/popover/drawer animations, gesture animations, drag interactions, button press feel, feels janky, make it smooth."
metadata:
  short-description: Design and implement web animations that feel natural and purposeful
---

# Web Animation Design

A comprehensive guide for creating animations that feel right, based on Emil Kowalski's "Animations on the Web" course.

## Review Format (Required)

When reviewing animations, you MUST use a markdown table. Do NOT use a list with "Before:" and "After:" on separate lines. Always output an actual markdown table like this:

| Before                            | After                                           |
| --------------------------------- | ----------------------------------------------- |
| `transform: scale(0)`             | `transform: scale(0.95)`                        |
| `animation: fadeIn 400ms ease-in` | `animation: fadeIn 200ms ease-out`              |
| No reduced motion support         | `@media (prefers-reduced-motion: reduce) {...}` |

## Quick Start

Every animation decision starts with these questions:

1. **Is this element entering or exiting?** → Use `ease-out`
2. **Is an on-screen element moving?** → Use `ease-in-out`
3. **Is this a hover/color transition?** → Use `ease`
4. **Will users see this 100+ times daily?** → Don't animate it

## The Easing Blueprint

### ease-out (Most Common)

Use for **user-initiated interactions**: dropdowns, modals, tooltips, any element entering or exiting the screen.

```css
/* Sorted weak to strong */
--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
--ease-out-circ: cubic-bezier(0.075, 0.82, 0.165, 1);
```

Why it works: Acceleration at the start creates an instant, responsive feeling. The element "jumps" toward its destination then settles in.

### ease-in-out (For Movement)

Use when **elements already on screen need to move or morph**. Mimics natural motion like a car accelerating then braking.

```css
/* Sorted weak to strong */
--ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
--ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
--ease-in-out-quint: cubic-bezier(0.86, 0, 0.07, 1);
--ease-in-out-expo: cubic-bezier(1, 0, 0, 1);
--ease-in-out-circ: cubic-bezier(0.785, 0.135, 0.15, 0.86);
```

### ease (For Hover Effects)

Use for **hover states and color transitions**. The asymmetrical curve (faster start, slower end) feels elegant for gentle animations.

```css
transition: background-color 150ms ease;
```

### Performance & GPU Acceleration

1. **Only animate `transform` and `opacity`**. Avoid animating width, height, margin, padding, or layout-triggering properties.
2. Keep UI entrance animations under **200ms - 300ms**.
3. Respect `@media (prefers-reduced-motion: reduce)`.
