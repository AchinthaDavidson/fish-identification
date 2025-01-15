import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import { COLORS, SIZES, FONTS, icons, images } from "../../constants";
import { Link, useRouter } from "expo-router";

const Login = () => {
  const [areas, setAreas] = React.useState([]);
  const [selectedArea, setSelectedArea] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const router = useRouter();

  function renderLogo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 25,
          height: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={images.wallieLogo}
          resizeMode="contain"
          style={{
            width: "75%",
          }}
        />
      </View>
    );
  }

  function renderForm() {
    const handleLogin = async () => {
      try {
        const { success } = await LocalAuthentication.authenticateAsync();
        if (success) {
          console.log("Authentication successful");
          router.push("/home");
        } else {
          console.log("Authentication failed");
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };
    return (
      <View style={{ margin: SIZES.padding * 3 }}>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.black,
            borderRadius: SIZES.radius / 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleLogin}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3,fontWeight: "bold", }}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          {renderLogo()}
          {renderForm()}
          <Link
            href="/login"
            style={{
              textAlign: "center",
              color: COLORS.lightGreen,
              // fontWeight: "bold",
              paddingTop: 50,
            }}
          >
            Login with Username and Password
          </Link>
          <Text
            style={{
              textAlign: "center",
              color: COLORS.lightGreen,
              fontWeight: "bold",
              paddingTop: 5,
            }}
          >
            New User?{" "}
            <Link
              href="/signup"
              style={{
                textAlign: "center",
                color: COLORS.darkblue,
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Link>
          </Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Login;
