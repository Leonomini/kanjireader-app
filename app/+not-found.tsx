import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Link href='/'>
        <Text style={styles.text}>Go back to Home screen</Text>
      </Link>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundColor,
  },
  text: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});
