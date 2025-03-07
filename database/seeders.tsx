import { DBExpenseType, Seeder } from "../components/Types";

export default function seeders(): Array<Seeder<DBExpenseType>> {
  return [
    {
      table: "expenses",
      data: [
        {
          id: 1,
          amount: "1001.1",
          store: "Tienda de la esquina",
          paymentType: "debit",
          date: "2025-02-10 08:30:12.500",
          category: "Comida",
        },
        {
          id: 2,
          amount: "2222.1",
          store: "Tienda de la esquina 2",
          paymentType: "credit",
          date: "2025-02-11 08:30:12.500",
          category: "Otros",
        },
      ],
    },
  ];
}
