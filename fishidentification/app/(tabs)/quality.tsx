import { COLORS, images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera, CameraView } from "expo-camera";
import axios from "axios";

export default function BillfishScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const cameraRef = useRef<any>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Handle photo capture from the camera
  const handleCapturePhoto = async () => {
    if (cameraRef.current && photos.length < 5) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotos((prev) => [...prev, photo.uri]);
    } else if (photos.length >= 5) {
      Alert.alert("Limit Reached", "You can only add up to 5 photos.");
    }
  };
  const handlesubmit = async () => {
    if (photos.length === 0) {
      Alert.alert("No Photos", "Please capture or select at least one photo.");
      return;
    }

    // Turn off camera and show loading
    setIsCameraReady(false);
    setLoading(true);

    try {
      const results: string[] = [];

      for (const photo of photos) {
        const formData = new FormData();
        formData.append("image", {
          uri: photo,
          name: "image.jpg",
          type: "image/jpeg",
        } as any);

        const response = await axios.post(
          "https://asia-south1-rare-responder-448817-m4.cloudfunctions.net/billfish",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        results.push(response.data.top1.class);
      }
      console.log(results);
      const countMap: Record<string, number> = results.reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get the fish name with the max count
      const mostFrequentName = Object.keys(countMap).reduce((a, b) =>
        countMap[a] > countMap[b] ? a : b
      );

      console.log("Most Predicted Fish:", mostFrequentName);
      // setResult(mostFrequentName);
      setResult("non-fresh");
      switch (mostFrequentName) {
        case "BLACK MARLIN":
          setDescription("BLACK MARLIN");
          setResult("non-fresh");
          break;
        case "BLUE MARLIN":
          setDescription("BLUE MARLIN");
          break;
        case "SAIL FISH":
          setDescription("SAIL FISH");
          break;
        case "STRIPED MARLIN":
          setDescription("STRIPED MARLIN");
          break;
        case "SWORD FISH":
          setDescription("SWORD FISH");
          break;
        default:
          setDescription("Unknown Fish");
          break;
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to upload images.");
    }
  };
  // Handle picking photo from gallery
  const handlePickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Gallery access is required to pick photos."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      base64: false,
    });
    if (!result.canceled && photos.length < 5) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    } else if (photos.length >= 5) {
      Alert.alert("Limit Reached", "You can only add up to 5 photos.");
    }
  };

  // Remove photo from the list
  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // If permissions are not granted
  if (hasPermission === null) {
    return <Text>Requesting camera permissions...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <LinearGradient colors={[COLORS.primary, COLORS.blue]} style={{ flex: 1 }}>
      {!loading ? (
        <View style={styles.container}>
          {/* Fullscreen Camera View */}

          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              ref={cameraRef}
              onCameraReady={() => setIsCameraReady(true)}
            />
          </View>

          {/* Photo Preview at the Bottom */}
          <View style={styles.photoSection}>
            <ScrollView horizontal style={styles.photoContainer}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  {/* Close Icon */}
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <Text style={styles.closeIconText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
          {/* Bottom Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePickFromGallery}
            >
              <Image source={images.gallery} style={styles.photo1} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button1}
              onPress={handleCapturePhoto}
            ></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlesubmit}>
              <Image source={images.next} style={styles.photo1} />
            </TouchableOpacity>
          </View>

          {/* Info about photo limit */}
          {photos.length === 5 && (
            <Text style={styles.limitText}>
              You have reached the photo limit (5).
            </Text>
          )}
        </View>
      ) : (
        // White Screen with Loading Icon when processing
        <View style={styles.loadingContainer}>
          {result == "" ? (
            <View>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          ) : (
            <View style={styles.resultContainer}>
            
              <ScrollView horizontal style={styles.photoContainer}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo }} style={styles.resultImage} />
                  <Text style={styles.resultText}>
               Predicted Quality: {result}
              </Text>
                  {/* <Text style={styles.imageText}>{description}</Text> */}
                </View>
              ))}
            </ScrollView>
            </View>
          )}
          <Image source={images.footer} style={styles.bottomBackgroundImage} />
        </View>
      )}
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end", // Pushes the buttons and photo section to the bottom
    alignItems: "center",
  },
  imageText: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  
  resultContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  imageScrollView: {
    width: "100%",
  },
  bottomBackgroundImage: {
    position: "absolute", // Ensures the image stays at a fixed position
    bottom: 0, // Positions the image at the bottom of the screen
    width: "100%", // Full screen width
    height: height * 0.3, // Adjust height (30% of the screen height)
    resizeMode: "cover", // Ensures proper scaling without distortion
    opacity: 0.15, // Makes the background less intrusive
  },
  resultImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    alignSelf: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  cameraContainer: {
    flex: 1, // Make camera take full screen
    width: "100%",
    height: height, // Set height to full screen
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Camera goes behind buttons and UI
    top: 0,
    left: 0,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  button: {
    // backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // elevation: 5,
  },
  button1: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    height: 70,
    width: 70,
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  photoSection: {
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  photoContainer: {
    flexDirection: "row",
  },
  photo: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  photo1: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 10,

    marginHorizontal: 5,
  },
  limitText: {
    marginTop: 10,
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIconText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  photoWrapper: {
    position: "relative",
    marginHorizontal: 5,
  },
});
