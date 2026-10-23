import { TouchableOpacity, Text, Image, StyleSheet, View, StyleProp, ViewStyle, ActivityIndicator, GestureResponderEvent } from "react-native";
import { useRouter } from 'expo-router'
import { LinearGradient } from "expo-linear-gradient";
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from '@/constants/Colors';
import { ComponentType } from "react";

type ButtonProps = {
  onPress?: () => void;
  iconSource?: any;
  buttonText?: string;
};

type FooterButtonProps = {
  onPress?: () => void;
  buttonText?: string;
  active?: boolean;
  iconName?: string;
  iconComponent?: ComponentType<any>;
  style?: StyleProp<ViewStyle>;
};

interface DocsButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
  statusMessage?: string;
  showStatus?: boolean;
  style?: ViewStyle;
}

type ToggleButtonProps = {
  label?: React.ReactNode;
  active?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: React.ReactNode;
  backgroundColor?: string;
  backgroundColorActive?: string;
};


// Button für den Home-Screen
export function MainButton({ onPress, iconSource, buttonText }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.mainButton} onPress={onPress}>
        <LinearGradient
        colors={[Colors.light.mainColor, "#1c0000"]} // Farbverlauf von Dunkelrot nach Rot
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.mainButton, {padding: 16}]}
        >
      <Image style={styles.icon} source={iconSource} />
      <Text style={[styles.buttonText, {fontSize: 20}]}>{buttonText}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};


// Button für den Footer
export function FooterButton({
  onPress,
  buttonText,
  iconName,
  iconComponent = Octicons,
  active = false,
  style,
}: FooterButtonProps) {
  const backgroundColor = active
    ? Colors.light.buttonColorActive
    : Colors.light.buttonColor;

  const borderColor = active
    ? Colors.light.buttonBorderColorActive
    : Colors.light.buttonBorderColor;

  const textColor = active
    ? Colors.light.buttonTextActive
    : Colors.light.buttonText;

  const iconColor = textColor;
  const Icon = iconComponent;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.footerButton,
        {
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      <View style={styles.iconWithText}>
        {iconName && (
          <Icon
            name={iconName}
            size={23}
            color={iconColor}
            style={{ marginRight: 11 }}
          />
        )}
        <Text style={[styles.buttonText, { color: textColor }]}>
          {buttonText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}


// Return-Button für den Header
export function ReturnButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPressIn={ () => router.dismissTo('/') }
      style={styles.returnButton}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Octicons name="x" size={26} color="white" />
    </TouchableOpacity>
  );
}


// Buttons für die docs-Seite
export function DocsButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  backgroundColor = Colors.light.buttonColor,
  statusMessage,
  showStatus = false,
  style,
}: DocsButtonProps) {
  const displayText = showStatus && statusMessage ? statusMessage : title;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.docsButton, { backgroundColor, opacity: disabled ? 0.8 : 1 }, style]}
    >
      {loading && <ActivityIndicator size="small" color="#fff" style={styles.spinner} />}
      <Text style={styles.smallButtonText}>{displayText}</Text>
    </TouchableOpacity>
  );
}

// Buttons für die post-ocr-Seite
export function ToggleButton({
  label,
  active = false,
  onPress,
  icon,
  backgroundColor = Colors.light.buttonColor,
  backgroundColorActive = Colors.light.buttonColorActive
}: ToggleButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.toggleButton,
        { backgroundColor: active? backgroundColorActive : backgroundColor }]}
        onPress={onPress}
    >
      <View style={styles.buttonContent}>
        {icon && icon}
        {label && <Text style={styles.smallButtonText}>{label}</Text>}
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  mainButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "87%",
    gap: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButton: {
    flex: 0.42,
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
  },
  returnButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 10,
    borderColor: Colors.light.buttonBorderColor,
    paddingHorizontal: 13,
    paddingVertical: 3,
    height: '100%',
    backgroundColor: Colors.light.buttonColor,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  docsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  spinner: {
    marginRight: 8,
  },
  toggleButton: {
    paddingHorizontal: 8,
    borderRadius: 4,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
    buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.light.buttonText,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});
