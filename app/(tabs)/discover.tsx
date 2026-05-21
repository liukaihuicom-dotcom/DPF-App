import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { Card } from '@/src/components/Card';
import { NativePressable } from '@/src/components/NativePressable';
import { PhosphorIcon } from '@/src/components/PhosphorIcon';
import { Screen } from '@/src/components/Screen';
import { StatusPill } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import { dupoinInsights, dupoinQuickActions } from '@/src/domain/dupoinMvp';
import { formatPercent, localizeText } from '@/src/domain/format';
import { partnerMetrics } from '@/src/domain/mockData';
import type { DiscoverModuleId } from '@/src/domain/types';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

export default function DupoinDiscoverScreen() {
  const { locale, palette, setSelectedDiscoverModule, t } = useProductSettings();
  const openModule = (moduleId: DiscoverModuleId) => {
    setSelectedDiscoverModule(moduleId);
    void impactLight();
    router.replace('/quick' as never);
  };

  return (
    <Screen
      subtitle={locale === 'en-US' ? 'Copy trading, academy, and partner growth' : '跟单、学堂与 Partner 增长'}
      title={t('tabs.copy')}>
      <NativePressable
        accessibilityLabel={t('discover.module.profile.title')}
        minTouch={96}
        onPress={() => openModule('profile')}
        style={StyleSheet.flatten([styles.profileEntryCard, { backgroundColor: palette.panelHigh, borderColor: palette.line }])}>
        <View style={StyleSheet.flatten([styles.profileEntryIcon, { backgroundColor: `${palette.brand}12`, borderColor: `${palette.brand}55` }])}>
          <PhosphorIcon color={palette.brand} name="user-circle" size={22} />
        </View>
        <View style={styles.profileEntryBody}>
          <View style={styles.profileEntryTitleRow}>
            <AppText variant="subtitle">{t('discover.module.profile.title')}</AppText>
            <StatusPill compact label={t('discover.module.profile.short')} tone="brand" />
          </View>
          <AppText numberOfLines={2} tone="muted" variant="caption">
            {t('discover.module.profile.hint')}
          </AppText>
        </View>
        <View style={StyleSheet.flatten([styles.profileEntryArrow, { backgroundColor: palette.panelSoft }])}>
          <PhosphorIcon color={palette.textMuted} name="caret-right" size={15} />
        </View>
      </NativePressable>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <AppText variant="subtitle">{locale === 'en-US' ? 'Function entry' : '功能入口'}</AppText>
            <AppText tone="muted" variant="caption">
              {locale === 'en-US' ? 'Markets, trading, wallet, and learning shortcuts live here.' : '行情、交易、钱包和学习入口集中在这里。'}
            </AppText>
          </View>
        </View>
        <View style={styles.quickGrid}>
          {dupoinQuickActions.map((action) => (
            <NativePressable
              accessibilityLabel={localizeText(action.title, locale)}
              accessibilityRole="button"
              key={action.id}
              minTouch={76}
              onPress={() => router.push(action.route as never)}
              style={StyleSheet.flatten([styles.quickAction, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
              <View style={StyleSheet.flatten([styles.quickIcon, { backgroundColor: `${palette.brand}12` }])}>
                <PhosphorIcon color={palette.brand} name={action.icon} size={18} />
              </View>
              <View style={styles.quickText}>
                <AppText numberOfLines={1} variant="subtitle">
                  {localizeText(action.title, locale)}
                </AppText>
                <AppText numberOfLines={1} tone="muted" variant="caption">
                  {localizeText(action.subtitle, locale)}
                </AppText>
              </View>
            </NativePressable>
          ))}
        </View>
      </Card>

      <View style={styles.moduleGrid}>
        <ModuleCard
          body={locale === 'en-US' ? 'Short lessons for spread, leverage, margin call, and CFD order basics.' : '点差、杠杆、保证金追缴和 CFD 下单基础短课。'}
          icon="graduation-cap"
          onPress={() => openModule('education')}
          title={locale === 'en-US' ? 'Dupoin Academy' : 'Dupoin 学堂'}
        />
        <ModuleCard
          body={locale === 'en-US' ? 'Simulated leaderboard with weekly ROI, drawdown, and trade discipline.' : '按周展示模拟收益、回撤和交易纪律的挑战榜。'}
          icon="trophy"
          onPress={() => openModule('challenge')}
          title={locale === 'en-US' ? 'Demo challenge' : '模拟挑战赛'}
        />
        <ModuleCard
          body={locale === 'en-US' ? 'Help center, service status, and guided support for account setup.' : '帮助中心、服务状态和账户设置引导客服。'}
          icon="headphones"
          onPress={() => openModule('support')}
          title={locale === 'en-US' ? 'Support desk' : '客服中心'}
        />
        <ModuleCard
          body={locale === 'en-US' ? 'Risk acknowledgement stays visible before every simulated trade flow.' : '每条模拟交易路径都保留风险确认和提示。'}
          icon="shield-check"
          onPress={() => openModule('onboarding')}
          title={locale === 'en-US' ? 'Risk controls' : '风险控制'}
        />
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <AppText variant="subtitle">{locale === 'en-US' ? 'Partner preview' : 'Partner 预览'}</AppText>
            <AppText tone="muted" variant="caption">
              {locale === 'en-US' ? 'IB growth loop kept in the MVP for referrals.' : 'MVP 保留 IB 推荐增长闭环。'}
            </AppText>
          </View>
          <ActionButton
            label={t('tabs.partner')}
            onPress={() => openModule('partner')}
            style={styles.partnerButton}
            tone="neutral"
          />
        </View>
        <View style={styles.partnerStats}>
          <PartnerStat label={t('partner.monthClients')} value={String(partnerMetrics.clients)} />
          <PartnerStat label={t('partner.activeClients')} value={String(partnerMetrics.activeClients)} />
          <PartnerStat label={locale === 'en-US' ? 'Conversion' : '转化率'} value={formatPercent(partnerMetrics.conversionRate)} />
        </View>
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <AppText variant="subtitle">{locale === 'en-US' ? 'Market brief' : '市场简报'}</AppText>
            <AppText tone="muted" variant="caption">
              {locale === 'en-US' ? 'Editorial cards ready for a future CMS feed.' : '为后续 CMS 资讯流预留的编辑卡片。'}
            </AppText>
          </View>
        </View>
        <View style={styles.newsList}>
          {dupoinInsights.map((insight) => (
            <View key={insight.id} style={StyleSheet.flatten([styles.newsRow, { borderTopColor: palette.lineSoft }])}>
              <View style={styles.newsText}>
                <AppText tone="brand" variant="eyebrow">
                  {localizeText(insight.category, locale)}
                </AppText>
                <AppText variant="subtitle">{localizeText(insight.title, locale)}</AppText>
                <AppText tone="muted" variant="caption">
                  {localizeText(insight.body, locale)}
                </AppText>
              </View>
              <AppText tone="dim" variant="caption">
                {localizeText(insight.time, locale)}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

function ModuleCard({
  body,
  icon,
  onPress,
  title,
}: {
  body: string;
  icon: 'graduation-cap' | 'trophy' | 'headphones' | 'shield-check';
  onPress: () => void;
  title: string;
}) {
  const { palette } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={title}
      minTouch={142}
      onPress={onPress}
      style={StyleSheet.flatten([styles.moduleCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <View style={StyleSheet.flatten([styles.moduleIcon, { backgroundColor: `${palette.brand}12` }])}>
        <PhosphorIcon color={palette.brand} name={icon} size={18} />
      </View>
      <AppText numberOfLines={1} variant="subtitle">
        {title}
      </AppText>
      <AppText numberOfLines={3} tone="muted" variant="caption">
        {body}
      </AppText>
    </NativePressable>
  );
}

function PartnerStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.partnerStat}>
      <AppText adjustsFontSizeToFit numberOfLines={1} variant="number">
        {value}
      </AppText>
      <AppText numberOfLines={1} tone="muted" variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  moduleCard: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 7,
    minHeight: 142,
    padding: 13,
    width: '48.6%',
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  moduleIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  newsList: {
    gap: 2,
  },
  newsRow: {
    alignItems: 'flex-start',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
  },
  newsText: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  partnerButton: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  partnerStat: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  partnerStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  profileEntryArrow: {
    alignItems: 'center',
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  profileEntryBody: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  profileEntryCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  profileEntryIcon: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  profileEntryTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  quickAction: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 72,
    padding: 12,
    width: '48.6%',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 14,
  },
  quickIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  quickText: {
    flex: 1,
    minWidth: 0,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
});
