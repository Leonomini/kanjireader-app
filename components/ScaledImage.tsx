import React, { useState } from 'react';
import { Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useImageAspectRatio } from '@/hooks/useImageAspectRatio';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ImageViewing from 'react-native-image-viewing';

type ScaledImageProps = {
  uri?: string;
  maxHeight?: number;
  style?: StyleProp<ViewStyle>;
  showExpandButton?: boolean;
};

const ScaledImage: React.FC<ScaledImageProps> = ({ uri, maxHeight=200, style, showExpandButton = false }) => {
  const aspectRatio = useImageAspectRatio(uri);
  const [visible, setVisible] = useState(false);

  if (!uri || !aspectRatio) return null;

  const imageStyle = [styles.image, { aspectRatio, maxHeight }];

  return (
    <>
      <View style={[styles.container, style]}>
        <Image source={{ uri }} style={imageStyle} />
        {showExpandButton && (
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={styles.expandIconContainer}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="arrow-expand-all"
              size={22}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>

      <ImageViewing
        images={[{ uri }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        backgroundColor='rgba(0,0,0,0.9)'
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
  expandIconContainer: {
    position: 'absolute',
    right: 11,
    bottom: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 5,
  },
});

export default ScaledImage;
