import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function ResultScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri as string }}
        contentFit="contain"
        style={styles.image}
      />
      <Text style={styles.label}>🧠 Analiza AI: (tu będą dane z backendu)</Text>
      <Text style={styles.label}>♻️ Kosz: (np. plastik)</Text>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="white" />
        <Text style={styles.backText}>Wróć</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "90%",
    aspectRatio: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
  backButton: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});
