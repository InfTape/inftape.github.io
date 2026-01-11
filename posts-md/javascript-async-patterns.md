---
title: JavaScript Async Patterns Explained
date: 2025-12-28
description: Understanding callbacks, promises, and async/await in JavaScript
tags: [javascript, async, programming]
---

Asynchronous programming is a fundamental concept in JavaScript. Let's explore the evolution from callbacks to promises to async/await.

## Callbacks

The traditional way to handle async operations:

```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback(null, { data: "Hello" });
  }, 1000);
}

fetchData((err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(result);
});
```

### Callback Hell

Nested callbacks can become hard to manage:

```javascript
fetchUser(userId, (err, user) => {
  fetchOrders(user.id, (err, orders) => {
    fetchOrderDetails(orders[0].id, (err, details) => {
      // This gets messy fast!
    });
  });
});
```

## Promises

Promises provide a cleaner way to handle async operations:

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: "Hello" });
    }, 1000);
  });
}

fetchData()
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```

### Promise Chaining

```javascript
fetchUser(userId)
  .then((user) => fetchOrders(user.id))
  .then((orders) => fetchOrderDetails(orders[0].id))
  .then((details) => console.log(details))
  .catch((err) => console.error(err));
```

## Async/Await

The modern way to write async code that looks synchronous:

```javascript
async function getData() {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    const details = await fetchOrderDetails(orders[0].id);
    console.log(details);
  } catch (err) {
    console.error(err);
  }
}
```

## Parallel Execution

Use `Promise.all` for parallel operations:

```javascript
async function fetchAllData() {
  const [users, products, orders] = await Promise.all([
    fetchUsers(),
    fetchProducts(),
    fetchOrders(),
  ]);

  return { users, products, orders };
}
```

## Conclusion

Each pattern has its place. Use async/await for most cases, but understand promises and callbacks as they're still widely used in libraries and APIs.
