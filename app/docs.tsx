import { View, Text, StyleSheet, FlatList } from 'react-native';
import Footer from '@/components/Footer';
import TranslationItem from '@/components/TranslationItem';
import { useHistory } from '@/hooks/useHistory';

export default function SavedTranslations() {
  const { history, deleteTranslation, clearHistory } = useHistory();

  return (
    <>
    <View style={styles.container}>
    <FlatList
      data={history}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
      <TranslationItem item={item} onDelete={deleteTranslation} />
    )}
    ListHeaderComponent={() => (
      <Text style={styles.title}>Saved Documents</Text>
    )}
    />
    </View>

    <Footer
      leftButtonText={'Delete History'}
      onLeftButtonPress={clearHistory}
      leftIconInactive="trash"
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 20,
  }
});

