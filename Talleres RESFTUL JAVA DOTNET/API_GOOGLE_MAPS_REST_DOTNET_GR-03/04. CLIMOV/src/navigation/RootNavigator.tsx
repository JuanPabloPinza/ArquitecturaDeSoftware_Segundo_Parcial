import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, Platform } from "react-native";
import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";
import { WebNavigator } from "./WebNavigator";
import {
  CreateAccountScreen,
  DepositScreen,
  WithdrawalScreen,
  TransferScreen,
  BranchManagementScreen,
} from "../screens/operations";
import { useAuth } from "../context";
import { colors } from "../theme";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const isWeb = Platform.OS === "web";

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Forzar boolean explícito para React Native Fabric
  const loading: boolean = Boolean(isLoading);
  const authenticated: boolean = Boolean(isAuthenticated);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // Para web, usamos un navegador diferente con cards
  if (isWeb && authenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={WebNavigator} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen name="Deposit" component={DepositScreen} />
          <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
          <Stack.Screen name="Transfer" component={TransferScreen} />
          <Stack.Screen name="BranchManagement" component={BranchManagementScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authenticated ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccountScreen}
            />
            <Stack.Screen name="Deposit" component={DepositScreen} />
            <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
            <Stack.Screen name="Transfer" component={TransferScreen} />
            <Stack.Screen name="BranchManagement" component={BranchManagementScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
