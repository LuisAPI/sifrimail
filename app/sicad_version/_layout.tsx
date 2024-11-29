import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const HomeLayout = () => {
  return (
    <Tabs
        screenOptions={{
            headerShown: false
        }}
    >
        <Tabs.Screen
            name="index"
            options={{
                title: "Inbox"
            }}
        />
        <Tabs.Screen
            name="folders"
            options={{
                title: "Folders"
            }}
        />
        <Tabs.Screen
            name="compose"
            options={{
                title: "Compose"
            }}
        />

        {/* Hidden pages */}
        <Tabs.Screen
            name="[folderInbox]"
            options={{
                href: null
            }}
        />
        <Tabs.Screen
            name="email/[emailPage]"
            options={{
                href: null
            }}
        />
    </Tabs>
  )
}

export default HomeLayout