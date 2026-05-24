import { Tabs } from 'expo-router';

import type { AppIconName } from '@/src/components/AppIcon';
import { TabBarIcon } from '@/src/components/navigation';
import type { DiscoverModuleId } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { typography } from '@/src/theme/tokens';

export default function TabLayout() {
  const { colors, selectedDiscoverModuleId, t } = useProductSettings();
  const selectedModule = getDiscoverModuleMeta(selectedDiscoverModuleId);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand.fg,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarItemStyle: {
          minHeight: 44,
        },
        tabBarStyle: {
          backgroundColor: colors.surface.panel,
          borderTopColor: colors.border.default,
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
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.trading.market" tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: t('tabs.trade'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.trading.order_ticket" tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: t('tabs.accounts'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.account.trading" tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t('tabs.discover'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.navigation.discover" tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="quick"
        options={{
          title: t(`discover.module.${selectedDiscoverModuleId}.short`),
          tabBarAccessibilityLabel: `${t('tabs.status')}: ${t(`discover.module.${selectedDiscoverModuleId}.short`)}`,
          tabBarIcon: ({ focused }) => <TabBarIcon name={selectedModule.icon} tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen name="portfolio" options={{ href: null }} />
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="partner-tools" options={{ href: null }} />
    </Tabs>
  );
}

function getDiscoverModuleMeta(moduleId: DiscoverModuleId) {
  const iconByModule: Record<DiscoverModuleId, AppIconName> = {
    accounts: 'icon.account.trading',
    challenge: 'icon.promotion.achievement',
    community: 'icon.copy.community',
    education: 'icon.education.academy',
    markets: 'icon.trading.market',
    onboarding: 'icon.kyc.identity',
    partner: 'icon.ib.network',
    profile: 'icon.account.avatar',
    rewards: 'icon.promotion.reward',
    support: 'icon.support.headset',
  };

  return {
    icon: iconByModule[moduleId],
  };
}
