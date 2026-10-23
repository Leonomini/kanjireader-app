// const LOCAL_API_URL = 'http://localhost:8000/translate';   // Lokale IP-Adresse
const LOCAL_API_URL = 'http://10.0.2.2:8000/translate';       // IP-Adresse für Tests im Emulator


export async function translateText(text: string): Promise<string> {
  const finalTranslations: string[] = [];  
  const blocks = text.split('\n').map(block => block.trim());

  for (const block of blocks) {
    if (!block) {
      finalTranslations.push('');
      continue;
    }
    
    const translatedGroups: string[] = [];
    const sentenceGroups = splitAndGroupSentences(block, 2);

    for (const group of sentenceGroups) {
      let success = false;
      let translatedGroup = '';

      for (let attempt = 1; attempt <= 2 && !success; attempt++) {
        try {
          const response = await fetch(LOCAL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: group }),
          });

          const result = await response.json();

          if (result?.translation) {
            translatedGroup = result.translation;
            success = true;
          } else {
            console.error(`Fehlerhafte Antwort (Versuch ${attempt}):`, result);
          }
        } catch (error) {
          console.error(`Übersetzungsfehler (Versuch ${attempt}):`, error);
        }

        if (!success) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      translatedGroups.push(translatedGroup || '[Translation Error]');
    }

    // Füge alle übersetzten Gruppen wieder zu einem Block zusammen
    finalTranslations.push(translatedGroups.join(' '));
  }

  // Rekonstruiere Text mit Absätzen
  return finalTranslations.join('\n');
}


function splitAndGroupSentences(text: string, maxSentencesPerGroup = 2): string[] {
  const sentenceRegex = /.*?[。！？]/g;
  const sentences = text.match(sentenceRegex) || [text];

  const groups: string[] = [];
  for (let i = 0; i < sentences.length; i += maxSentencesPerGroup) {
    const group = sentences.slice(i, i + maxSentencesPerGroup).join('');
    groups.push(group);
  }

  return groups;
}
