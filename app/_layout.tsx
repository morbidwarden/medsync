import { store, persistor, RootState } from "@/store/store";
import { Stack, Redirect } from "expo-router";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View } from "react-native";

// Component to check auth state after Redux Persist rehydrates
function RootNavigator() {
  const { name } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = Boolean(name);

  return (
    <>
      {isAuthenticated ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate 
        persistor={persistor}
        loading={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#f8fafc' }}>
            <ActivityIndicator size="large" color="#7c3aed" />
          </View>
        }
      >
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}