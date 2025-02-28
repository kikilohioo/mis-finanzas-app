import {
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Screen } from "../Screen";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { router, useFocusEffect } from "expo-router";
import { DBExpenseType } from "../Types";
import ExpenseModal from "../modals/Expense";

export function HomePage() {
  return <ExpenseModal />;
}
