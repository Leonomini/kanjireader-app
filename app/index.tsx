import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { MainButton } from '@/components/Buttons';
import { useRouter } from 'expo-router';
import backgroundImage from '@/assets/images/background2.png';

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
    source={backgroundImage}
    style={styles.background}
    resizeMode='cover'
    >
    <View style={styles.container}>

      <Text style={styles.title}>KanjiReader</Text>

      <MainButton
        onPress={() => router.push('/pre-ocr-camera')}
        iconSource={require('../assets/images/camera.png')}
        buttonText={'Take a photo'}
      />

      <MainButton
        onPress={() => router.push('/pre-ocr-gallery')}
        iconSource={require('../assets/images/gallery.png')}
        buttonText={'Select from gallery'}
        />

      <MainButton
        onPress={() => router.push('/docs')}
        iconSource={require('../assets/images/document.png')}
        buttonText={'Saved documents'}
      />

    </View>
  </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 26,
  },
  title: {
    fontSize: 62,
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: 'KanjiReader',
  },
});
