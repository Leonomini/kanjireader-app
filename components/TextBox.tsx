import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { ToggleButton } from '@/components/Buttons';
import { Colors } from '@/constants/Colors';


type TextBoxProps = {
  title: string;
  children: React.ReactNode;
  editable?: boolean;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  editLoading?: boolean;
  showContent?: boolean;
  onToggleContent?: () => void;
  onToggleFurigana?: () => void;
  furiganaActive?: boolean;
};

export default function TextBox({
  title,
  children,
  editable,
  isEditing,
  onToggleEdit,
  editLoading,
  showContent,
  onToggleContent,
  onToggleFurigana,
  furiganaActive: showFurigana,
}: TextBoxProps) {

  return (
    <View style={[styles.textBox, showContent && { flex: 1 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.buttonWrapper}>
          {editable && (
            <ToggleButton
              label={isEditing ? 'SAVE' : 'EDIT'}
              onPress={onToggleEdit}
              active={isEditing}
              icon={
                editLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : isEditing ? (
                  <Octicons name="check" size={15} color="white" />
                ) : (
                  <Octicons name="pencil" size={15} color="white" />
                )
              }
            />
          )}

          {typeof showFurigana === 'boolean' && (
            <ToggleButton
              label={
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[styles.text, { fontSize: 16 , marginRight: 7 }]}>ふ</Text>
                  <Text style={styles.text}>FURI</Text>
                </View>
              }
              onPress={onToggleFurigana}
              active={showFurigana}
            />
          )}

          {typeof showContent === 'boolean' && (
            <ToggleButton
              label={showContent ? 'HIDE' : 'SHOW'}
              onPress={onToggleContent}
              active={showContent}
              backgroundColor={Colors.light.buttonColorActive}
              backgroundColorActive={Colors.light.buttonColor}
              icon={
                showContent ? (
                  <Octicons name="eye-closed" size={15} color="white" />
                  )  : (
                  <Octicons name="eye" size={15} color="white" />
                )
              }
            />
          )}
        </View>
      </View>

      {showContent && (
        <>
          <View style={styles.divider} />
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContainer}
          >
            {children}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textBox: {
    flexDirection: 'column',
    width: '100%',
  },
  scrollContainer: {
    paddingVertical: 13,
    paddingHorizontal: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    height: 45,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#646464',
  },
});
