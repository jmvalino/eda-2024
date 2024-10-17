import { test } from "node:test";
import assert from "node:assert";
import {
  mapOrdersToBudgetPeriods,
  validateOrderAgainstBudget,
  getRemainingBudget,
} from "./task_2";

const testOrders = [
  {
    id: "1",
    amount: 1000,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-01-20"),
  },
  {
    id: "2",
    amount: 2000,
    startDate: new Date("2024-01-25"),
    endDate: new Date("2024-02-05"),
  },
  {
    id: "3",
    amount: 1500,
    startDate: new Date("2024-02-10"),
    endDate: new Date("2024-02-15"),
  },
  {
    id: "4",
    amount: 3000,
    startDate: new Date("2024-02-20"),
    endDate: new Date("2024-03-10"),
  },
];

const testBudgetPeriods = [
  {
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    budget: 5000,
    totalAmount: 0,
    orders: [],
  },
  {
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-29"),
    budget: 6000,
    totalAmount: 0,
    orders: [],
  },
  {
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-31"),
    budget: 7000,
    totalAmount: 0,
    orders: [],
  },
];

// Test mapOrdersToBudgetPeriods function
test("Map orders to budget periods", () => {
  const result = mapOrdersToBudgetPeriods(testOrders, testBudgetPeriods);
  assert.strictEqual(result[0].totalAmount > 0, true); // January budget
  assert.strictEqual(result[1].totalAmount > 0, true); // February budget
  assert.strictEqual(result[2].totalAmount > 0, true); // March budget
});

// Test validateOrderAgainstBudget function for valid order
test("Validate order within budget", () => {
  const order = {
    id: "1",
    amount: 1000,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-01-20"),
  };
  const result = validateOrderAgainstBudget(order, testBudgetPeriods);
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.exceededAmount, 0);
});

// Test validateOrderAgainstBudget function for exceeding budget
test("Validate order exceeding budget", () => {
  const order = {
    id: "5",
    amount: 6000,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-01-20"),
  };
  const result = validateOrderAgainstBudget(order, testBudgetPeriods);
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.exceededAmount > 0, true);
});

// Test getRemainingBudget function
test("Get remaining budget", () => {
  const remaining = getRemainingBudget(
    new Date("2024-01-15"),
    testBudgetPeriods
  );
  assert.strictEqual(remaining > 0, true);
});
