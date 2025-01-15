import { COLORS, images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState, useEffect } from "react";
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

export default function BillfishScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const cameraRef = useRef<any>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

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
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/")}
          >
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
    elevation: 5,
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
    marginTop:8
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
