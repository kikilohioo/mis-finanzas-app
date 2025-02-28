import AuxDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useState } from "react";
import { DBExpenseType } from "../Types";

type CommonFormData = DBExpenseType

type DateTimePickerProps = {
  disabled?: boolean;
  control: Control<CommonFormData, any>;
  dateTime: Date;
  handleDateTimePickerChange: (
    value: Date,
    strValue: string,
    onChange: (value: any) => void
  ) => void;
};

export default function DateTimePicker({
  disabled = false,
  control,
  dateTime,
  handleDateTimePickerChange,
}: DateTimePickerProps) {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState<"date" | "time">(
    "date"
  );

  const showDateTimePickerMode = (mode: "date" | "time") => {
    setDateTimePickerMode(mode);
  };

  const toggleShowDateTimePicker = () => {
    setShowDateTimePicker(!showDateTimePicker);
  };

  const handleDateTimeChange = (
    { type }: DateTimePickerEvent,
    selectedValue: Date | undefined,
    onChange: (value: any) => void
  ) => {
    if (type == "set") {
      const currentValue = selectedValue;
      handleDateTimePickerChange(currentValue ?? dateTime, formatDateTime(currentValue ?? dateTime), onChange);
      toggleShowDateTimePicker();
    } else {
      toggleShowDateTimePicker();
    }
  };

  const formatDateTime = (
    value: Date,
    format: string = "YYYY-MM-DD HH:mm:SS.iii"
  ): string => {
    const year = String(value.getFullYear());
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");
    const seconds = String(value.getSeconds()).padStart(2, "0");
    const milliseconds = String(value.getMilliseconds()).padStart(3, "0");
  
    return format.replace(/YYYY|MM|DD|HH|mm|SS|iii/g, (match: string): string => {
      switch (match) {
        case "YYYY":
          return year;
        case "MM":
          return month;
        case "DD":
          return day;
        case "HH":
          return hours;
        case "mm":
          return minutes; // Cambié "MM" por "mm" para evitar confusión con el mes
        case "SS":
          return seconds;
        case "iii":
          return milliseconds;
        default:
          return match;
      }
    });
  };

  const formatDate = (
    format: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM-DD-YYYY" | "DD/MM/YYYY"
  ): string => {
    const year = String(dateTime.getFullYear()); // Convertir a string explícitamente
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");

    return format.replace(/YYYY|MM|DD/g, (match: string): string => {
      switch (match) {
        case "YYYY":
          return year;
        case "MM":
          return month;
        case "DD":
          return day;
        default:
          return match;
      }
    });
  };

  const formatTime = (
    format: "HH:MM:SS.mmm" | "HH:MM:SS" | "HH:MM"
  ): string => {
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const seconds = String(dateTime.getSeconds()).padStart(2, "0");
    const milliseconds = String(dateTime.getMilliseconds()).padStart(3, "0");

    return format.replace(/HH|MM|SS|mmm/g, (match: string): string => {
      switch (match) {
        case "HH":
          return hours;
        case "MM":
          return minutes;
        case "SS":
          return seconds;
        case "mmm":
          return milliseconds;
        default:
          return match;
      }
    });
  };

  return (
    <Controller
      control={control}
      name="date"
      rules={{ required: "Debe seleccionar una fecha y hora" }}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.dateTimePicker}>
          <Text style={styles.datePickerLabel}>Fecha y Hora</Text>
          <TextInput
            disabled={disabled}
            style={{ ...styles.input, flex: 2 }}
            placeholder="Fecha"
            onBlur={onBlur}
            onPress={() => {
              showDateTimePickerMode("date");
              toggleShowDateTimePicker();
            }}
            value={formatDate("DD/MM/YYYY")}
            />
          <TextInput
            disabled={disabled}
            style={{ ...styles.input, marginLeft: 5, flex: 1 }}
            placeholder="Hora"
            onBlur={onBlur}
            onPress={() => {
              showDateTimePickerMode("time");
              toggleShowDateTimePicker();
            }}
            value={formatTime("HH:MM")}
          />
          {showDateTimePicker && (
            <AuxDateTimePicker
              mode={dateTimePickerMode}
              display="spinner"
              value={dateTime}
              onChange={(event, value) =>
                handleDateTimeChange(event, value, onChange)
              }
            />
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  dateTimePicker: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15
  },
  datePickerLabel: {
    paddingBottom: 10,
    marginRight: 10,
  },
});
