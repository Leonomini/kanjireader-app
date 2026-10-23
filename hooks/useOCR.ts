import { useState, useEffect } from 'react';
import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

type Point = { x: number; y: number };
type OCRLine = { text: string; cornerPoints?: readonly Point[]; frame?: { top: number; left: number; width: number; height: number } };
type OCRBlock = { lines?: OCRLine[]; cornerPoints?: readonly Point[]; frame?: { top: number; left: number; width: number; height: number } };


// OCR Hook
export const useOCR = (image?: string) => {
  const [ocrText, setOcrText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const processImage = async () => {
      if (!image) {
        setOcrText("No image passed.");
        return;
      }

      setOcrLoading(true);
      const rawText = await performOCR(image, () =>
        Alert.alert('Oops!', 'No text found. Try another image.', [{ text: 'Got it', onPress: () => router.dismissTo('/') }])
      );
      setOcrText(cleanRecognizedText(rawText));
      setOcrLoading(false);
    };
    processImage();
  }, []);

  return { ocrText, setOcrText, ocrLoading };
};

// Text bereinigen (Zeilenumbrüche außer nach Satzzeichen entfernen)
const cleanRecognizedText = (text: string): string => {
  const sentencePunctuation = /[。！？!?.,]/;
  if (sentencePunctuation.test(text)) return text.replace(/(?<![。！？!?.,])\n/g, '');
  return text;
};

// OCR Hauptfunktion
const performOCR = async (imageUri: string, onEmptyText?: () => void): Promise<string> => {
  if (!imageUri || typeof imageUri !== 'string') return "Invalid image format.";

  try {
    const result = await TextRecognition.recognize(imageUri, TextRecognitionScript.JAPANESE);
    console.log(JSON.stringify(result, null, 2));
    console.log(result);
    const blocks: OCRBlock[] = result.blocks ?? [];

    if (!blocks.length) {
      onEmptyText?.();
      return "No Text Detected";
    }

    // Vor Sortierung: Log Blocks & Lines
    console.log('\n=== Vor der Sortierung ===');
    blocks.forEach((block, i) => {
      console.log(`Block ${i + 1}:`);
      (block.lines ?? []).forEach((line, j) => console.log(`Zeile ${j + 1}: ${line.text}`));
    });

    const vertical = isVerticalLayout(blocks);
    const sortedBlocks = sortBlocks(blocks, vertical);

    // Nach Sortierung: Sortiere Lines, Log & Text zusammensetzen
    console.log('\n=== Nach der Sortierung ===');
    const rawText = sortedBlocks.map((block, i) => {
      const sortedLines = sortLines(block.lines ?? [], vertical);
      console.log(`Block ${i + 1}:`);
      sortedLines.forEach((line, j) => console.log(`Zeile ${j + 1}: ${line.text}`));
      return sortedLines.map(line => line.text.trim()).join('\n');
    }).join('\n');

    console.log('\n=== Finaler Text ===\n', rawText);
    return rawText || "No Text Detected";

  } catch (error) {
    console.error("OCR Fehler:", error);
    return "Text Recognition Error";
  }
};

// Hilfsfunktionen

// Bounding Box berechnen
// Layout-Richtung erkennen (vertikal = Höhe > Breite) über frame
const isVerticalLayout = (blocks: OCRBlock[]) => {
  for (const block of blocks) {
    const height = block.frame?.height ?? 0;
    const width = block.frame?.width ?? 0;
    if (height <= width) {
      return false;
    }
  }
  return true;
};


// Beispiel: Blocks sortieren (vertikal: rechts->links)
const sortBlocks = (blocks: OCRBlock[], vertical: boolean) => {
  if (!vertical) {
    return blocks;
  }
  return [...blocks].sort((a, b) => {
    const aFrame = a.frame ?? { top: 0, left: 0, width: 0, height: 0 };
    const bFrame = b.frame ?? { top: 0, left: 0, width: 0, height: 0 };
    return bFrame.left - aFrame.left;
  });
};

const sortLines = (lines: OCRLine[], vertical: boolean) => {
  if (!vertical) {
    return lines;
  }
  return [...lines].sort((a, b) => {
    const aFrame = a.frame ?? { top: 0, left: 0, width: 0, height: 0 };
    const bFrame = b.frame ?? { top: 0, left: 0, width: 0, height: 0 };
    return aFrame.left - bFrame.left;
  });
};

