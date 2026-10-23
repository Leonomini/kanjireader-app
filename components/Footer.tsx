import { View, StyleSheet } from 'react-native';
import { FooterButton } from '@/components/Buttons';
import { Colors } from '@/constants/Colors';
import Octicons from '@expo/vector-icons/Octicons';
import { ComponentType } from 'react';

type FooterProps = {
  leftButtonText: string;
  rightButtonText?: string;
  onLeftButtonPress?: () => void;
  onRightButtonPress?: () => void;
  leftActive?: boolean;
  rightActive?: boolean;
  leftIconActive?: string;
  leftIconInactive?: string;
  rightIconActive?: string;
  rightIconInactive?: string;
  leftIconComponentActive?: ComponentType<any>;
  leftIconComponentInactive?: ComponentType<any>;
  rightIconComponentActive?: ComponentType<any>;
  rightIconComponentInactive?: ComponentType<any>;
};

export default function Footer({
  leftButtonText,
  rightButtonText,
  onLeftButtonPress,
  onRightButtonPress,
  leftActive = false,
  rightActive = false,
  leftIconActive,
  leftIconInactive,
  rightIconActive,
  rightIconInactive,
  leftIconComponentActive,
  leftIconComponentInactive,
  rightIconComponentActive,
  rightIconComponentInactive,
}: FooterProps) {
  return (
    <View style={styles.footer}>
      <FooterButton
        buttonText={leftButtonText}
        onPress={onLeftButtonPress}
        active={leftActive}
        iconName={leftActive ? leftIconActive : leftIconInactive}
        iconComponent={leftActive ? leftIconComponentActive : leftIconComponentInactive}
        style={!rightButtonText ? styles.narrowButton : undefined}
      />
      {rightButtonText && (
        <FooterButton
          buttonText={rightButtonText}
          onPress={onRightButtonPress}
          active={rightActive}
          iconName={rightActive ? rightIconActive : rightIconInactive}
          iconComponent={rightActive ? rightIconComponentActive : rightIconComponentInactive}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Colors.light.mainColor,
    height: 92,
    width: '100%',
    paddingVertical: 18,
  },
  narrowButton: {
    flex: 0.60,
  },
});

