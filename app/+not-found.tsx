import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/Typography';
import { useProductSettings } from '@/src/settings/ProductSettings';

export default function NotFoundScreen() {
  const { palette, t } = useProductSettings();

  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={StyleSheet.flatten([styles.container, { backgroundColor: palette.bg }])}>
        <AppText variant="title">{t('notFound.title')}</AppText>
        <Link href="/launch" style={styles.link}>
          <AppText tone="brand">{t('notFound.back')}</AppText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
