import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { createUserProfile } from '../../services/userService';
import { USER_ROLES } from '../../utils/constants';
import { theme } from '../../theme/theme';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { useAuth } from '../../hooks/useAuth';

const RoleSelectScreen = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectRole = async (role) => {
    if (!name) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    if (!user || !user.uid || !user.email) {
      Alert.alert('Error', 'Could not find user information. Please try registering again.');
      return;
    }
    setLoading(true);
    try {
      await createUserProfile(user.uid, { 
        email: user.email, 
        name, 
        role,
        createdAt: new Date().toISOString(),
      });
      // Navigation is handled by RootNavigator
    } catch (error) {
      Alert.alert('Error', 'Failed to set up profile. Please try again.');
      console.error("Failed to update user role:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>One Last Step</Text>
      <Text style={styles.subtitle}>What should we call you, and what is your role?</Text>
      
      <Input
        label="Your Name"
        placeholder="John Doe"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.buttonContainer}>
        <Text style={styles.roleTitle}>I am a...</Text>
        <Button 
          title="Customer" 
          onPress={() => handleSelectRole(USER_ROLES.CUSTOMER)} 
          loading={loading}
          style={styles.button}
        />
        <Button 
          title="Photographer" 
          onPress={() => handleSelectRole(USER_ROLES.PHOTOGRAPHER)} 
          loading={loading}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
  roleTitle: {
    ...theme.typography.h2,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  button: {
    marginVertical: theme.spacing.sm,
  }
});

export default RoleSelectScreen;