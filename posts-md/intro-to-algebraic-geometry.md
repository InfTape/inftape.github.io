---
title: Introduction to Algebraic Geometry
date: 2026-01-11
description: An introduction to the fundamental concepts of algebraic geometry
tags: [math, algebraic-geometry, tutorial]
---

Algebraic geometry is a branch of mathematics that studies the geometry of solutions to polynomial equations. It bridges abstract algebra and geometry, providing powerful tools for understanding the structure of mathematical objects.

## What is Algebraic Geometry?

At its core, algebraic geometry studies **algebraic varieties** — the sets of solutions to systems of polynomial equations. For example, the equation:

$$x^2 + y^2 = 1$$

defines a circle in the plane $\mathbb{R}^2$, which is a simple algebraic variety.

## Affine Varieties

An **affine variety** over a field $k$ is the set of common zeros of a collection of polynomials in $k[x_1, x_2, \ldots, x_n]$.

### Definition

Let $S \subseteq k[x_1, \ldots, x_n]$ be a set of polynomials. The **affine variety** defined by $S$ is:

$$V(S) = \{ (a_1, \ldots, a_n) \in k^n \mid f(a_1, \ldots, a_n) = 0 \text{ for all } f \in S \}$$

### Examples

1. **A point**: $V(x - a, y - b) = \{(a, b)\}$

2. **A line**: $V(ax + by + c) = \{(x, y) \mid ax + by + c = 0\}$

3. **A parabola**: $V(y - x^2)$

4. **An elliptic curve**: $V(y^2 - x^3 - ax - b)$ where $4a^3 + 27b^2 \neq 0$

## The Ideal-Variety Correspondence

There is a beautiful correspondence between algebraic varieties and ideals in polynomial rings.

### The Ideal of a Variety

Given a variety $V \subseteq k^n$, we define its **ideal** as:

$$I(V) = \{ f \in k[x_1, \ldots, x_n] \mid f(P) = 0 \text{ for all } P \in V \}$$

### Hilbert's Nullstellensatz

One of the most important theorems in algebraic geometry is **Hilbert's Nullstellensatz** (Zero Locus Theorem):

> **Theorem (Weak Nullstellensatz)**: Let $k$ be an algebraically closed field. If $I \subseteq k[x_1, \ldots, x_n]$ is an ideal such that $V(I) = \emptyset$, then $I = k[x_1, \ldots, x_n]$.

> **Theorem (Strong Nullstellensatz)**: For any ideal $I$:
> $$I(V(I)) = \sqrt{I}$$
> where $\sqrt{I} = \{f \mid f^n \in I \text{ for some } n > 0\}$ is the radical of $I$.

## Projective Varieties

To handle "points at infinity," we work in **projective space** $\mathbb{P}^n$.

### Projective Space

The projective space $\mathbb{P}^n$ over a field $k$ is defined as:

$$\mathbb{P}^n = (k^{n+1} \setminus \{0\}) / \sim$$

where $(x_0, \ldots, x_n) \sim (\lambda x_0, \ldots, \lambda x_n)$ for any $\lambda \neq 0$.

Points are written as $[x_0 : x_1 : \cdots : x_n]$.

### Homogeneous Polynomials

A polynomial $F(x_0, \ldots, x_n)$ is **homogeneous of degree $d$** if:

$$F(\lambda x_0, \ldots, \lambda x_n) = \lambda^d F(x_0, \ldots, x_n)$$

For example, $F(x, y, z) = x^2 + y^2 - z^2$ is homogeneous of degree 2.

## Bézout's Theorem

A fundamental result relating the degrees of varieties and their intersections:

> **Theorem (Bézout)**: Let $C$ and $D$ be projective plane curves of degrees $m$ and $n$ respectively, with no common component. Then:
> $$|C \cap D| = m \cdot n$$
> counting multiplicities.

For example, a line ($m = 1$) and a conic ($n = 2$) intersect in exactly $1 \times 2 = 2$ points (counting multiplicity).

## Divisors and Line Bundles

### Divisors

A **divisor** on a variety $X$ is a formal sum:

$$D = \sum_{i} n_i \cdot Y_i$$

where $Y_i$ are codimension-1 subvarieties and $n_i \in \mathbb{Z}$.

### The Riemann-Roch Theorem

For a curve $C$ of genus $g$ and a divisor $D$:

$$\ell(D) - \ell(K - D) = \deg(D) + 1 - g$$

where $K$ is the canonical divisor and $\ell(D) = \dim H^0(C, \mathcal{O}(D))$.

## Why Study Algebraic Geometry?

Algebraic geometry has profound applications in:

- **Number Theory**: Fermat's Last Theorem was proved using elliptic curves and modular forms
- **Cryptography**: Elliptic curve cryptography (ECC)
- **String Theory**: Calabi-Yau manifolds
- **Coding Theory**: Algebraic geometry codes

## Conclusion

This introduction barely scratches the surface of algebraic geometry. The field connects algebra, geometry, topology, and analysis in beautiful and unexpected ways. Key texts for further study include:

- Hartshorne's _Algebraic Geometry_
- Shafarevich's _Basic Algebraic Geometry_
- Eisenbud and Harris's _The Geometry of Schemes_

Happy exploring!
