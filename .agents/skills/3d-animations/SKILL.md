---
name: 3d-animations
description: Expert knowledge for CSS and JavaScript-based 3D animations, perspective transforms, depth effects, card flips, cube rotations, parallax depth, Zdog, Vanta.js, and Vanilla-Tilt.js without requiring heavy WebGL. Use when adding 3D perspective, interactive card tilts, 3D transform animations, parallax layers, or lightweight 3D micro-interactions.
---

# 3D Animations & Micro-Interactions

A comprehensive guide for CSS & JS-based 3D animations, perspective transforms, and lightweight 3D micro-interactions.

## Core Concepts

1. **CSS Perspective**: Always define `perspective: 1000px` on parent containers to establish 3D depth.
2. **Transform Style**: Use `transform-style: preserve-3d` on child containers to preserve 3D spatial position for child elements.
3. **Hardware Acceleration**: Animate `transform: translate3d(...)` or `rotate3d(...)` and `opacity` to leverage GPU rendering.
4. **Parallax & Depth**: Use `transform: translateZ(px)` to separate layers visually in 3D space during tilt or hover interactions.

## Key 3D Animation Patterns

### 1. 3D Card Tilt with Glare Effect (Vanilla-Tilt / CSS)

```css
.card-3d {
  transform-style: preserve-3d;
  transition: transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99);
}

.card-3d-content {
  transform: translateZ(40px);
}
```

### 2. 3D Card Flip Animation

```css
.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}
```

### 3. GPU Performance Rules
- Never animate `width`, `height`, `top`, or `margin` in 3D transforms.
- Wrap animations with `@media (prefers-reduced-motion: reduce)` to disable motion for users requesting reduced motion.
