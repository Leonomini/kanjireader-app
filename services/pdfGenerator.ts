import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { FuriganaItem } from '@/hooks/useFurigana';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'saved_directory_uri';

type PdfContent = {
  ocrText: string;
  furigana: FuriganaItem[][];
  translation: string;
  imageUri?: string;
  date?: string;
};

// -- PDF-Dokument erzeugen und speichern --
export async function createAndSavePdf(content: PdfContent) {
  const { ocrText, furigana, translation, imageUri, date } = content;

  const imageHtml = imageUri ? await getImageHtml(imageUri) : '';
  const furiganaHtml = getFuriganaHtml(furigana, ocrText);
  const translationHtml = translation.replace(/\n/g, '<br />');
  const dateHtml = date ? formatDateHtml(date) : '';

  const html = buildPdfHtml({ imageHtml, furiganaHtml, translationHtml, dateHtml });

  const file = await printToFileAsync({ html, base64: false });
  await saveFile(file.uri, 'kanjireader.pdf', 'application/pdf');
}


// -- Hilfsfunktionen: PDF-Erzeugung --
function formatDateHtml(date: string): string {
  return `<div class="date">Date: ${new Date(date).toLocaleString()}</div>`;
}

async function getImageHtml(uri: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const mimeType = getMimeType(uri);
  return `<img src="data:${mimeType};base64,${base64}" />`;
}

function getMimeType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      throw new Error(`Unsupported image format: .${extension}`);
  }
}

function getFuriganaHtml(blocks: FuriganaItem[][] | undefined, originalText: string): string {
  if (!blocks || blocks.length === 0) {
    return `<div class="textJp">${originalText}</div>`;
  }

  return blocks
    .map(block =>
      `<div class="textJp">` +
      block.map(({ text, furigana }) =>
        furigana
          ? `<ruby>${text}<rt>${furigana}</rt></ruby>`
          : text
      ).join('') +
      `</div>`
    )
    .join('');
}

function buildPdfHtml(parts: {
  imageHtml: string;
  furiganaHtml: string;
  translationHtml: string;
  dateHtml: string;
}): string {
  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Noto Sans JP', sans-serif;
            margin: 24px;
            background-color: #f9f9f9;
            color: #333;
          }
          .card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            padding: 21px;
          }
          img {
            max-height: 300px;
            max-width: 100%;
            border-radius: 8px;
            border: 1px solid #ddd;
            margin-bottom: 16px;
            display: block;
          }
          .textJp {
            font-size: 16px;
            line-height: 1.9;
          }
          .textEn {
            font-size: 16px;
            margin-bottom: 8px;
            line-height: 1.5;
          }
          .date {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
          }
          .divider {
            border: none;
            border-top: 1px solid #ddd;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="card">
          ${parts.imageHtml}
          ${parts.furiganaHtml}
          <hr class="divider" />
          <div class="textEn">${parts.translationHtml}</div>
          ${parts.dateHtml}
        </div>
      </body>
    </html>
  `;
}


// -- Speicherungsfunktion --
async function saveFile(uri: string, filename: string, mimetype: string) {
  if (Platform.OS === 'android') {
    const directoryUri = await getOrRequestDirectoryUri();

    if (!directoryUri) {
      console.warn('Kein Verzeichnis-URI – Berechtigung vermutlich abgelehnt.');
      return showSaveFallback(uri);
    }

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        directoryUri,
        filename,
        mimetype
      );

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Datei erfolgreich gespeichert:', fileUri);
    } catch (error) {
      console.error('Fehler beim Speichern der Datei:', error);
      showSaveFallback(uri);
    }
  } else {
    shareAsync(uri, { UTI: 'public.item' }); // iOS
  }
}


// -- Hilfsfunktionen: Speicherung --
function showSaveFallback(uri: string) {
    Alert.alert(
      'Unable to save',
      'The file could not be saved. You can share it instead or check your storage permissions in the system settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => shareAsync(uri) }
      ]
    );
}

async function getOrRequestDirectoryUri(): Promise<string | null> {
  const savedUri = await AsyncStorage.getItem(STORAGE_KEY);

  if (savedUri) {
    try {
      await FileSystem.StorageAccessFramework.readDirectoryAsync(savedUri);
      return savedUri;
    } catch (error) {
      // URI ist nicht mehr gültig
    }
  }

  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (permissions.granted) {
    await AsyncStorage.setItem(STORAGE_KEY, permissions.directoryUri);
    return permissions.directoryUri;
  }

  return null;
}