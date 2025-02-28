export type DBExpenseType = {
  id?: number;
  amount: string;
  store: string;
  paymentType: string;
  date: string;
  category: string;
};

export type Seeder<T> = {
  table: string;
  data: T[];
};
