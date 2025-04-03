import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, FONTS, icons, images } from "../../constants";
import { useRouter } from "expo-router";
import { useAddUserMutation } from "../../redux/slices/userApiSlice";
import { auth, firestore } from "../../firebaseconfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [email,setEmail]=useState("");
  const [areas, setAreas] = React.useState([]);
  const [selectedArea, setSelectedArea] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [addUser, { isLoading, error }] = useAddUserMutation(); 
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca3,idd")
      .then((response) => response.json())
      .then((data) => {
        let areaData = data.map((item: any) => {
          return {
            code: item.cca3,
            name: item.name?.common,
            flag: item.flags.png,
            callingCode: item.idd?.root + item.idd?.suffixes[0],
          };
        });
        setAreas(areaData);

        if (areaData.length > 0) {
          let defaultData = areaData.filter((a: any) => a.code == "US");

          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
  }, []);

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: SIZES.padding * 6,
          paddingHorizontal: SIZES.padding * 2,
        }}
        onPress={() => router.push("/")}
      >
        <Image
          source={icons.back}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: COLORS.white,
          }}
        />

        <Text
          style={{
            marginLeft: SIZES.padding * 1.5,
            color: COLORS.white,
            ...FONTS.h4,
          }}
        >
          Log In
        </Text>
      </TouchableOpacity>
    );
  }

  function renderLogo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 5,
          height: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={images.wallieLogo}
          resizeMode="contain"
          style={{
            width: "70%",
          }}
        />
      </View>
    );
  }

  function renderForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 3,
          marginHorizontal: SIZES.padding * 3,
        }}
      >
        {/* Full Name */}
        <View style={{ marginTop: SIZES.padding * 3 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
            Full Name
          </Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            placeholder="Enter Full Name"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={{ marginTop: SIZES.padding * 3 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
            Email
          </Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            placeholder="Enter Email"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Phone Number */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
            Phone Number
          </Text>

          <View style={{ flexDirection: "row" }}>
            {/* Country Code */}
            <TouchableOpacity
              style={{
                width: 100,
                height: 50,
                marginHorizontal: 5,
                borderBottomColor: COLORS.white,
                borderBottomWidth: 1,
                flexDirection: "row",
                ...FONTS.body2,
              }}
              onPress={() => setModalVisible(true)}
            >
              <View style={{ justifyContent: "center" }}>
                <Image
                  source={icons.down}
                  style={{
                    width: 10,
                    height: 10,
                    tintColor: COLORS.white,
                  }}
                />
              </View>
              <View style={{ justifyContent: "center", marginLeft: 5 }}>
                <Image
                  source={{ uri: selectedArea?.flag }}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </View>

              <View style={{ justifyContent: "center", marginLeft: 5 }}>
                <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                  {selectedArea?.callingCode}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Phone Number */}
            <TextInput
              style={{
                flex: 1,
                marginVertical: SIZES.padding,
                borderBottomColor: COLORS.white,
                borderBottomWidth: 1,
                height: 40,
                color: COLORS.white,
                ...FONTS.body3,
              }}
              placeholder="Enter Phone Number"
              placeholderTextColor={COLORS.white}
              selectionColor={COLORS.white}
              keyboardType="numeric"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* Password */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
            Password
          </Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            placeholder="Enter Password"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              bottom: 10,
              height: 30,
              width: 30,
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Image
              source={showPassword ? icons.disable_eye : icons.eye}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
            Confirm Password
          </Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            placeholder="Enter Password"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            secureTextEntry={!showPassword}
            value={cpassword}
            onChangeText={setCPassword}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              bottom: 10,
              height: 30,
              width: 30,
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Image
              source={showPassword ? icons.disable_eye : icons.eye}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderButton() {
    
    const handlesubmit = async () => {
      if (!email || !phone || !password || !cpassword || !name) {
        Alert.alert("Error", "All fields are required!");
        return;
      }
  
      if (password !== cpassword) {
        Alert.alert("Error", "Passwords do not match!");
        return;
      }
  
      if (!/^\d{6}$/.test(password)) {
        Alert.alert("Error", "Phone number must be 10 digits!");
        return;
      }
      setLoading(true); // Start loading
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      const userDocRef = doc(collection(firestore, "users"), user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        name,
        email,
        phone,
        createdAt: new Date(),
      });

      console.log("User registered successfully!");

      // Navigate to home screen
      setLoading(false); 
      router.push("/home");
      } catch (err) {
        console.error("Signup failed:", err);
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
          flexDirection: "row",
        }}
        onPress={handlesubmit}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={{ color: COLORS.white, ...FONTS.h3, fontWeight: "bold" }}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
    );
  }

  function renderAreaCodesModal() {
    const renderItem = ({item}:any) => {
      return (
        <TouchableOpacity
          style={{ padding: SIZES.padding, flexDirection: "row" }}
          onPress={() => {
            setSelectedArea(item);
            setModalVisible(false);
          }}
        >
          <Image
            source={{ uri: item.flag }}
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
            }}
          />
          <Text style={{ ...FONTS.body4 }}>{item.name}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                backgroundColor: COLORS.lightGreen,
                borderRadius: SIZES.radius,
              }}
            >
              <FlatList
                data={areas}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.code}
                showsVerticalScrollIndicator={false}
                style={{
                  padding: SIZES.padding * 2,
                  marginBottom: SIZES.padding * 2,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          {renderHeader()}
          {renderLogo()}
          {renderForm()}
          {renderButton()}
        </ScrollView>
      </LinearGradient>
      {renderAreaCodesModal()}
    </KeyboardAvoidingView>
  );
};

export default signup;
