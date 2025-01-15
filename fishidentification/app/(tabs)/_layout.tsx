import { COLORS } from '@/constants';
import { Stack } from 'expo-router';


export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor:COLORS.primary ,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      >
      <Stack.Screen name="index"  options={{ headerShown: false }}/>
      <Stack.Screen name="signup"  options={{ headerShown: false }}/>
      <Stack.Screen name="login"  options={{ headerShown: false }}/>
      <Stack.Screen name="billfish" options={{ title: "Billfish Identification" }}/>
      <Stack.Screen name="shark" options={{ title: "Shark Species Identification" }}  />
      <Stack.Screen name="demersal" options={{ title: "Demersal Fish Identification" }}  />
      <Stack.Screen name="quality" options={{ title: "Fish Quality Assessment" }}  />
      <Stack.Screen name="size" options={{ title: "Billfish Size Estimation" }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
