import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const { login, signup } = useContext(AuthContext);

  const handleSubmit = () => {
    if (isLogin) {
      if (!email || !password) return alert('Fill all fields');
      login(email, password);
    } else {
      if (!fullName || !email || !password) return alert('Fill all fields');
      signup(fullName, email, password);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>GainGrid</Text>
        <Text style={styles.subtitle}>{isLogin ? 'Welcome back, athlete' : 'Start your journey'}</Text>
        
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={setFullName}
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isLogin ? 'LOG IN' : 'SIGN UP'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.linkText}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    backgroundColor: '#111827',
    padding: 24,
    borderRadius: 16,
  },
  title: {
    color: '#22C55E',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#22C55E',
    fontSize: 14,
  }
});
