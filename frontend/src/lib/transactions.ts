export interface Transaction {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChartDataPoint {
  name: string;
  Income: number;
  Expenses: number;
}

export interface CategoryChartPoint {
  name: string;
  value: number;
}

// src/lib/transactions.ts
export function calculateTotals(transactions: any[]) {
  // যদি transactions অ্যারে না হয়, তবে খালি মান রিটার্ন করো
  if (!Array.isArray(transactions)) {
    return { income: 0, expenses: 0, balance: 0 };
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

export function groupByMonth(transactions: Transaction[]): ChartDataPoint[] {
  const monthMap = new Map<string, { income: number; expenses: number }>();

  for (const tx of transactions) {
    const date = new Date(tx.date);
    const key = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

    const entry = monthMap.get(key) ?? { income: 0, expenses: 0 };
    if (tx.type === "income") {
      entry.income += tx.amount;
    } else {
      entry.expenses += tx.amount;
    }
    monthMap.set(key, entry);
  }

  return Array.from(monthMap.entries()).map(([name, { income, expenses }]) => ({
    name,
    Income: income,
    Expenses: expenses,
  }));
}

export function groupByCategory(transactions: Transaction[]): CategoryChartPoint[] {
  const categoryMap = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type !== "expense") continue;
    categoryMap.set(tx.category, (categoryMap.get(tx.category) ?? 0) + tx.amount);
  }

  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}
