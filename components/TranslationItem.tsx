import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ScaledImage from '@/components/ScaledImage';
import { renderFuriganaBlocks } from '@/components/Ruby';
import { createAndSavePdf } from '@/services/pdfGenerator';
import { DocsButton } from '@/components/Buttons';


export interface Translation {
  id: number;
  original: string;
  translated: string;
  lang: string;
  imageUri?: string;
  furigana?: any;
  date?: string;
}

interface TranslationItemProps {
  item: Translation;
  onDelete: (id: number) => void;
}

export default function TranslationItem({ item, onDelete }: TranslationItemProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFinished, setShowFinished] = useState(false);

  const handleDownload = async () => {
  try {
    setIsDownloading(true);
    setShowFinished(false);

    await createAndSavePdf({
      ocrText: item.original,
      furigana: item.furigana,
      translation: item.translated,
      imageUri: item.imageUri,
      date: item.date,
    });

    setShowFinished(true);
    setTimeout(() => setShowFinished(false), 2500);
  } catch (error) {
    console.error("PDF creation failed:", error);
  } finally {
    setIsDownloading(false);
  }
};

  return (
    <View style={styles.translationItem}>
      {item.imageUri && (
        <ScaledImage
        uri={item.imageUri}
        style={{ borderRadius: 8, borderWidth: 1, borderColor: '#ddd', overflow: 'hidden', marginBottom: 8}}
        maxHeight ={Dimensions.get('window').height * 0.18}
        />
      )}
      {item.furigana ? (
        renderFuriganaBlocks(item.furigana)
      ) : (
        <Text style={styles.text}>{item.original}</Text>
      )}
      <View style={styles.divider} />
      <Text style={styles.text}>{item.translated}</Text>

      {item.date && (
      <Text style={styles.dateText}>Date: {new Date(item.date).toLocaleString()}</Text>)}

      <View style={styles.buttonWrapper}>
        <DocsButton
          title={isDownloading ? 'LOADING...' : 'EXPORT'}
          onPress={handleDownload}
          loading={isDownloading}
          showStatus={showFinished}
          statusMessage="COMPLETE!"
        />

        <DocsButton
          title="DELETE"
          onPress={() => onDelete(item.id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  translationItem: {
    borderRadius: 12,
    padding: 16,
    marginTop: 2,
    marginBottom: 21,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 7,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    width: '100%',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 8,
  },
});
