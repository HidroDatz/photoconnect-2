import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import { useUserRole } from '../hooks/useUserRole';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import PhotographerNavigator from './PhotographerNavigator';
import SplashScreen from '../screens/shared/SplashScreen';
import { USER_ROLES } from '../utils/constants';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : !role ? (
        <Stack.Navigator>
          <Stack.Screen
            name="RoleSelect"
            component={RoleSelectScreen}
            initialParams={{ userId: user.uid }}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : role === USER_ROLES.CUSTOMER ? (
        <CustomerNavigator />
      ) : role === USER_ROLES.PHOTOGRAPHER ? (
        <PhotographerNavigator />
      ) : (
        <AuthNavigator /> // Fallback
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
