import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { InstrumentRow } from '@/src/components/InstrumentRow';
import { Metric } from '@/src/components/Metric';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import { formatCompactMoney, formatMoney, formatPercent, formatPrice, formatVolumeMillions, localizeText } from '@/src/domain/format';
import { partnerMetrics } from '@/src/domain/mockData';
import { getDisplayChange } from '@/src/domain/trading';
import type { AuthStatus } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function HomeScreen() {
  const { account, instruments, positions, role } = useBroker();
  const { authStatus, locale, palette, t } = useProductSettings();
  const toast = useToast();

  if (role === 'partner') {
    return <PartnerDashboard />;
  }

  const requireSignedIn = (mode: 'partner' | 'trader') => {
    if (authStatus === 'signedIn') {
      return true;
    }

    void notifyWarning();
    toast.show({
      message: t(mode === 'partner' ? 'auth.partnerLocked' : 'auth.traderLocked'),
      title: t('auth.lockedToastTitle'),
      tone: 'warning',
    });
    return false;
  };

  const favoriteInstruments = instruments.filter((instrument) => instrument.favorite);
  const topMovers = [...instruments].sort((a, b) => Math.abs(getDisplayChange(b).changePercent) - Math.abs(getDisplayChange(a).changePercent));
  const anchorInstrument = instruments.find((instrument) => instrument.symbol === 'EUR/USD') ?? instruments[0];
  const anchorChange = getDisplayChange(anchorInstrument);
  const anchorPositive = anchorChange.changePercent >= 0;
  const bidDepth = [0, 1, 2].map((step) => ({
    price: anchorInstrument.bid - step * anchorInstrument.pipSize * 2,
    size: [2.8, 1.9, 1.2][step],
  }));
  const askDepth = [0, 1, 2].map((step) => ({
    price: anchorInstrument.ask + step * anchorInstrument.pipSize * 2,
    size: [2.4, 1.7, 1.1][step],
  }));
  const missions = [
    [t('home.mission.paper'), 100],
    [t('home.mission.watchlist'), 72],
    [t('home.mission.riskLesson'), 54],
    [t('home.mission.firstOrder'), 38],
  ] as const;

  return (
    <Screen subtitle={t('home.riskSubtitle')} title={t('home.traderTitle')}>
      <AuthStatusCard mode="trader" status={authStatus} />

      <View style={StyleSheet.flatten([styles.searchBar, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
        <FontAwesome color={palette.textDim} name="search" size={14} />
        <AppText numberOfLines={1} tone="dim" variant="caption">
          {locale === 'en-US' ? 'Search FX, metals, indices' : '搜索外汇、黄金、指数'}
        </AppText>
      </View>

      <Card highlight style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.copyBlock}>
            <AppText tone="dim" variant="eyebrow">
              {locale === 'en-US' ? 'Demo wallet' : '模拟钱包'}
            </AppText>
            <AppText adjustsFontSizeToFit numberOfLines={1} variant="largeNumber">
              {formatMoney(account.equity, account.currency, 2, locale)}
            </AppText>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {t('account.availableMargin')} {formatCompactMoney(account.freeMargin, account.currency, locale)} · {t('home.positions')} {positions.length}
            </AppText>
          </View>
          <View style={StyleSheet.flatten([styles.brandChip, { backgroundColor: `${palette.brand}18`, borderColor: palette.brand }])}>
            <FontAwesome color={palette.brand} name="bolt" size={12} />
            <AppText tone="brand" variant="caption">
              {locale === 'en-US' ? 'Paper' : '模拟'}
            </AppText>
          </View>
        </View>

        <View style={StyleSheet.flatten([styles.anchorQuote, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
          <View style={styles.copyBlock}>
            <AppText variant="subtitle">{anchorInstrument.symbol}</AppText>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {localizeText(anchorInstrument.name, locale)}
            </AppText>
          </View>
          <View style={styles.quoteRight}>
            <AppText tone={anchorPositive ? 'up' : 'down'} variant="number">
              {formatPrice(anchorInstrument, anchorInstrument.ask)}
            </AppText>
            <AppText tone={anchorPositive ? 'up' : 'down'} variant="caption">
              {formatPercent(anchorChange.changePercent)}
            </AppText>
          </View>
        </View>

        <View style={styles.tradeButtons}>
          <NativePressable
            accessibilityRole="button"
            onPress={() => {
              if (requireSignedIn('trader')) {
                void impactLight();
                router.push(`/order/${anchorInstrument.id}?direction=buy`);
              }
            }}
            style={StyleSheet.flatten([
              styles.tradeButton,
              { backgroundColor: authStatus === 'signedIn' ? palette.up : palette.line },
            ])}>
            <AppText style={{ color: palette.panel }} variant="subtitle">
              {t('common.buy')}
            </AppText>
          </NativePressable>
          <NativePressable
            accessibilityRole="button"
            onPress={() => {
              if (requireSignedIn('trader')) {
                void impactLight();
                router.push(`/order/${anchorInstrument.id}?direction=sell`);
              }
            }}
            style={StyleSheet.flatten([
              styles.tradeButton,
              { backgroundColor: authStatus === 'signedIn' ? palette.down : palette.line },
            ])}>
            <AppText style={{ color: palette.panel }} variant="subtitle">
              {t('common.sell')}
            </AppText>
          </NativePressable>
        </View>
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.copyBlock}>
            <AppText variant="subtitle">{t('home.mission.title')}</AppText>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {t('home.mission.subtitle')}
            </AppText>
          </View>
          <View style={StyleSheet.flatten([styles.rewardBadge, { backgroundColor: `${palette.brand}14`, borderColor: palette.brand }])}>
            <AppText tone="brand" variant="caption">
              {t('home.mission.reward')}
            </AppText>
          </View>
        </View>
        <View style={styles.missionRail}>
          {missions.map(([label, progress], index) => (
            <View
              key={label}
              style={StyleSheet.flatten([
                styles.missionPill,
                { backgroundColor: index === 0 ? palette.text : palette.panelSoft, borderColor: index === 0 ? palette.text : palette.lineSoft },
              ])}>
              <View style={StyleSheet.flatten([styles.stepDot, { backgroundColor: index === 0 ? palette.brand : palette.panel, borderColor: index === 0 ? palette.brand : palette.line }])}>
                <AppText style={index === 0 && { color: palette.text }} variant="caption">
                  {index + 1}
                </AppText>
              </View>
              <View style={styles.copyBlock}>
                <AppText numberOfLines={1} style={index === 0 && { color: palette.panel }} variant="caption">
                  {label}
                </AppText>
                <View style={StyleSheet.flatten([styles.progressTrack, { backgroundColor: index === 0 ? `${palette.panel}33` : palette.lineSoft }])}>
                  <View style={StyleSheet.flatten([styles.progressFill, { backgroundColor: index === 0 ? palette.brand : palette.brand, width: `${progress}%` }])} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.quickGrid}>
        {([
          [t('home.action.depth'), t('home.action.depthHint'), 'th-list', palette.text],
          [t('home.action.paper'), t('home.action.paperHint'), 'trophy', palette.brand],
          [t('home.action.learn'), t('home.action.learnHint'), 'graduation-cap', palette.amber],
          [t('home.action.community'), t('home.action.communityHint'), 'comments', palette.textMuted],
        ] as const).map(([label, hint, icon, color]) => (
          <NativePressable
            accessibilityRole="button"
            key={label}
            onPress={() => router.push('/partner-tools')}
            style={StyleSheet.flatten([styles.quickTile, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
            <View style={StyleSheet.flatten([styles.actionIcon, { backgroundColor: `${color}14`, borderColor: `${color}66` }])}>
              <FontAwesome color={color} name={icon as React.ComponentProps<typeof FontAwesome>['name']} size={15} />
            </View>
            <View style={styles.copyBlock}>
              <AppText numberOfLines={1} variant="body">
                {label}
              </AppText>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {hint}
              </AppText>
            </View>
          </NativePressable>
        ))}
      </View>

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('home.favoriteMarkets')}</AppText>
        <AppText tone="dim" variant="caption">
          {t('home.watchlistCaption')}
        </AppText>
      </View>
      <Card compact>
        <View style={styles.marketHeader}>
          <AppText tone="dim" variant="caption">
            {locale === 'en-US' ? 'Symbol' : '品种'}
          </AppText>
          <AppText tone="dim" variant="caption">
            Bid / Ask
          </AppText>
          <AppText tone="dim" variant="caption">
            %
          </AppText>
        </View>
        {favoriteInstruments.map((instrument) => (
          <InstrumentRow instrument={instrument} key={instrument.id} />
        ))}
      </Card>

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('home.topMovers')}</AppText>
        <AppText tone="dim" variant="caption">
          {t('home.moversCaption')}
        </AppText>
      </View>
      <Card compact>
        {topMovers.slice(0, 4).map((instrument) => (
          <InstrumentRow instrument={instrument} key={instrument.id} />
        ))}
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <AppText variant="subtitle">{t('home.depthTitle')}</AppText>
            <AppText tone="muted" variant="caption">
              {anchorInstrument.symbol} · {t('home.depthSubtitle')}
            </AppText>
          </View>
        </View>
        <View style={styles.depthBook}>
          <DepthSide color={palette.down} instrument={anchorInstrument} label={t('home.depthBid')} levels={bidDepth} />
          <DepthSide color={palette.up} instrument={anchorInstrument} label={t('home.depthAsk')} levels={askDepth} />
        </View>
        <Link asChild href={`/instrument/${anchorInstrument.id}`}>
          <NativePressable
            accessibilityRole="button"
            onPress={(event) => {
              if (!requireSignedIn('trader')) {
                event.preventDefault();
              }
            }}
            style={StyleSheet.flatten([
              styles.blackCta,
              { backgroundColor: authStatus === 'signedIn' ? palette.text : palette.line },
            ])}>
            <AppText style={{ color: palette.panel }} variant="body">
              {authStatus === 'signedIn' ? t('home.convertCta') : t('auth.action.continue')}
            </AppText>
            <FontAwesome color={palette.panel} name="angle-right" size={18} />
          </NativePressable>
        </Link>
      </Card>
    </Screen>
  );
}

function PartnerDashboard() {
  const { authStatus, locale, palette, t } = useProductSettings();
  const toast = useToast();
  const requireSignedIn = () => {
    if (authStatus === 'signedIn') {
      return true;
    }

    void notifyWarning();
    toast.show({
      message: t('auth.partnerLocked'),
      title: t('auth.lockedToastTitle'),
      tone: 'warning',
    });
    return false;
  };
  const funnel = [
    [t('partner.funnel.visit'), 430],
    [t('partner.funnel.submitted'), 214],
    [t('partner.funnel.funded'), 136],
    [t('partner.funnel.active'), 74],
  ] as const;

  return (
    <Screen subtitle={t('partner.dashboardSubtitle')} title={t('partner.dashboardTitle')}>
      <AuthStatusCard mode="partner" status={authStatus} />

      <Card highlight style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.copyBlock}>
            <AppText tone="dim" variant="eyebrow">
              {t('partner.referralCode')}
            </AppText>
            <AppText numberOfLines={1} variant="title">
              {partnerMetrics.referralCode}
            </AppText>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {partnerMetrics.referralLink}
            </AppText>
          </View>
          <View style={StyleSheet.flatten([styles.qrBox, { backgroundColor: palette.text }])}>
            <FontAwesome color={palette.panel} name="qrcode" size={24} />
          </View>
        </View>
        <NativePressable
          accessibilityRole="button"
          onPress={() => {
            if (requireSignedIn()) {
              void impactLight();
              router.push('/partner-tools');
            }
          }}
          style={StyleSheet.flatten([
            styles.blackCta,
            { backgroundColor: authStatus === 'signedIn' ? palette.text : palette.line },
          ])}>
          <AppText style={{ color: palette.panel }} variant="body">
            {authStatus === 'signedIn' ? (locale === 'en-US' ? 'Open growth toolkit' : '打开推广工具') : t('auth.action.continue')}
          </AppText>
          <FontAwesome color={palette.panel} name="angle-right" size={18} />
        </NativePressable>
      </Card>

      <View style={styles.metricStrip}>
        <MetricCard label={t('partner.monthClients')} value={`${partnerMetrics.clients}`} />
        <MetricCard label={t('partner.monthVolume')} value={formatVolumeMillions(partnerMetrics.monthlyVolume, locale)} />
        <MetricCard label={t('partner.pendingCommission')} value={formatCompactMoney(partnerMetrics.pendingCommission, 'USD', locale)} />
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.copyBlock}>
            <AppText variant="subtitle">{t('partner.funnel')}</AppText>
            <AppText tone="muted" variant="caption">
              {locale === 'en-US' ? 'Visits to first active demo trade' : '从访问开户链接到首笔模拟交易'}
            </AppText>
          </View>
          <AppText tone="brand" variant="number">
            {partnerMetrics.conversionRate.toFixed(1)}%
          </AppText>
        </View>
        {funnel.map(([label, value], index) => (
          <View key={label} style={styles.funnelRow}>
            <View style={StyleSheet.flatten([styles.stepDot, { backgroundColor: index < 2 ? palette.text : `${palette.brand}18`, borderColor: index < 2 ? palette.text : palette.brand }])}>
              <AppText style={{ color: index < 2 ? palette.panel : palette.brand }} variant="caption">
                {index + 1}
              </AppText>
            </View>
            <View style={styles.copyBlock}>
              <View style={styles.progressLabel}>
                <AppText numberOfLines={1} variant="caption">
                  {label}
                </AppText>
                <AppText tone="muted" variant="caption">
                  {value}
                </AppText>
              </View>
              <View style={StyleSheet.flatten([styles.progressTrack, { backgroundColor: palette.panelSoft }])}>
                <View style={StyleSheet.flatten([styles.progressFill, { backgroundColor: index < 2 ? palette.text : palette.brand, width: `${(value / 430) * 100}%` }])} />
              </View>
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.copyBlock}>
            <AppText variant="subtitle">{t('partner.nextAction')}</AppText>
            <AppText numberOfLines={2} tone="muted" variant="caption">
              {t('partner.nextActionHint')}
            </AppText>
          </View>
        </View>
        <View style={styles.partnerTasks}>
          {([
            [t('partner.convert.invite'), 'share-alt', 100],
            [t('partner.convert.activate'), 'check-circle', 66],
            [t('partner.convert.deposit'), 'bank', 42],
            [t('partner.convert.trade'), 'line-chart', 31],
          ] as const).map(([label, icon, progress]) => (
            <View key={label} style={StyleSheet.flatten([styles.partnerTask, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
              <FontAwesome color={palette.brand} name={icon as React.ComponentProps<typeof FontAwesome>['name']} size={15} />
              <AppText numberOfLines={1} variant="caption">
                {label}
              </AppText>
              <AppText tone="dim" variant="caption">
                {progress}%
              </AppText>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

function AuthStatusCard({ mode, status }: { mode: 'trader' | 'partner'; status: AuthStatus }) {
  const { palette, t } = useProductSettings();
  const signedIn = status === 'signedIn';
  const progress: Record<AuthStatus, number> = {
    guest: 12,
    signedIn: 100,
  };
  const icon: Record<AuthStatus, React.ComponentProps<typeof FontAwesome>['name']> = {
    guest: 'globe',
    signedIn: 'check-circle',
  };

  return (
    <Card style={signedIn ? styles.authCompactCard : styles.authCard}>
      <View style={styles.authRow}>
        <View style={StyleSheet.flatten([styles.authMark, { backgroundColor: signedIn ? `${palette.brand}18` : palette.text, borderColor: signedIn ? palette.brand : palette.text }])}>
          <FontAwesome color={signedIn ? palette.brand : palette.panel} name={icon[status]} size={18} />
        </View>
        <View style={styles.copyBlock}>
          <AppText variant="subtitle">{t(`auth.card.${status}.title`)}</AppText>
          <AppText numberOfLines={2} tone="muted" variant="caption">
            {signedIn ? t(`auth.card.${status}.body`) : mode === 'partner' ? t('auth.partnerLocked') : t('auth.traderLocked')}
          </AppText>
        </View>
      </View>
      {!signedIn ? (
        <>
          <View style={StyleSheet.flatten([styles.emailFieldPreview, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
            <AppText tone="muted" variant="caption">
              {t('auth.emailPlaceholder')}
            </AppText>
          </View>
          <View style={StyleSheet.flatten([styles.authProgressTrack, { backgroundColor: palette.panelSoft }])}>
            <View style={StyleSheet.flatten([styles.authProgressFill, { backgroundColor: palette.brand, width: `${progress[status]}%` }])} />
          </View>
          <NativePressable
            accessibilityRole="button"
            onPress={() => router.push('/auth')}
            style={StyleSheet.flatten([styles.blackCta, { backgroundColor: palette.text }])}>
            <AppText style={{ color: palette.panel }} variant="body">
              {t('auth.action.register')}
            </AppText>
            <FontAwesome color={palette.panel} name="angle-right" size={18} />
          </NativePressable>
        </>
      ) : null}
    </Card>
  );
}

function DepthSide({
  color,
  instrument,
  label,
  levels,
}: {
  color: string;
  instrument: ReturnType<typeof useBroker>['instruments'][number];
  label: string;
  levels: { price: number; size: number }[];
}) {
  return (
    <View style={styles.depthSide}>
      <AppText style={{ color }} variant="caption">
        {label}
      </AppText>
      {levels.map((level) => (
        <View key={level.price} style={styles.depthRow}>
          <AppText style={{ color }} variant="caption">
            {formatPrice(instrument, level.price)}
          </AppText>
          <View style={StyleSheet.flatten([styles.depthTrack, { backgroundColor: `${color}16` }])}>
            <View style={StyleSheet.flatten([styles.depthFill, { backgroundColor: color, width: `${level.size * 28}%` }])} />
          </View>
          <AppText tone="muted" variant="caption">
            {level.size.toFixed(1)}M
          </AppText>
        </View>
      ))}
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  const { palette } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.metricCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <Metric label={label} value={value} />
    </View>
  );
}

const styles = StyleSheet.create({
  actionIcon: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  authCard: {
    gap: 12,
  },
  authCompactCard: {
    gap: 0,
    paddingVertical: 12,
  },
  authMark: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  authProgressFill: {
    borderRadius: 999,
    height: 7,
  },
  authProgressTrack: {
    borderRadius: 999,
    height: 7,
    overflow: 'hidden',
  },
  authRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  anchorQuote: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  blackCta: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  brandChip: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  copyBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  depthBook: {
    flexDirection: 'row',
    gap: 12,
  },
  depthFill: {
    borderRadius: 999,
    height: 7,
  },
  depthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 25,
  },
  depthSide: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  depthTrack: {
    borderRadius: 999,
    flex: 1,
    height: 7,
    overflow: 'hidden',
  },
  emailFieldPreview: {
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 12,
  },
  funnelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    minHeight: 42,
  },
  heroCard: {
    gap: 14,
  },
  heroTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  marketHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  metricCard: {
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: 96,
    padding: 10,
  },
  metricStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  missionPill: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  missionRail: {
    gap: 8,
  },
  partnerTask: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 5,
    minWidth: 72,
    padding: 10,
  },
  partnerTasks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pressed: {
    opacity: 0.72,
  },
  progressFill: {
    borderRadius: 999,
    height: 6,
  },
  progressLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  progressTrack: {
    borderRadius: 999,
    height: 6,
    overflow: 'hidden',
  },
  qrBox: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickTile: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '48%',
    flexDirection: 'row',
    flexGrow: 1,
    gap: 10,
    minHeight: 58,
    padding: 10,
  },
  quoteRight: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  rewardBadge: {
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: 148,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchBar: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 14,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 2,
  },
  stepDot: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  tradeButton: {
    alignItems: 'center',
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  tradeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});
