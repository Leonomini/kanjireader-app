import { FuriganaItem } from '@/hooks/useFurigana';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

type Props = {
  text: string;
  furigana?: string;
};

export default function Ruby({ text, furigana }: Props) {
  return (
    <View style={styles.rubyContainer}>
      <Text style={styles.furigana}>{furigana ?? ' '}</Text>
      <Text style={styles.kanji}>{text}</Text>
    </View>
  );
}

export function renderFuriganaBlocks(blocks: FuriganaItem[][]) {
  return blocks.map((block, index) => (
    <View key={index} style={styles.rows}>
      {block.map((item, idx) => (
        <Ruby key={idx} text={item.text} furigana={item.furigana} />
      ))}
    </View>
  ));
};


const styles = StyleSheet.create({
  rubyContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  furigana: {
    fontSize: 11,
    color: '#666',
    top: 4,
  },
  kanji: {
    fontSize: 17,
    textAlign: 'center',
    // paddingHorizontal: 1,
  },
    rows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});