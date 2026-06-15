import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F5F0E8",
          borderTopColor: "#E0D8CC",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: "#C4873A",
        tabBarInactiveTintColor: "#8C7B6B",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Games",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>♠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>♣</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>♥</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="random"
        options={{
          title: "Suggest",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>✦</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>⚙</Text>
          ),
        }}
      />
      <Tabs.Screen name="game" options={{ href: null }} />
      <Tabs.Screen name="category-detail" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
