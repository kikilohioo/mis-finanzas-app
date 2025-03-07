import { StyleSheet, View } from "react-native";
import Table from "../tables/Expenses";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { DBExpenseType } from "../Types";
import { Screen } from "../Screen";
import { ActivityIndicator, Text } from "react-native-paper";

export function HomePage() {
  const [data, setData] = useState<DBExpenseType[]>([]);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const loadData = async () => {
    const result = await database.getAllAsync<DBExpenseType>(
      "SELECT * FROM expenses"
    );
    console.log(result);
    setData(result);
  };

  const deleteExpense = async (expense_id: number) => {
    try {
      await database.runAsync("DELETE FROM expenses where id = ?", [expense_id]);
      await loadData();
      return true;
    } catch (ex) {
      return false;
    }
  };

  return (
    <Screen style={styles.screen}>
      {data.length > 0 ? <Table data={data} deleteExpense={deleteExpense} /> : <ActivityIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
  },
});
