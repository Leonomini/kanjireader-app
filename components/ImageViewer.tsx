import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imgSource: { uri: string };
  contentFit: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
};

export default function ImageViewer({ imgSource, contentFit }: Props) {
  return <Image source={imgSource} style={styles.image} contentFit={contentFit} />;
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
