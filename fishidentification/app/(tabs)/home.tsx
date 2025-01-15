import { COLORS, images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Get device dimensions for responsiveness
const { width, height } = Dimensions.get("window");

function renderLogo() {
  return (
    <View
      style={{
        paddingTop: 20,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={images.wallieLogo}
        resizeMode="contain"
        style={{
          width: "50%",
        }}
      />
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[COLORS.primary, COLORS.blue]} style={{ flex: 1 }}>
      {renderLogo()}

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.row}>
          <View
            style={[styles.card, { height: 450, flex: 1, marginRight: 10 }]}
          >
            <View
              style={styles.cardContent}
              onTouchEnd={() => {
                router.push("/billfish");
              }}
            >
              <Image source={images.fish1} style={styles.cardImageSmall} />
              <Text style={styles.cardTitle}>Billfish Identification</Text>
            </View>

            <View
              style={styles.cardContent}
              onTouchEnd={() => {
                router.push("/demersal");
              }}
            >
              <Image source={images.fish2} style={styles.cardImageSmall} />
              <Text style={styles.cardTitle}>Demersal Fish Identification</Text>
            </View>
          </View>

          <View
            style={[styles.card, { height: 450, flex: 1, marginRight: 10 }]}
          >
            <View
              style={styles.cardContent}
              onTouchEnd={() => {
                router.push("/shark");
              }}
            >
              <Image source={images.fish3} style={styles.cardImageSmall} />
              <Text style={styles.cardTitle}>Shark Species Identification</Text>
            </View>

            <View
              style={styles.cardContent}
              onTouchEnd={() => {
                router.push("/quality");
              }}
            >
              <Image source={images.fish4} style={styles.cardImageSmall} />
              <Text style={styles.cardTitle}>Fish Quality Assessment</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View
            style={[styles.card, { height: 200, flex: 1, marginEnd: 10 }]}
            onTouchEnd={() => {
              router.push("/size");
            }}
          >
            <View
              style={[
                styles.cardContent,
                { flexDirection: "row", alignItems: "center" },
              ]}
            >
              <Image source={images.fish5} style={styles.cardImageSmall1} />
              <Text style={styles.cardTitle1}>Billfish Size Estimation</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => router.push("/size")}>
        <Image source={images.footer} style={styles.bottomBackgroundImage} />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10, // Adds padding for the ScrollView content
  },
  row: {
    flexDirection: "row", // Aligns cards side by side
    marginBottom: 20,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBackgroundImage: {
    position: "absolute", // Ensures the image stays at a fixed position
    bottom: 0, // Positions the image at the bottom of the screen
    width: "100%", // Full screen width
    height: height * 0.3, // Adjust height (30% of the screen height)
    resizeMode: "cover", // Ensures proper scaling without distortion
    opacity: 0.15, // Makes the background less intrusive
  },
  card: {
    width: "100%",
    borderRadius: 25,
    backgroundColor: "#090a57",
    shadowColor: "#ffffff",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
  },
  cardImage: {
    width: "100%",
    height: 200, // Fixed height for the image
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "white",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  cardImageSmall: {
    width: "100%",
    height: 130, // Adjust height as needed
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 10, // Adds spacing between images and text
  },
  cardImageSmall1: {
    width: 200, // Set the image width
    height: 200, // Set the image height
    borderRadius: 8, // Optional: Rounds the corners of the image
    marginRight: 10, // Adds space between the image and text
  },
  cardTitle1: {
    fontSize: 22, // Adjust font size as needed
    fontWeight: "bold", // Makes the text bold
    color: "white", // Adjust text color
    flexShrink: 1, // Prevents text from overflowing and allows wrapping
  },
});
