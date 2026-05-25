import { Tabs, useLocalSearchParams, usePathname } from 'expo-router';

import type { AppIconName } from '@/src/components/AppIcon';
import { TabBarIcon } from '@/src/components/navigation';
import type { DiscoverModuleId } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { titleTypography } from '@/src/theme/tokens';

export default function TabLayout() {
  const { module } = useLocalSearchParams<{ module?: string }>();
  const { colors, selectedDiscoverModuleId, t } = useProductSettings();
  const pathname = usePathname();
  const partnerTabActive = pathname === '/partner-tools';
  const activeDiscoverModuleId = isDiscoverModuleId(module) ? module : selectedDiscoverModuleId;
  const selectedModule = getDiscoverModuleMeta(activeDiscoverModuleId);

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
          borderTopWidth: 0.5,
          height: 68,
          paddingBottom: 7,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          ...titleTypography.bottomTabs,
        },
      }}>
      <Tabs.Screen
        name="markets"
        options={{
          title: t('tabs.markets'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.trading.market" styleVariant={focused ? 'fill' : 'line'} tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: t('tabs.trade'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.trading.order_ticket" styleVariant={focused ? 'fill' : 'line'} tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: t('tabs.accounts'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.account.trading" styleVariant={focused ? 'fill' : 'line'} tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t('tabs.discover'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.navigation.discover" styleVariant={focused ? 'fill' : 'line'} tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="quick"
        options={{
          href: partnerTabActive ? null : '/quick',
          title: t(`discover.module.${activeDiscoverModuleId}.short`),
          tabBarAccessibilityLabel: `${t('tabs.status')}: ${t(`discover.module.${activeDiscoverModuleId}.short`)}`,
          tabBarIcon: ({ focused }) => <TabBarIcon name={selectedModule.icon} styleVariant={focused ? 'fill' : 'line'} tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="partner-tools"
        options={{
          href: partnerTabActive ? '/partner-tools' : null,
          title: t('tabs.partner'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.ib.network" styleVariant={focused ? 'fill' : 'line'} tone={focused ? 'brand' : 'textDim'} />,
        }}
      />
      <Tabs.Screen name="portfolio" options={{ href: null }} />
      <Tabs.Screen name="account" options={{ href: null }} />
    </Tabs>
  );
}

function isDiscoverModuleId(value: unknown): value is DiscoverModuleId {
  return (
    value === 'challenge' ||
    value === 'education' ||
    value === 'community' ||
    value === 'profile' ||
    value === 'onboarding' ||
    value === 'partner' ||
    value === 'markets' ||
    value === 'accounts' ||
    value === 'support' ||
    value === 'rewards'
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
