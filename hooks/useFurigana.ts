import { useState } from 'react';
import { tokenize } from 'react-native-japanese-text-analyzer';
import { toHiragana, isKanji, isHiragana } from 'wanakana';

export type FuriganaItem = {
  text: string;
  furigana?: string;
};

export type Token = {
  surface_form: string;
  reading?: string;
};

// ── Hook Function ──
export const useFurigana = () => {
  const [furiganaBlocks, setFuriganaBlocks] = useState<FuriganaItem[][] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const triggerFurigana = async (ocrText: string) => {
    if (!ocrText || isLoading) return;

    setIsLoading(true);

    try {
      const blocks = await generateFurigana(ocrText);
      setFuriganaBlocks(blocks);
    } catch (error) {
      console.error('Fehler bei Furigana-Generierung:', error);
      setFuriganaBlocks(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    furiganaBlocks,
    triggerFurigana,
    setFuriganaBlocks,
    isLoading,
  };
};


// ── Hilfsunktionen ──
const generateFurigana = async (ocrText: string): Promise<FuriganaItem[][] | null> => {
  if (!containsKanji(ocrText)) {
    return null; // Keine Furigana notwendig
  }
  const textBlocks = splitIntoBlocks(ocrText);

  const processedBlocks = await Promise.all(
    textBlocks.map(async (block) => {
      const tokens: Token[] = await tokenize(block);
      return tokens.flatMap(({ surface_form, reading }) =>
        splitToken(surface_form, toHiragana(reading))
      );
    })
  );

  console.log('Furigana-Generierung abgeschlossen');
  return processedBlocks;
};


const splitToken = (surface: string, reading?: string): FuriganaItem[] => {
  if (!surface) return [];

  // Wenn kein Kanji oder keine Lesung vorhanden ist
  const normalizedReading = reading || '';
  if (!normalizedReading || !containsKanji(surface)) {
    return [{ text: surface }];
  }

  const chars = [...surface];
  const firstKanji = chars.findIndex(isKanji);
  const lastKanji = chars.map(isKanji).lastIndexOf(true);

  const leading = surface.slice(0, firstKanji);
  const trailing = surface.slice(lastKanji + 1);
  const kanjiCore = surface.slice(firstKanji, lastKanji + 1);
  const readingCore = normalizedReading.slice(leading.length, normalizedReading.length - trailing.length);

  const items: FuriganaItem[] = [];
  if (leading) items.push({ text: leading });

  // Falls der Kanji-Kern auch Hiragana enthält
  const hiraganaChunk = findHiraganaChunk(kanjiCore);
  if (hiraganaChunk) {
    const [kanjiParts, readingParts] = splitCore(kanjiCore, readingCore, hiraganaChunk);

    if (kanjiParts.first) items.push({ text: kanjiParts.first, furigana: readingParts.first });
    items.push({ text: hiraganaChunk }); // dieser Teil braucht kein Furigana
    if (kanjiParts.second) items.push({ text: kanjiParts.second, furigana: readingParts.second });
  } else {
    items.push({ text: kanjiCore, furigana: readingCore });
  }

  if (trailing) items.push({ text: trailing });

  return items;
};


// Trennung von Kanji-Kern und zugehörigem Reading
const splitCore = (
  kanjiCore: string,
  readingCore: string,
  hiraganaChunk: string
): [{ first: string; second: string }, { first: string; second: string }] => {
  const chunkStart = kanjiCore.indexOf(hiraganaChunk);
  const chunkEnd = chunkStart + hiraganaChunk.length;

  const kanjiFirst = kanjiCore.slice(0, chunkStart);
  const kanjiSecond = kanjiCore.slice(chunkEnd);

  const readingStart = readingCore.indexOf(hiraganaChunk);
  const readingEnd = readingStart + hiraganaChunk.length;

  const readingFirst = readingCore.slice(0, readingStart);
  const readingSecond = readingCore.slice(readingEnd);

  return [
    { first: kanjiFirst, second: kanjiSecond },
    { first: readingFirst, second: readingSecond },
  ];
};


const splitIntoBlocks = (text: string): string[] =>
  text.split('\n').map(block => block.trim()).filter(Boolean);

const findHiraganaChunk = (text: string): string => {
  return [...text].filter(isHiragana).join('');
};

const containsKanji = (text: string): boolean => [...text].some(isKanji);
