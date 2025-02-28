export default function migrations() {
  return [
    {
      table: "expenses",
      attributes: {
        id: "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
        amount: "TEXT NOT NULL",
        store: "TEXT NOT NULL",
        paymentType: "TEXT NOT NULL",
        date: "TEXT NOT NULL",
        category: "TEXT NOT NULL",
      },
      foreignKeys: []
    }
  ];
}
