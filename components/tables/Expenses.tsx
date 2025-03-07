import React from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { DBExpenseType } from "../Types";
import { router } from "expo-router";

type ExpensesTableProps = {
  data: DBExpenseType[];
  deleteExpense: (expense_id: number) => Promise<boolean>;
};

const ExpensesTable = ({ data, deleteExpense }: ExpensesTableProps) => {
  const renderHeader = () => (
    <Surface style={styles.header}>
      <Text style={[styles.cell, styles.headerText, { flex: 2, width: 100 }]}>
        Local
      </Text>
      <Text style={[styles.cell, styles.headerText, { marginLeft: 20 }]}>
        Fecha
      </Text>
      <Text style={[styles.cellActions, styles.headerText]}>Acciones</Text>
    </Surface>
  );

  const handleOnDelete = async (expense_id: number = 0) => {
    await deleteExpense(expense_id);
  };

  const renderRow = ({ item }: { item: ExpensesTableProps["data"][0] }) => (
    <Surface style={styles.row}>
      <Text style={styles.cell}>{item.store}</Text>
      <Text style={styles.cell}>
        {item.date.includes("T")
          ? item.date.split("T")[0] +
            " " +
            item.date.split("T")[1].split(".")[0]
          : item.date.split(".")[0]}
      </Text>
      <View style={styles.actions}>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() =>
            router.push({
              pathname: "/modal",
              params: { expense_id: item.id },
            })
          }
        />
        <IconButton
          icon="delete"
          size={20}
          iconColor={"red"}
          onPress={() => handleOnDelete(item.id)}
        />
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRow}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#5886d1",
    marginBottom: 8,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    elevation: 2,
  },
  cell: {
    display: "flex",
    flex: 3,
    fontSize: 12,
    textAlign: "left",
    alignItems: "center",
    textAlignVertical: "center",
  },
  cellActions: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  listContainer: {
    paddingBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    gap: 4,
  },
});

export default ExpensesTable;
