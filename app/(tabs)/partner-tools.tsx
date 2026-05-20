import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import type { DiscoverModuleId } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

export default function PartnerToolsScreen() {
  const { palette, role, selectedDiscoverModuleId, setSelectedDiscoverModule, t } = useProductSettings();
  const toast = useToast();
  const tiles: DiscoverTile[] = [
    { color: palette.amber, group: 'growth', icon: 'trophy', id: 'challenge' },
    { color: palette.brand, group: 'growth', icon: 'graduation-cap', id: 'education' },
    { color: palette.textMuted, group: 'growth', icon: 'comments', id: 'community' },
    { color: palette.text, group: 'account', href: '/accounts', icon: 'user-circle-o', id: 'profile' },
    { color: palette.down, group: 'account', href: '/auth', icon: 'id-card-o', id: 'onboarding' },
    { color: palette.brand, group: 'account', href: role === 'partner' ? '/trade' : '/accounts', icon: 'share-alt', id: 'partner' },
    { color: palette.up, group: 'trading', href: '/markets', icon: 'line-chart', id: 'markets' },
    { color: palette.blue, group: 'trading', href: '/accounts', icon: 'user-o', id: 'accounts' },
    { color: palette.textMuted, group: 'service', icon: 'headphones', id: 'support' },
    { color: palette.amber, group: 'service', icon: 'gift', id: 'rewards' },
  ];
  const selectedTile = tiles.find((tile) => tile.id === selectedDiscoverModuleId) ?? tiles[0];

  return (
    <Screen subtitle={t('discover.subtitle')} title={t('discover.title')}>
      <Card highlight>
        <View style={styles.menuHero}>
          <View style={styles.copyBlock}>
            <AppText tone="dim" variant="eyebrow">
              {t('discover.menuEyebrow')}
            </AppText>
            <AppText variant="subtitle">{t('discover.menuTitle')}</AppText>
            <AppText tone="muted" variant="caption">
              {t('discover.menuHint')}
            </AppText>
          </View>
          <View style={StyleSheet.flatten([styles.statusBadge, { backgroundColor: `${palette.brand}12`, borderColor: palette.brand }])}>
            <AppText tone="brand" variant="caption">
              {t(`discover.module.${selectedDiscoverModuleId}.short`)}
            </AppText>
          </View>
        </View>
      </Card>

      <Card compact>
        <View style={styles.selectedSummary}>
          <View style={styles.copyBlock}>
            <AppText tone="dim" variant="eyebrow">
              {t('discover.statusEntry')}
            </AppText>
            <AppText variant="subtitle">{t(`discover.module.${selectedDiscoverModuleId}.title`)}</AppText>
            <AppText numberOfLines={2} tone="muted" variant="caption">
              {t('discover.selected')}
            </AppText>
          </View>
          <View style={StyleSheet.flatten([styles.statusPreview, { backgroundColor: `${palette.brand}12`, borderColor: `${palette.brand}66` }])}>
            <FontAwesome color={palette.brand} name={selectedTile.icon} size={16} />
            <AppText tone="brand" variant="caption">
              {t(`discover.module.${selectedDiscoverModuleId}.short`)}
            </AppText>
          </View>
        </View>
      </Card>

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('discover.functionCenter')}</AppText>
        <AppText tone="dim" variant="caption">
          {role === 'partner' ? t('role.partner') : t('role.trader')}
        </AppText>
      </View>

      {(['growth', 'account', 'trading', 'service'] as DiscoverTileGroup[]).map((group) => (
        <View key={group} style={styles.groupBlock}>
          <View style={styles.groupTitle}>
            <AppText tone="dim" variant="eyebrow">
              {t(`discover.group.${group}`)}
            </AppText>
          </View>
          <View style={styles.tileGrid}>
            {tiles
              .filter((tile) => tile.group === group)
              .map((tile) => (
                <DiscoverSelectableTile
                  key={tile.id}
                  onPress={() => {
                    setSelectedDiscoverModule(tile.id);
                    void impactLight();

                    if (tile.href) {
                      router.push(tile.href);
                    } else {
                      toast.show({ message: t('discover.module.pendingHint'), title: t(`discover.module.${tile.id}.title`) });
                    }
                  }}
                  selected={selectedDiscoverModuleId === tile.id}
                  tile={tile}
                />
              ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}

type DiscoverTileGroup = 'growth' | 'account' | 'trading' | 'service';

type DiscoverTile = {
  color: string;
  group: DiscoverTileGroup;
  href?: Href;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  id: DiscoverModuleId;
};

function DiscoverSelectableTile({ onPress, selected, tile }: { onPress: () => void; selected: boolean; tile: DiscoverTile }) {
  const { palette, t } = useProductSettings();

  return (
    <NativePressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      minTouch={88}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.selectableTile,
        {
          backgroundColor: palette.panel,
          borderColor: selected ? palette.brand : palette.lineSoft,
        },
      ])}>
      <View style={styles.tileHead}>
        <View
          style={StyleSheet.flatten([
            styles.tileIcon,
            {
              backgroundColor: selected ? `${palette.brand}12` : `${tile.color}12`,
              borderColor: selected ? palette.brand : `${tile.color}55`,
            },
          ])}>
          <FontAwesome color={selected ? palette.brand : tile.color} name={tile.icon} size={18} />
        </View>
        <View style={StyleSheet.flatten([styles.selectedDot, { backgroundColor: selected ? palette.brand : palette.lineSoft }])} />
      </View>
      <AppText numberOfLines={1} variant="subtitle">
        {t(`discover.module.${tile.id}.title`)}
      </AppText>
      <AppText numberOfLines={3} tone="muted" variant="caption">
        {t(`discover.module.${tile.id}.hint`)}
      </AppText>
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  copyBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  tileHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tileIcon: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  selectableTile: {
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: '30.5%',
    flexGrow: 1,
    gap: 8,
    minHeight: 118,
    minWidth: 104,
    padding: 10,
  },
  selectedDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  selectedSummary: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  statusPreview: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    gap: 5,
    minWidth: 72,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  menuHero: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  groupBlock: {
    gap: 8,
  },
  groupTitle: {
    paddingLeft: 2,
  },
});
