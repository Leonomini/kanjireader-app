import { View, StyleSheet, Alert, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import ImageViewer from '@/components/ImageViewer';
import Footer from '@/components/Footer';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import placeholderImage from '@/assets/images/placeholder-img.png';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


// Funktion zum Überprüfen und Anfordern von Berechtigungen
async function getPermissionAsync() {
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  if (!cameraPermission.granted) {
    Alert.alert(
      'Permission Required',
      'KanjiReader needs permission to access your camera to proceed.');
    return false;
  }
  return true;
}

// Funktion zum Öffnen der Kamera, ein Foto machen und das Bild setzen
async function takePhotoAsync(setImage: (uri: string) => void) {
  const hasPermission = await getPermissionAsync();
  if (!hasPermission) return;

  const result = await ImagePicker.launchCameraAsync({
    cameraType: ImagePicker.CameraType.back,
    allowsEditing: true,
    // aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
    return true;
  } else {
    return false;
  }
}

export default function PreOcr() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const router = useRouter();

  // Bildauswahl beim Initialisieren des Screens
  useEffect(() => {
    (async () => {
      const success = await takePhotoAsync(setImage);
      if (!success) {
        router.dismissTo('/');
      }
    })();
  }, []);

  return (
    <>
    <View style={styles.container}>
      <ImageViewer
        imgSource={image || placeholderImage}
        contentFit={image ? 'contain' : 'cover'} />
    </View>
    <Footer
        leftButtonText='Scan'
        leftIconInactive="text-search"
        leftIconComponentInactive={MaterialCommunityIcons}
        rightButtonText='Retry'
        rightIconInactive="camera-outline"
        rightIconComponentInactive={MaterialCommunityIcons}
        onLeftButtonPress={() => {
          if (image) {
            router.push({ pathname: '/post-ocr', params: { image } });
          } else {
            alert('Please take a photo first before scanning.');
          }
        }}
        onRightButtonPress={() => takePhotoAsync(setImage)}

    /></>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
}); 