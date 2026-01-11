---
title: Introduction to Linear Algebra
date: 2026-01-11
description: A gentle introduction to linear algebra concepts with mathematical notation
tags: [math, linear-algebra, tutorial]
---

Linear algebra is the branch of mathematics concerning linear equations, linear functions, and their representations through matrices and vector spaces.

## Vectors

A vector is an ordered list of numbers. In $\mathbb{R}^n$, a vector can be written as:

$$\vec{v} = \begin{pmatrix} v_1 \\ v_2 \\ \vdots \\ v_n \end{pmatrix}$$

### Vector Operations

**Addition**: Two vectors can be added component-wise:

$$\vec{a} + \vec{b} = \begin{pmatrix} a_1 + b_1 \\ a_2 + b_2 \end{pmatrix}$$

**Scalar Multiplication**: A vector can be multiplied by a scalar $c$:

$$c\vec{v} = \begin{pmatrix} cv_1 \\ cv_2 \end{pmatrix}$$

**Dot Product**: The dot product of two vectors is:

$$\vec{a} \cdot \vec{b} = \sum_{i=1}^{n} a_i b_i = a_1b_1 + a_2b_2 + \cdots + a_nb_n$$

## Matrices

A matrix is a rectangular array of numbers. An $m \times n$ matrix has $m$ rows and $n$ columns:

$$A = \begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix}$$

### Matrix Multiplication

For matrices $A$ (size $m \times n$) and $B$ (size $n \times p$), the product $C = AB$ is:

$$c_{ij} = \sum_{k=1}^{n} a_{ik} b_{kj}$$

## Eigenvalues and Eigenvectors

An eigenvector of a square matrix $A$ is a non-zero vector $\vec{v}$ such that:

$$A\vec{v} = \lambda\vec{v}$$

where $\lambda$ is the corresponding eigenvalue.

To find eigenvalues, we solve the characteristic equation:

$$\det(A - \lambda I) = 0$$

## The Quadratic Formula

As a bonus, here's the famous quadratic formula. For $ax^2 + bx + c = 0$:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

## Euler's Identity

One of the most beautiful equations in mathematics:

$$e^{i\pi} + 1 = 0$$

This combines five fundamental constants: $e$, $i$, $\pi$, $1$, and $0$.

## Conclusion

Linear algebra is foundational to many fields including computer graphics, machine learning, and quantum mechanics. Understanding these concepts opens doors to advanced mathematics and its applications.
