import { Link, Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, View } from "react-native";
import seeders from "../database/seeders";
import migrations from "../database/migrations";
import { Seeder } from "../components/Types";
const DB_NAME = process.env.EXPO_PUBLIC_DB_NAME;

const createDbIfNeeded = async (db: SQLiteDatabase) => {
  //
  console.log("Creating database");
  try {
    let dataToInsert = seeders() as Seeder<any>[];
    // Create a table and edit for create a migration way to create multiple tables
    migrations().forEach(async (migration) => {
      const { table, attributes, foreignKeys } = migration;

      if (process.env.EXPO_PUBLIC_ENV === "dev") {
        await db.execAsync(`DROP TABLE IF EXISTS ${table}`);
      }

      // Construir la sentencia SQL para crear la tabla
      let sql = `CREATE TABLE IF NOT EXISTS ${table} (\n`;

      // Agregar las columnas
      const columns = Object.entries(attributes)
        .map(([name, type]) => `${name} ${type}`)
        .join(",\n");

      sql += columns;

      // Agregar las claves foráneas (si las hay)
      if (foreignKeys && foreignKeys.length > 0) {
        const foreignKeysSql = foreignKeys.join(",\n");
        sql += `,\n${foreignKeysSql}`;
      }

      sql += "\n);";

      // Ejecutar la sentencia SQL en la base de datos
      await db.execAsync(sql);

      console.log("app mode: ", process.env.EXPO_PUBLIC_ENV);
      // inserts de los seeders de esta tabla
      if (process.env.EXPO_PUBLIC_ENV === "dev") {
        // Buscar si hay seeders para esta tabla
        const seeder = dataToInsert.find((item) => item.table === table);
        if (!seeder) return;

        const { data } = seeder;
        if (data.length === 0) return;

        const keys = Object.keys(data[0]).join(", ");
        const values = data
          .map(
            (row: Record<string, unknown>) =>
              `(${Object.values(row)
                .map((value) =>
                  value === undefined
                    ? "NULL"
                    : typeof value === "string"
                      ? `'${value.replace(/'/g, "''")}'`
                      : value
                )
                .join(", ")})`
          )
          .join(", ");

        const insertSql = `INSERT INTO ${table} (${keys}) VALUES ${values};`;

        await db.execAsync(insertSql);
      }
    });
    console.log("Database created and data inserted");
  } catch (error) {
    console.error("Error creating database:", error);
  }
};

export default function RootLayout() {
  return (
    <>
      <SQLiteProvider databaseName={DB_NAME} onInit={createDbIfNeeded}>
        <Stack
          screenOptions={{
            headerTitle: "Mis finanzas", // aca podria ir el titulo
            // headerLeft: () => <Logo />,
            // headerRight: () => {
            //   return (
            //     <Pressable
            //       style={({ pressed }) => [
            //         {
            //           backgroundColor: pressed ? "rgb(235, 235, 235)" : "white",
            //         },
            //         styles.wrapperCustom,
            //       ]}
            //     >
            //       <DownloadIcon size={25} color="black" />
            //     </Pressable>
            //   );
            // },
          }}
        >
          <Stack.Screen name="index" options={{}} />
        </Stack>
      </SQLiteProvider>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
});
