import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Translation } from '@/components/TranslationItem';

const TRANSLATION_STORAGE_KEY = 'translations';

// Hook zur Verwaltung des Übersetzungsverlaufs
export function useHistory() {
  const [history, setHistory] = useState<Translation[]>([]);

  // Lädt gespeicherte Übersetzungen aus dem AsyncStorage und aktualisiert den Zustand
  const loadTranslations = useCallback(async () => {
    try {
      const existingData = await AsyncStorage.getItem(TRANSLATION_STORAGE_KEY);
      if (existingData) {
        setHistory(JSON.parse(existingData) as Translation[]);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Übersetzungen:', error);
    }
  }, []);

  // Lädt Übersetzungen beim Initialisieren des Hooks
  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

   // Speichert eine neue Übersetzung im lokalen Speicher und
   // ergänzt sie am Anfang der Verlaufsliste
  async function saveTranslation(
    original: string,
    translated: string,
    lang: string,
    imageUri?: string,
    furigana?: any
  ) {
    try {
      const newEntry: Translation = {
        id: Date.now(),
        original,
        translated,
        lang,
        imageUri,
        furigana,
        date: new Date().toISOString(),
      };

      const updatedHistory = [newEntry, ...history];
      await AsyncStorage.setItem(TRANSLATION_STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);

      console.log('Übersetzung gespeichert:', newEntry);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  }

  // Löscht einen gespeicherten Eintrag anhand seiner ID
  async function deleteTranslation(id: number) {
    try {
      const updatedHistory = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(TRANSLATION_STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      console.log(`Übersetzung mit ID ${id} gelöscht.`);
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  }

  // Löscht den gesamten Übersetzungsverlauf aus dem Speicher
  async function clearHistory() {
    try {
      await AsyncStorage.removeItem(TRANSLATION_STORAGE_KEY);
      setHistory([]);
      console.log('Übersetzungsverlauf gelöscht.');
    } catch (error) {
      console.error('Fehler beim Löschen des Verlaufs:', error);
    }
  }

  return {
    history,
    saveTranslation,
    deleteTranslation,
    clearHistory,
    loadTranslations,
  };
}

// Kopiert ein Bild in das App-Verzeichnis
export async function copyImageToAppStorage(sourceUri: string): Promise<string> {
  const fileName = `img_${Date.now()}.jpg`;
  const destUri = `${FileSystem.documentDirectory}${fileName}`;

  try {
    await FileSystem.copyAsync({ from: sourceUri, to: destUri });
    return destUri;
  } catch (error) {
    console.error('Fehler beim Kopieren des Bildes:', error);
    return sourceUri;
  }
}
