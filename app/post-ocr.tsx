import { View, Text, StyleSheet, Dimensions, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { renderFuriganaBlocks } from '@/components/Ruby';
import TextBox from '@/components/TextBox';
import ScaledImage from '@/components/ScaledImage';
import { useOCR } from '@/hooks/useOCR';
import { useFurigana } from '@/hooks/useFurigana';
import { copyImageToAppStorage, useHistory } from '@/hooks/useHistory';
import { translateText } from '@/services/translationService';
import Footer from '@/components/Footer';

type PostOcrParams = {
  image?: string;
};

export default function PostOcr() {
  const [showFurigana, setShowFurigana] = useState(false);
  const [showOCR, setShowOCR] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [savedTranslation, setSavedTranslation] = useState<string>('');
  const [translationLoading, setTranslationLoading] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [isProcessingChange, setIsProcessingChange] = useState(false);
  const { image } = useLocalSearchParams<PostOcrParams>();
  
  // Benutzerdefinierte Hooks
  const { ocrText, setOcrText, ocrLoading } = useOCR(image);
  const { furiganaBlocks, triggerFurigana, setFuriganaBlocks } = useFurigana();
  const { saveTranslation } = useHistory();

  const handleFurigana = () => {
    setShowFurigana(prev => !prev);
  };

  const handleSave = async () => {
    if (!image || !ocrText || !savedTranslation || isAlreadySaved) return;

    try {
      const savedImageUri = await copyImageToAppStorage(image);
      await saveTranslation(ocrText, savedTranslation, 'en', savedImageUri, furiganaBlocks);

      setIsAlreadySaved(true);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);

      Alert.alert(
        'Saving failed',
        'The document could not be saved. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      setIsProcessingChange(true);
      setOcrText(editableText);
      setIsAlreadySaved(false);
      setIsProcessingChange(false);
    } else {
      setEditableText(ocrText);
    }
    setIsEditing(prev => !prev);
  };

  useEffect(() => {
    if (!ocrLoading && ocrText) {
      const fetchTranslation = async () => {
        setTranslationLoading(true);
        const translated = await translateText(ocrText);
        setSavedTranslation(translated);
        setTranslationLoading(false);
      };
      fetchTranslation();
      setFuriganaBlocks(null),
      triggerFurigana(ocrText);
    }
  }, [ocrText]);


  return (
  <>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80} // ggf. anpassen
    >
      <View style={styles.container}>
        {image && (
          <>
            <ScaledImage
              uri={image}
              maxHeight={Dimensions.get('window').height * 0.18}
              showExpandButton={true}
            />
            <View style={styles.divider} />
          </>
        )}

        <TextBox
          title="OCR Result:"
          editable={true}
          isEditing={isEditing}
          editLoading={isProcessingChange}
          onToggleEdit={showOCR ? handleEdit : undefined}
          showContent={showOCR}
          onToggleContent={() => setShowOCR(prev => !prev)}
          onToggleFurigana={showOCR ? handleFurigana : undefined}
          furiganaActive={showFurigana}
        >
          {ocrLoading ? (
            <Text style={styles.text}>Loading...</Text>
          ) : showFurigana && furiganaBlocks && !isEditing ? (
            renderFuriganaBlocks(furiganaBlocks)
          ) : isEditing ? (
            <TextInput
              multiline={true}
              scrollEnabled={true}
              style={[styles.text, styles.textInput]}
              value={editableText}
              onChangeText={setEditableText}
              autoFocus={true}
              textAlignVertical="top"
            />
          ) : (
            <Text style={styles.text}>{ocrText}</Text>
          )}
        </TextBox>

        <View style={styles.divider} />

        <TextBox
          title="Translation:"
          showContent={showTranslation}
          onToggleContent={() => setShowTranslation(prev => !prev)}
        >
          {translationLoading ? (
            <Text style={styles.text}>Loading...</Text>
          ) : (
            <Text style={styles.text}>{savedTranslation}</Text>
          )}
        </TextBox>

        {!showOCR && !showTranslation && <View style={styles.divider} />}
      </View>
    </KeyboardAvoidingView>

    <Footer
      leftButtonText={isAlreadySaved ? 'Document Saved' : 'Save Document'}
      onLeftButtonPress={handleSave}
      leftActive={isAlreadySaved}
      leftIconInactive="circle"
      leftIconActive="check-circle"
    />
  </>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    lineHeight: 33,
  },
  textInput: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: 'white',
  },
  divider: {
    width: '100%',
    height: 2.5,
    backgroundColor: '#494949',
  },
  toast: {
    position: 'absolute',
    bottom: 90,
    backgroundColor: 'rgba(117, 44, 44, 1)',
    paddingVertical: 20,
    width: 250,
    borderRadius: 10,
  },
  toastText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.95,
  },
});
