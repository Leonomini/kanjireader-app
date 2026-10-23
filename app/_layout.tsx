import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { ReturnButton } from '@/components/Buttons';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ KanjiReader: require('../assets/fonts/KanjiReader.ttf') });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
    <StatusBar translucent={true} style='dark' backgroundColor='white'/>
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.mainColor,
        },
        headerTitle: '',
        headerRight: () => <ReturnButton />,
        headerBackVisible: false,
        headerTintColor: '#fff',
        headerShadowVisible: true,
        contentStyle: {
          backgroundColor: Colors.light.backgroundColor,
        }
      }}>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='+not-found' options={{ title: 'Oops! Page not found!' }} />
    </Stack>
    </>
  );
}
