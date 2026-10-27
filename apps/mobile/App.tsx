import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CONVERSION_LABELS, theme, type ConversionType } from "@conversor/shared";
import { NeuView } from "./components/NeuView";

const { colors, radius, touch } = theme;

const TOOL_META: Record<ConversionType, { icon: keyof typeof Feather.glyphMap; tag: string }> = {
  "merge-pdf": { icon: "layers", tag: "PDF + PDF → PDF" },
  "compress-pdf": { icon: "minimize-2", tag: "PDF → PDF" },
  "pdf-to-images": { icon: "image", tag: "PDF → PNG" },
  "images-to-pdf": { icon: "file", tag: "PNG/JPG → PDF" },
};

export default function App() {
  const tools = Object.entries(CONVERSION_LABELS) as [ConversionType, string][];

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Conversor de Archivos
      </Text>
      <Text style={styles.subtitle}>Elige una herramienta para empezar.</Text>

      <FlatList
        data={tools}
        numColumns={2}
        keyExtractor={([key]) => key}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item: [key, label] }) => {
          const meta = TOOL_META[key];
          return (
            <Pressable
              style={styles.cell}
              accessibilityRole="button"
              accessibilityLabel={`${label}, ${meta.tag}`}
              // TODO: reemplazar por navegación real a cada herramienta con expo-document-picker
              onPress={() => {}}
            >
              <NeuView variant="raised" radius={radius.md} style={styles.card}>
                <NeuView variant="inset" radius={touch / 2} style={styles.iconWell}>
                  <Feather name={meta.icon} size={22} color={colors.accent} />
                </NeuView>
                <View>
                  <Text style={styles.tag}>{meta.tag}</Text>
                  <Text style={styles.name}>{label}</Text>
                </View>
              </NeuView>
            </Pressable>
          );
        }}
      />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.ink,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 24,
    fontSize: 15,
    color: colors.inkSoft,
  },
  list: {
    paddingBottom: 32,
  },
  row: {
    gap: 20,
  },
  cell: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    minHeight: 140,
    padding: 16,
    justifyContent: "space-between",
  },
  iconWell: {
    width: touch,
    height: touch,
    alignItems: "center",
    justifyContent: "center",
  },
  tag: {
    fontSize: 12,
    color: colors.inkSoft,
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
  },
});
