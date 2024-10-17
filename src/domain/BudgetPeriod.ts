import { Order } from "./Order";

export interface BudgetPeriod {
  startDate: Date;
  endDate: Date;
  budget: number;
  totalAmount: number;
  orders: Order[];
}
