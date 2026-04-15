import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Compass, PlusSquare, MessageCircle, User } from 'lucide-react-native';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { PostProvider } from './src/context/PostContext';

import AuthScreen from './src/screens/AuthScreen';
import FeedScreen from './src/screens/FeedScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import PostScreen from './src/screens/PostScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MessagesStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesList" component={MessagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function MainNavigation() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      {userToken !== null ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Home') return <Home color={color} size={size} />;
              if (route.name === 'Discover') return <Compass color={color} size={size} />;
              if (route.name === 'Post') return (
                <View style={{
                  backgroundColor: '#22C55E', // Green background
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                  <PlusSquare color="#000" size={24} />
                </View>
              );
              if (route.name === 'Messages') return <MessageCircle color={color} size={size} />;
              if (route.name === 'Profile') return <User color={color} size={size} />;
            },
            tabBarActiveTintColor: '#22C55E', // primary green
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: '#111827',
              borderTopWidth: 0,
              height: 65,
              paddingBottom: 10,
            },
            headerStyle: {
              backgroundColor: '#111827',
              shadowColor: 'transparent',
              height: 100, // accommodate custom header
            },
            header: ({ navigation }) => (
              <View style={{
                backgroundColor: '#0F0F0F',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingTop: 50,
                paddingBottom: 15,
              }}>
                {/* Logo Area */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 20, height: 20, backgroundColor: '#22C55E', borderRadius: 4 }} />
                  <Text style={{ color: '#22C55E', fontSize: 20, fontWeight: '900', letterSpacing: -0.5 }}>GainGrid</Text>
                </View>
                {/* Right Actions */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 }}>
                    <Text style={{ color: '#22C55E', fontWeight: 'bold', fontSize: 12 }}>280 GP</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={{ position: 'relative' }} 
                    onPress={() => alert('You have no new notifications.')}
                  >
                    <Text style={{ color: '#9CA3AF', fontSize: 18 }}>🔔</Text>
                    <View style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1, borderColor: '#0F0F0F' }} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
                    <MessageCircle color="#9CA3AF" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            ),
          })}
        >
          <Tab.Screen name="Home" component={FeedScreen} options={{ title: 'Home' }} />
          <Tab.Screen name="Discover" component={ExploreScreen} />
          <Tab.Screen name="Post" component={PostScreen} options={{ 
            title: 'Post', 
            tabBarLabel: ({ color }) => <Text style={{ color: '#22C55E', fontSize: 10, marginTop: -10 }}>Post</Text> 
          }} />
          <Tab.Screen name="Messages" component={MessagesStackScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <AuthScreen />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <MainNavigation />
      </PostProvider>
    </AuthProvider>
  );
}
