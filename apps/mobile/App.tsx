import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { CONVERSION_LABELS } from "@conversor/shared";

export default function App() {
  const tools = Object.entries(CONVERSION_LABELS);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversor de Archivos</Text>
      <FlatList
        data={tools}
        keyExtractor={([key]) => key}
        renderItem={({ item: [, label] }) => (
          <Text style={styles.item}>{label}</Text>
        )}
      />
      {/* TODO: reemplazar por navegación real a cada herramienta con expo-document-picker */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
