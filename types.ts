
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum Category {
  FOOD = '飲食',
  TRANSPORT = '交通',
  HOUSING = '居住',
  ENTERTAINMENT = '娛樂',
  SHOPPING = '購物',
  HEALTH = '健康',
  EDUCATION = '教育',
  SALARY = '薪資',
  INVESTMENT = '投資',
  OTHER = '其他'
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  color: string;
  userId: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: TransactionType;
  category: Category;
  amount: number;
  date: string;
  note: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  categoryTotals: Record<string, number>;
  monthlyHistory: { month: string; income: number; expense: number }[];
}
