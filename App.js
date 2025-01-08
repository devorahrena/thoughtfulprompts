import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [letter, setLetter] = useState("");
  const [response, setResponse] = useState("");
  const [user, setUser] = useState(null);

  // Helper function to generate a random letter
  const getRandomLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  };

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "882497006082-l7qv0u4ohhm31bn84uddoq83q0vh6ah1.apps.googleusercontent.com",
    });

    // Load the last letter when the app starts
    const loadLetter = async () => {
      const savedLetter = await AsyncStorage.getItem("weeklyLetter");
      if (savedLetter) setLetter(savedLetter);
    };

    loadLetter();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Sign-In Cancelled", "You cancelled the Google Sign-In.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign-In In Progress", "Google Sign-In is already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Google Play Services are not available.");
      } else {
        console.error(error);
        Alert.alert("Error", "An error occurred during Google Sign-In.");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Submit the response
  const handleSubmit = async () => {
    if (!response) {
      Alert.alert("Error", "Please provide a response.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letter, response, userEmail: user?.user?.email }),
      });

      if (res.ok) {
        Alert.alert("Success", "Your response has been sent!");
        setResponse("");
      } else {
        Alert.alert("Error", "Failed to send response.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while sending your response.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Letter Prompt</Text>
      {user ? (
        <>
          <Text style={styles.welcome}>Welcome, {user.user.name}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      ) : (
        <Button title="Sign In with Google" onPress={handleGoogleSignIn} />
      )}
      {letter ? (
        <Text style={styles.letter}>This week's letter: {letter}</Text>
      ) : (
        <Text style={styles.loading}>Loading letter...</Text>
      )}
      {user && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Type your response..."
            value={response}
            onChangeText={setResponse}
            multiline
          />
          <Button title="Submit Response" onPress={handleSubmit} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
  },
  letter: {
    fontSize: 18,
    marginBottom: 20,
  },
  loading: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
});

export default App;
