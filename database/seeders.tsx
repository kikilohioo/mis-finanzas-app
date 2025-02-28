import { DBExpenseType, Seeder } from "../components/Types";

export default function seeders(): Array<Seeder<DBExpenseType>> {
  return [
    {
      table: "expenses",
      data: [
        {
          amount: "1001.1",
          store: "Tienda de la esquina",
          paymentType: "debit",
          date: "2025-02-10T08:30:12.500Z",
          category: "Comida",
        },
        {
          amount: "2222.1",
          store: "Tienda de la esquina 2",
          paymentType: "credit",
          date: "2025-02-11T08:30:12.500Z",
          category: "Otros",
        },
      ],
    },
  ];
}
