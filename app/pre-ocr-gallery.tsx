import { View, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from '@/components/ImageViewer';
import Footer from '@/components/Footer';
import React from 'react';
import placeholderImage from '@/assets/images/placeholder-img.png';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


// Funktion zum Überprüfen und Anfordern von Berechtigungen
async function getPermissionAsync() {
  const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!libraryPermission.granted) {
    Alert.alert(
      'Permission Required',
      'KanjiReader needs permission to access your photo library to proceed.');
    return false;
  }
  return true;
}

// Funktion zum Öffnen der Bildbibliothek und Setzen des Bildes
async function pickImageAsync(setSelectedImage: (uri: string) => void) {
  const hasPermission = await getPermissionAsync();
  if (!hasPermission) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setSelectedImage(result.assets[0].uri);
    return true;
  } else {
    return false;
  }
}

export default function PreOcrGallery() {
  const router = useRouter();
  const [image, setImage] = useState<string | undefined>(undefined);

  // Bildauswahl beim Initialisieren des Screens
  useEffect(() => {
    (async () => {
      const success = await pickImageAsync(setImage);
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
          contentFit={image ? 'contain' : 'cover'}
        />
      </View>
      <Footer
        leftButtonText="Scan"
        leftIconInactive="text-search"
        leftIconComponentInactive={MaterialCommunityIcons}
        rightButtonText="Gallery"
        rightIconInactive="image-multiple-outline"
        rightIconComponentInactive={MaterialCommunityIcons}
        onLeftButtonPress={() => {
          if (image) {
            router.push({ pathname: '/post-ocr', params: { image } });
          } else {
            alert('Please select a photo from the gallery first before scanning.');
          }
        }}        
        onRightButtonPress={() => pickImageAsync(setImage)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
});
