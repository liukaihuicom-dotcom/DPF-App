import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PhosphorIcon, type PhosphorIconName } from '@/src/components/PhosphorIcon';
import type { DiscoverModuleId } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';

import { AppText } from '@/src/components/Typography';

function TabBarIcon(props: {
  name: PhosphorIconName;
  color: string;
}) {
  return <PhosphorIcon size={20} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const { palette, selectedDiscoverModuleId, t } = useProductSettings();
  const selectedModule = getDiscoverModuleMeta(selectedDiscoverModuleId);
  const StatusButton = () => (
    <View
      accessibilityLabel={`${t('tabs.status')}: ${t(`discover.module.${selectedDiscoverModuleId}.short`)}`}
      accessibilityRole="text"
      style={styles.statusButton}>
      <View style={StyleSheet.flatten([styles.statusIcon, { backgroundColor: `${palette.brand}12`, borderColor: `${palette.brand}66` }])}>
        <PhosphorIcon color={palette.brand} name={selectedModule.icon} size={15} />
      </View>
      <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.statusLabel} tone="brand" variant="caption">
        {t(`discover.module.${selectedDiscoverModuleId}.short`)}
      </AppText>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.brand,
        tabBarInactiveTintColor: palette.textDim,
        tabBarItemStyle: {
          minHeight: 44,
        },
        tabBarStyle: {
          backgroundColor: palette.panel,
          borderTopColor: palette.line,
          height: 68,
          paddingBottom: 7,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.markets'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="chart-line-up" />,
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: t('tabs.trade'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="list-checks" />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: t('tabs.accounts'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="user-circle" />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t('tabs.discover'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="compass" />,
        }}
      />
      <Tabs.Screen
        name="quick"
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
          },
        }}
        options={{
          title: t(`discover.module.${selectedDiscoverModuleId}.short`),
          tabBarButton: StatusButton,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen name="markets" options={{ href: null }} />
      <Tabs.Screen name="portfolio" options={{ href: null }} />
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="partner-tools" options={{ href: null }} />
    </Tabs>
  );
}

function getDiscoverModuleMeta(moduleId: DiscoverModuleId) {
  const iconByModule: Record<DiscoverModuleId, PhosphorIconName> = {
    accounts: 'user',
    challenge: 'trophy',
    community: 'chats-circle',
    education: 'graduation-cap',
    markets: 'chart-line-up',
    onboarding: 'identification-card',
    partner: 'share-network',
    profile: 'user-circle',
    rewards: 'gift',
    support: 'headphones',
  };

  return {
    icon: iconByModule[moduleId],
  };
}

const styles = StyleSheet.create({
  statusButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    padding: 0,
  },
  statusIcon: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  statusLabel: {
    fontSize: 10,
    lineHeight: 14,
    maxWidth: 52,
  },
});
