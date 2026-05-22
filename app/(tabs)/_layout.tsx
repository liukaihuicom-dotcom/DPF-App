import { Tabs } from 'expo-router';

import { AppIcon, type AppIconName } from '@/src/components/AppIcon';
import type { DiscoverModuleId } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { typography } from '@/src/theme/tokens';

function TabBarIcon(props: {
  name: AppIconName;
  color: string;
}) {
  return <AppIcon size={20} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const { palette, selectedDiscoverModuleId, t } = useProductSettings();
  const selectedModule = getDiscoverModuleMeta(selectedDiscoverModuleId);

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
          ...typography.microLabel,
        },
      }}>
      <Tabs.Screen
        name="markets"
        options={{
          title: t('tabs.markets'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="marketTrend" />,
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: t('tabs.trade'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="taskChecklist" />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: t('tabs.accounts'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="accountBank" />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t('tabs.discover'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="discoverCompass" />,
        }}
      />
      <Tabs.Screen
        name="quick"
        options={{
          title: t(`discover.module.${selectedDiscoverModuleId}.short`),
          tabBarAccessibilityLabel: `${t('tabs.status')}: ${t(`discover.module.${selectedDiscoverModuleId}.short`)}`,
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name={selectedModule.icon} />,
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="portfolio" options={{ href: null }} />
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="partner-tools" options={{ href: null }} />
    </Tabs>
  );
}

function getDiscoverModuleMeta(moduleId: DiscoverModuleId) {
  const iconByModule: Record<DiscoverModuleId, AppIconName> = {
    accounts: 'userProfile',
    challenge: 'achievementTrophy',
    community: 'communityChat',
    education: 'educationCap',
    markets: 'marketTrend',
    onboarding: 'identityCard',
    partner: 'partnerNetwork',
    profile: 'userAvatar',
    rewards: 'rewardGift',
    support: 'supportHeadset',
  };

  return {
    icon: iconByModule[moduleId],
  };
}
