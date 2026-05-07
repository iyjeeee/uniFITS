// src/navigation/AppNavigator.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root navigation tree.
//
// KEY BEHAVIOUR — "pop to root on tab press":
//   Each tab's stack is registered via a ref. When a tab is pressed while
//   it is already focused AND its stack has more than one screen (i.e. you
//   are inside a detail screen), the stack is popped back to its root so
//   you always land on the list / main screen — never on a stale detail.
//
//   This is implemented with:
//     • navigationRef  — NavigationContainer ref
//     • tabPressHandler inside Tab.Navigator's screenListeners
//     • popToTop() called on the stack ref of the active tab
//
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useCallback } from 'react'
import { View, Text, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { useAuth } from '../context/AuthContext'
import { Colors, Typography, Shadow } from '../constants/theme'
import {
  HomeIcon, ProjectsIcon, EventsIcon, AnnouncementsIcon, ProfileIcon,
} from '../components/ui'

// ── Screens ───────────────────────────────────────────────────────────────────
import LoginScreen              from '../screens/LoginScreen'
import HomeScreen               from '../screens/HomeScreen'
import ProjectsScreen           from '../screens/ProjectsScreen'
import ProjectDetailScreen      from '../screens/ProjectDetailScreen'
import EventsScreen             from '../screens/EventsScreen'
import EventDetailScreen        from '../screens/EventDetailScreen'
import AnnouncementsScreen      from '../screens/AnnouncementsScreen'
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen'
import ProfileScreen            from '../screens/ProfileScreen'
import EditProfileScreen        from '../screens/EditProfileScreen'
import MyTransactionsScreen     from '../screens/MyTransactionsScreen'
import MyReportScreen           from '../screens/MyReportScreen'
import MyAttendanceScreen       from '../screens/MyAttendanceScreen'

const Stack = createNativeStackNavigator()
const Tab   = createBottomTabNavigator()

// Shared stack screen options — custom headers only, no default RN header
const SCREEN_OPTIONS = {
  headerShown: false,
  animation: 'slide_from_right',
  animationDuration: 240,
}

// ── Tab icon ──────────────────────────────────────────────────────────────────
function TabIcon({ Icon, focused, label }) {
  const color = focused ? Colors.tabActive : Colors.tabInactive
  return (
    <View style={{ alignItems: 'center', gap: 3 }}>
      <Icon color={color} size={22} />
      <Text style={{
        fontSize: 10,
        fontFamily: focused ? Typography.bodyBold : Typography.bodyMedium,
        color,
        letterSpacing: 0.1,
      }}>
        {label}
      </Text>
    </View>
  )
}

// ── Per-tab stack navigators with forwarded refs ───────────────────────────────
//  Each stack receives a `navRef` prop so the tab-press handler can call
//  navRef.current?.popToTop() to reset it to its root screen.

function HomeStack({ navRef }) {
  return (
    <Stack.Navigator ref={navRef} screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  )
}

function ProjectsStack({ navRef }) {
  return (
    <Stack.Navigator ref={navRef} screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="ProjectsList"  component={ProjectsScreen}     />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    </Stack.Navigator>
  )
}

function EventsStack({ navRef }) {
  return (
    <Stack.Navigator ref={navRef} screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="EventsList"  component={EventsScreen}     />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  )
}

function AnnouncementsStack({ navRef }) {
  return (
    <Stack.Navigator ref={navRef} screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="AnnouncementsList"  component={AnnouncementsScreen}      />
      <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
    </Stack.Navigator>
  )
}

function ProfileStack({ navRef }) {
  return (
    <Stack.Navigator ref={navRef} screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="ProfileMain"    component={ProfileScreen}        />
      <Stack.Screen name="EditProfile"    component={EditProfileScreen}    />
      <Stack.Screen name="MyTransactions" component={MyTransactionsScreen} />
      <Stack.Screen name="MyReport"       component={MyReportScreen}       />
      <Stack.Screen name="MyAttendance"   component={MyAttendanceScreen}   />
    </Stack.Navigator>
  )
}

// ── Bottom Tab Navigator ───────────────────────────────────────────────────────
function MainTabs() {
  // One ref per tab stack — used to pop to root when that tab is pressed
  const homeRef          = useRef(null)
  const projectsRef      = useRef(null)
  const eventsRef        = useRef(null)
  const announcementsRef = useRef(null)
  const profileRef       = useRef(null)

  // Map tab name → its stack ref
  const stackRefs = {
    HomeTab:          homeRef,
    ProjectsTab:      projectsRef,
    EventsTab:        eventsRef,
    UpdatesTab:       announcementsRef,
    ProfileTab:       profileRef,
  }

  // tabPressHandler — pop the active tab's stack to its root on every tab press.
  // This means: if you are on EventDetail and tap the Events tab icon, you land
  // on EventsList instead of staying on EventDetail.
  const tabPressHandler = useCallback(({ navigation, route }) => ({
    tabPress: (e) => {
      const ref = stackRefs[route.name]
      if (ref?.current) {
        try {
          // canGoBack() returns true when stack has >1 screen pushed
          if (ref.current.canGoBack()) {
            e.preventDefault()           // prevent default tab switch animation
            ref.current.popToTop()       // pop all detail screens off the stack
            navigation.navigate(route.name) // re-focus the tab
          }
        } catch (_) {
          // Ignore if navigator not yet mounted
        }
      }
    },
  }), [])

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
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
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={HomeIcon} focused={focused} label="Home" /> }}
        listeners={({ navigation, route }) => tabPressHandler({ navigation, route })}
      >
        {() => <HomeStack navRef={homeRef} />}
      </Tab.Screen>

      <Tab.Screen
        name="ProjectsTab"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={ProjectsIcon} focused={focused} label="Projects" /> }}
        listeners={({ navigation, route }) => tabPressHandler({ navigation, route })}
      >
        {() => <ProjectsStack navRef={projectsRef} />}
      </Tab.Screen>

      <Tab.Screen
        name="EventsTab"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={EventsIcon} focused={focused} label="Events" /> }}
        listeners={({ navigation, route }) => tabPressHandler({ navigation, route })}
      >
        {() => <EventsStack navRef={eventsRef} />}
      </Tab.Screen>

      <Tab.Screen
        name="UpdatesTab"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={AnnouncementsIcon} focused={focused} label="Updates" /> }}
        listeners={({ navigation, route }) => tabPressHandler({ navigation, route })}
      >
        {() => <AnnouncementsStack navRef={announcementsRef} />}
      </Tab.Screen>

      <Tab.Screen
        name="ProfileTab"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={ProfileIcon} focused={focused} label="Profile" /> }}
        listeners={({ navigation, route }) => tabPressHandler({ navigation, route })}
      >
        {() => <ProfileStack navRef={profileRef} />}
      </Tab.Screen>
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
