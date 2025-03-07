import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { DBExpenseType } from "../Types";
import DateTimePicker from "../common/DateTimePicker";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { DownloadIcon } from "../Icons";
import { format, setHours, setMilliseconds, setMinutes, setSeconds, subDays } from "date-fns";

// Definición de los tipos para los datos del formulario
type FormData = DBExpenseType;

type AuxCategory = {
  key: number;
  value: string;
};

function ExpenseModal() {
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      date: dateTime.toISOString(),
    },
  });

  const database = useSQLiteContext();
  const { expense_id } = useLocalSearchParams();
  const expenseId = expense_id ? Number(expense_id) : false;

  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");
  const [expenses, setExpenses] = useState<DBExpenseType[]>([]);
  // datos de otras tablas
  const categories = [
    { key: "Higiene", value: "Higiene" },
    { key: "Comida", value: "Comida" },
    { key: "Impuestos", value: "Impuestos" },
    { key: "Transporte", value: "Transporte" },
    { key: "Entretenimiento", value: "Entretenimiento" },
    { key: "Salud", value: "Salud" },
    { key: "Educación", value: "Educación" },
    { key: "Ropa", value: "Ropa" },
    { key: "Hogar", value: "Hogar" },
    { key: "Otros", value: "Otros" },
  ];

  const paymentTypes = [
    { key: "credit", value: "Crédito" },
    { key: "debit", value: "Débito" },
    { key: "cash", value: "Efectivo" },
  ];

  const handleDateTimePickerChange = (
    value: Date,
    strValue: string,
    onChange: (value: any) => void
  ) => {
    setDateTime(value);
    onChange(strValue);
  };

  const formatDate = (isoDate: string) => {
    return format(new Date(isoDate), "yyyy-MM-dd HH:mm:ss.SSS");
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (expenseId) {
        await database.runAsync(
          `UPDATE expenses
           SET amount = ?, store = ?, paymentType = ?, date = ?,
               category = ?
           WHERE id = ?;`,
          [
            data.amount ?? 0,
            data.store ?? "",
            data.paymentType ?? "unknown",
            formatDate(data.date) ?? formatDate(new Date().toISOString()), // Formato ISO 8601
            data.category ?? "Otros",
            expenseId, // ID del cigarro que se actualiza
          ]
        );
      } else {
        // Insertar un nuevo registro
        let statement = await database.prepareAsync(
          `INSERT INTO expenses (id, amount, store, paymentType, date, category)
         VALUES ($id, $amount, $store, $paymentType, $date, $category);`
        );

        await statement.executeAsync({
          $amount: data.amount ?? 0,
          $store: data.store ?? "",
          $paymentType: data.paymentType ?? "unknown",
          $date: formatDate(new Date(data.date).toISOString()) ?? formatDate(new Date().toISOString()), // Formato ISO 8601
          $category: data.category ?? "Otros",
        });
        setSubmittedData(data);
      }

      reset();
      router.back();
    } catch (error) {
      console.error("Error al insertar o actualizar el registro:", error);
    }
  };

  const handleCategoryChange = (
    value: string,
    onChange: (value: any) => void
  ) => {
    const auxCategoryId = categories.find((cat) => cat.value == value)?.key;
    const foundCategory = categories.find((cat) => cat.key === auxCategoryId);
    if (foundCategory) {
      onChange(auxCategoryId);
    } else {
      console.warn("Category not found for key:", value);
    }
  };

  const handlePaymentTypeChange = (
    value: string,
    onChange: (value: any) => void
  ) => {
    const auxPTId = paymentTypes.find((pt) => pt.value == value)?.key;
    const foundPT = paymentTypes.find((pt) => pt.key === auxPTId);
    if (foundPT) {
      onChange(auxPTId);
    } else {
      console.warn("Payment Type not found for key:", value);
    }
  };

  const handleOnPressDownload = async () => {
    try {
      // Obtener los gastos de la base de datos
      const expenses = await database.getAllAsync<DBExpenseType>(
        "SELECT * FROM expenses"
      );

      // Convertir los datos a JSON
      const jsonContent = JSON.stringify(expenses, null, 2);

      // Ruta donde se guardará el archivo
      const fileUri = `${FileSystem.documentDirectory}expenses.json`;

      // Guardar el archivo en el sistema
      await FileSystem.writeAsStringAsync(fileUri, jsonContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert("Éxito", "Archivo guardado correctamente.");

      // Compartir el archivo si el sistema lo permite
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
        await database.getAllAsync<DBExpenseType>("DELETE FROM expenses");
      } else {
        Alert.alert(
          "Descarga",
          "El archivo ha sido guardado en el almacenamiento interno."
        );
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
      Alert.alert("Error", "No se pudo guardar el archivo.");
    }
  };

  useEffect(() => {
    if (expense_id) {
      const loadPerson = async () => {
        try {
          const result = await database.getFirstAsync<DBExpenseType>(
            "SELECT * FROM expenses WHERE id = ?",
            [expenseId]
          );
          if (result) {
            reset({
              id: result.id,
              store: result.store,
              amount: result.amount,
              category: result.category,
              paymentType: result.paymentType,
            });

            setSelectedCategory(result.category);
            setSelectedPaymentType(result.paymentType);
            setDateTime(new Date(result.date));
          }
        } catch (error) {
          console.error("Error cargando el motivo:", error);
        }
      };

      loadPerson();
    }
  }, [expense_id]);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>NUEVO GASTO</Text>
        <Controller
          control={control}
          name="amount"
          rules={{ required: "Debe ingresar un monto mayor a 0" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ingrese el monto"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.amount && (
          <Text style={styles.errorText}>{errors.amount.message}</Text>
        )}
        <Controller
          control={control}
          name="store"
          rules={{ required: "Debe ingresar una tienda" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ingrese una tienda"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.store && (
          <Text style={styles.errorText}>{errors.store.message}</Text>
        )}
        <Controller
          control={control}
          name="paymentType"
          rules={{ required: "Debe seleccionar un tipo de pago" }}
          render={({ field: { onChange } }) => (
            <>
              <Text style={{ marginBottom: 5 }}>Tipo de pago</Text>
              <SelectList
                defaultOption={paymentTypes.find(
                  (paymentType) =>
                    paymentType.key.toString() == selectedPaymentType
                )}
                placeholder="Seleccione un tipo de pago"
                onSelect={() => {
                  handlePaymentTypeChange(selectedPaymentType, onChange);
                }}
                setSelected={(val: string) => {
                  setSelectedPaymentType(val);
                }}
                data={paymentTypes}
                save="value"
              />
            </>
          )}
        />
        {errors.paymentType && (
          <Text style={styles.errorText}>{errors.paymentType.message}</Text>
        )}
        <DateTimePicker
          control={control}
          handleDateTimePickerChange={handleDateTimePickerChange}
          dateTime={dateTime}
        />
        {errors.date && (
          <Text style={styles.errorText}>{errors.date.message}</Text>
        )}
        <Controller
          control={control}
          name="category"
          rules={{ required: "Debe seleccionar una categoria" }}
          render={({ field: { onChange } }) => (
            <>
              <Text style={{ marginBottom: 5 }}>Categoria</Text>
              <SelectList
                defaultOption={categories.find(
                  (category) => category.key.toString() == selectedCategory
                )}
                placeholder="Seleccione una categoria"
                onSelect={() => {
                  handleCategoryChange(selectedCategory, onChange);
                }}
                setSelected={(val: string) => {
                  setSelectedCategory(val);
                }}
                data={categories}
                save="value"
              />
            </>
          )}
        />
        {errors.category && (
          <Text style={styles.errorText}>{errors.category.message}</Text>
        )}

        {/* Botón para enviar el formulario */}
        <Button
          onPress={handleSubmit(onSubmit)}
          textColor="white"
          style={styles.button}
        >
          {expenseId ? "Actualizar" : "Registrar"} gasto
        </Button>
        <Button
          onPress={handleOnPressDownload}
          textColor="white"
          style={{ ...styles.button, backgroundColor: "skyblue" }}
        >
          Descargar gastos <DownloadIcon size={15} color="white" />
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    marginVertical: 15,
    fontWeight: "bold",
  },
  input: {
    height: 20,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  submittedContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  submittedTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "cornflowerblue",
    marginVertical: 10,
  },
  slider: {
    marginBottom: 20,
  },
});

export default ExpenseModal;
