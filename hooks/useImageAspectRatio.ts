import { useEffect, useState } from 'react';
import { Image } from 'react-native';

export function useImageAspectRatio(uri: string | undefined) {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!uri) return;

    Image.getSize(
      uri,
      (width, height) => {
        if (width > 0 && height > 0) {
          setAspectRatio(width / height);
        }
      },
      (error) => {
        console.warn('Failed to get image size:', error);
      }
    );
  }, [uri]);

  return aspectRatio;
}
