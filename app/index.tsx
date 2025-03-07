import { router, Stack } from "expo-router";
import { HomePage } from "../components/pages/Home";
import { IconButton, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

export default function Home() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerTitleContainer}>
              <IconButton
                icon="plus"
                size={20}
                onPress={() => router.push("/modal")}
                style={styles.iconButton}
              />
            </View>
          ),
        }}
      />
      <HomePage />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    paddingTop: 5,
  },
  iconButton: {
    marginLeft: 10,
  },
});
