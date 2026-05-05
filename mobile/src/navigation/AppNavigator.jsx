// src/navigation/AppNavigator.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root navigation tree:
//   AuthStack    — Login screen (no tabs)
//   MainTabs     — Bottom tab bar with nested stacks per tab
//     HomeStack       → Home
//     ProjectsStack   → Projects list → Project Detail
//     EventsStack     → Events list → Event Detail
//     AnnouncementsStack → Announcements list → Detail
//     ProfileStack    → Profile → Edit Profile → My Transactions
//                                → My Report → My Attendance
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react'
import { View, Text, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { useAuth } from '../context/AuthContext'
import { Colors, Typography, Radius, Shadow } from '../constants/theme'
import {
  HomeIcon, ProjectsIcon, EventsIcon, AnnouncementsIcon, ProfileIcon,
} from '../components/ui'

// ── Screens ───────────────────────────────────────────────────────────────────
import LoginScreen             from '../screens/LoginScreen'
import HomeScreen              from '../screens/HomeScreen'
import ProjectsScreen          from '../screens/ProjectsScreen'
import ProjectDetailScreen     from '../screens/ProjectDetailScreen'
import EventsScreen            from '../screens/EventsScreen'
import EventDetailScreen       from '../screens/EventDetailScreen'
import AnnouncementsScreen     from '../screens/AnnouncementsScreen'
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen'
import ProfileScreen           from '../screens/ProfileScreen'
import EditProfileScreen       from '../screens/EditProfileScreen'
import MyTransactionsScreen    from '../screens/MyTransactionsScreen'
import MyReportScreen          from '../screens/MyReportScreen'
import MyAttendanceScreen      from '../screens/MyAttendanceScreen'

const Stack = createNativeStackNavigator()
const Tab   = createBottomTabNavigator()

// ── Shared stack screen options (no default header — we use custom PageHeader) ─
const SCREEN_OPTIONS = {
  headerShown: false,
  animation: 'slide_from_right',
  animationDuration: 240,
}

// ── Tab icon component ─────────────────────────────────────────────────────────
function TabIcon({ Icon, focused, label }) {
  const color = focused ? Colors.tabActive : Colors.tabInactive
  return (
    <View style={{ alignItems: 'center', gap: 3 }}>
      <Icon color={color} size={22} />
      <Text style={{ fontSize: 10, fontFamily: focused ? Typography.bodyBold : Typography.bodyMedium, color, letterSpacing: 0.1 }}>
        {label}
      </Text>
    </View>
  )
}

// ── Individual stack navigators ────────────────────────────────────────────────
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  )
}

function ProjectsStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="ProjectsList"   component={ProjectsScreen}      />
      <Stack.Screen name="ProjectDetail"  component={ProjectDetailScreen}  />
    </Stack.Navigator>
  )
}

function EventsStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="EventsList"   component={EventsScreen}      />
      <Stack.Screen name="EventDetail"  component={EventDetailScreen}  />
    </Stack.Navigator>
  )
}

function AnnouncementsStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="AnnouncementsList"   component={AnnouncementsScreen}       />
      <Stack.Screen name="AnnouncementDetail"  component={AnnouncementDetailScreen}  />
    </Stack.Navigator>
  )
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="ProfileMain"     component={ProfileScreen}        />
      <Stack.Screen name="EditProfile"     component={EditProfileScreen}    />
      <Stack.Screen name="MyTransactions"  component={MyTransactionsScreen} />
      <Stack.Screen name="MyReport"        component={MyReportScreen}       />
      <Stack.Screen name="MyAttendance"    component={MyAttendanceScreen}   />
    </Stack.Navigator>
  )
}

// ── Bottom Tab Navigator ───────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,     // we render label inside TabIcon
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: Colors.borderCard,
          height: Platform.OS === 'ios' ? 82 : 64,
          paddingBottom: Platform.OS === 'ios' ? 22 : 8,
          paddingTop: 8,
          ...Shadow.md,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={HomeIcon} focused={focused} label="Home" /> }}
      />
      <Tab.Screen
        name="ProjectsTab"
        component={ProjectsStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={ProjectsIcon} focused={focused} label="Projects" /> }}
      />
      <Tab.Screen
        name="EventsTab"
        component={EventsStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={EventsIcon} focused={focused} label="Events" /> }}
      />
      <Tab.Screen
        name="UpdatesTab"
        component={AnnouncementsStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={AnnouncementsIcon} focused={focused} label="Updates" /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={ProfileIcon} focused={focused} label="Profile" /> }}
      />
    </Tab.Navigator>
  )
}

// ── Root Navigator ─────────────────────────────────────────────────────────────
export default function AppNavigator() {
  const { user } = useAuth()
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
