import { COLORS, images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";

export default function SizeScreen() {
  const router = useRouter();
  const [PDL, setPdlSize] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    // Convert input to number
    const numericValue = parseFloat(PDL);

    // **Validation**
    if (!PDL) {
      Alert.alert("Input Required", "Please enter a PDL size.");
      return;
    }
    if (isNaN(numericValue) || numericValue < 50 || numericValue > 350) {
      Alert.alert("Invalid Input", "PDL size must be between 50 and 350.");
      return;
    }

    try {
      const response = await axios.post(
        "https://fish-size-38595106058.asia-south1.run.app",
        { PDL: PDL }
      );
      console.log(response.data);
      setResult(response.data.toFixed(0)); // Assuming API returns { result: value }
    } catch (error) {
      console.error("API Error:", error);
      setResult("Error fetching result");
    }
  };
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.blue]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={images.PDL} style={styles.PDL} />
        <Text style={styles.title}>Enter Sail Fish PDL Size</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter PDL Size"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          value={PDL}
          onChangeText={setPdlSize}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.card}>
            <Text style={styles.resultText}>Sail Fish : {result} cm</Text>
          </View>
        )}
      </ScrollView>
      <View>
        <Image source={images.footer} style={styles.bottomBackgroundImage} />
      </View>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  PDL: {
    // position: "absolute", // Ensures the image stays at a fixed position
    // bottom: 0, // Positions the image at the bottom of the screen
    width: "100%", // Full screen width
    height: height * 0.3, // Adjust height (30% of the screen height)
    resizeMode: "cover", // Ensures proper scaling without distortion
    // opacity: 0.15, // Makes the background less intrusive
  },
  bottomBackgroundImage: {
    position: "absolute", // Ensures the image stays at a fixed position
    bottom: 0, // Positions the image at the bottom of the screen
    width: "100%", // Full screen width
    height: height * 0.3, // Adjust height (30% of the screen height)
    resizeMode: "cover", // Ensures proper scaling without distortion
    opacity: 0.15, // Makes the background less intrusive
  },
});
