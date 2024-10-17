import { BudgetPeriod } from "../domain/BudgetPeriod";
import { Order } from "../domain/Order";

// Helper function to check if two date ranges overlap
function isDateRangeOverlap(
  orderStart: Date,
  orderEnd: Date,
  periodStart: Date,
  periodEnd: Date
): boolean {
  return orderStart <= periodEnd && orderEnd >= periodStart;
}

// Function to map orders to budget periods
export function mapOrdersToBudgetPeriods(
  orders: Order[],
  budgetPeriods: BudgetPeriod[]
): BudgetPeriod[] {
  for (let order of orders) {
    let remainingAmount = order.amount;

    for (let period of budgetPeriods) {
      if (
        isDateRangeOverlap(
          order.startDate,
          order.endDate,
          period.startDate,
          period.endDate
        )
      ) {
        // Split amount if the order spans across periods
        const orderStart =
          order.startDate > period.startDate
            ? order.startDate
            : period.startDate;
        const orderEnd =
          order.endDate < period.endDate ? order.endDate : period.endDate;

        const timeSpan =
          (orderEnd.getTime() - orderStart.getTime()) /
          (order.endDate.getTime() - order.startDate.getTime());
        const amountForThisPeriod = remainingAmount * timeSpan;

        // Add order to the period
        period.orders.push(order);
        period.totalAmount += amountForThisPeriod;
        remainingAmount -= amountForThisPeriod;

        if (remainingAmount <= 0) break;
      }
    }
  }
  return budgetPeriods;
}

// Function to validate if an order exceeds the budget
export function validateOrderAgainstBudget(
  order: Order,
  budgetPeriods: BudgetPeriod[]
): { isValid: boolean; remainingBudget: number; exceededAmount: number } {
  let totalBudget = 0;
  let totalAmountSpent = 0;

  for (let period of budgetPeriods) {
    if (
      isDateRangeOverlap(
        order.startDate,
        order.endDate,
        period.startDate,
        period.endDate
      )
    ) {
      totalBudget += period.budget - period.totalAmount;
      totalAmountSpent += Math.min(order.amount, totalBudget);
      if (totalAmountSpent >= order.amount) break;
    }
  }

  const exceededAmount =
    totalAmountSpent < order.amount ? order.amount - totalAmountSpent : 0;

  return {
    isValid: exceededAmount === 0,
    remainingBudget: totalBudget - totalAmountSpent,
    exceededAmount: exceededAmount,
  };
}

// Function to get remaining budget for a specific date
export function getRemainingBudget(
  date: Date,
  budgetPeriods: BudgetPeriod[]
): number {
  const period = budgetPeriods.find(
    (period) => date >= period.startDate && date <= period.endDate
  );
  if (!period) throw new Error("No budget period found for the given date");

  return period.budget - period.totalAmount;
}
