import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon } from '@/src/components/AppIcon';
import { AppIconFrame } from '@/src/components/AppIconFrame';
import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import { getDiscoverEntryById, type DiscoverEntryDefinition, type DiscoverEntryStatus } from '@/src/domain/discoverEntries';
import { localizeText } from '@/src/domain/format';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, spacing } from '@/src/theme/tokens';

export default function DiscoverEntryScreen({ entryId }: { entryId?: string } = {}) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale, colors } = useProductSettings();
  const entry = getDiscoverEntryById(entryId ?? id ?? '');

  if (!entry) {
    return (
      <Screen back title={locale !== 'zh-CN' ? 'Entry unavailable' : '入口不可用'}>
        <Card>
          <AppText variant="subtitle">{locale !== 'zh-CN' ? 'This entry is not configured.' : '该入口尚未配置。'}</AppText>
          <AppText tone="muted" variant="caption">
            {locale !== 'zh-CN' ? 'Return to Discover and choose another function entry.' : '请返回发现页选择其他功能入口。'}
          </AppText>
        </Card>
      </Screen>
    );
  }

  const textLocale = locale !== 'zh-CN' ? 'en-US' : 'zh-CN';
  const details = getEntryDetails(entry, textLocale);

  return (
    <Screen back title={localizeText(entry.title, locale)}>
      <Card highlight>
        <View style={styles.heroTop}>
          <AppIconFrame name={entry.icon} size={48} iconSizeVariant="md" />
          <View style={styles.flex}>
            <View style={styles.titleRow}>
              <AppText numberOfLines={1} variant="subtitle">
                {localizeText(entry.title, locale)}
              </AppText>
              <EntryStatusPill status={entry.status} />
            </View>
            <AppText numberOfLines={3} tone="muted" variant="caption">
              {localizeText(entry.subtitle, locale)}
            </AppText>
          </View>
        </View>
      </Card>

      <Card compact style={styles.detailCard}>
        {details.map((item, index) => (
          <View key={item.label} style={StyleSheet.flatten([styles.detailRow, index < details.length - 1 && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
            <AppText tone="muted" variant="caption">
              {item.label}
            </AppText>
            <AppText numberOfLines={3} variant="body">
              {item.value}
            </AppText>
          </View>
        ))}
      </Card>

      <Card>
        <AppText variant="subtitle">{locale !== 'zh-CN' ? 'Production note' : '生产说明'}</AppText>
        <AppText tone="muted" variant="caption">
          {locale === 'en-US'
            ? 'This page is a local product preview. It does not connect live trading, funding, KYC, support, rewards, or CMS services.'
            : '该页面是本地产品预览，未接入真实交易、资金、KYC、客服、奖励或 CMS 服务。'}
        </AppText>
        <ActionButton label={locale !== 'zh-CN' ? 'Back to Discover' : '返回发现'} onPress={() => router.push('/discover' as never)} style={styles.action} tone="neutral" />
      </Card>
    </Screen>
  );
}

function EntryStatusPill({ status }: { status: DiscoverEntryStatus }) {
  const { locale } = useProductSettings();
  const labelByStatus: Record<DiscoverEntryStatus, { label: string; tone: StatusPillTone }> = {
    demo: { label: locale !== 'zh-CN' ? 'Demo' : '演示', tone: 'neutral' },
    placeholder: { label: locale !== 'zh-CN' ? 'Preview' : '预览', tone: 'warning' },
    ready: { label: locale !== 'zh-CN' ? 'Ready' : '可用', tone: 'brand' },
  };
  const statusConfig = labelByStatus[status];

  return <StatusPill compact label={statusConfig.label} tone={statusConfig.tone} />;
}

function getEntryDetails(entry: DiscoverEntryDefinition, locale: 'en-US' | 'zh-CN') {
  const common = [
    {
      label: locale !== 'zh-CN' ? 'Entry type' : '入口类型',
      value: statusText(entry.status, locale),
    },
    {
      label: locale !== 'zh-CN' ? 'Host tab' : '承载标签',
      value: locale !== 'zh-CN' ? 'Rightmost bottom tab' : '底部导航最右侧',
    },
  ];

  const detailById: Record<string, string> = {
    academy: locale !== 'zh-CN' ? 'Future CMS lessons should cover spreads, leverage, margin calls, and CFD risk basics.' : '后续 CMS 课程应覆盖点差、杠杆、保证金追缴和 CFD 风险基础。',
    challenge: locale !== 'zh-CN' ? 'Challenge rankings must remain virtual until real contest, reward, and risk rules are approved.' : '挑战赛榜单在真实活动、奖励和风控规则确认前仅展示虚拟数据。',
    community: locale !== 'zh-CN' ? 'Community and signal content requires moderation, risk labeling, and source controls before production.' : '社区和信号内容上线前需要审核、风险标识和来源治理。',
    identity: locale !== 'zh-CN' ? 'Identity verification requires a KYC provider, document policy, privacy controls, and compliance approval.' : '身份认证需要 KYC 服务商、证件规则、隐私控制和合规审批。',
    referral: locale !== 'zh-CN' ? 'Referral tools require Partner permission, tracking, commission rules, and anti-misrepresentation controls.' : '推荐工具需要 Partner 权限、追踪、返佣规则和防误导控制。',
    rewards: locale !== 'zh-CN' ? 'Rewards must not imply guaranteed trading outcomes and require a clear reward ledger.' : '奖励不得暗示交易结果保证，并需要清晰的奖励台账。',
    risk: locale !== 'zh-CN' ? 'Risk copy must stay visible and conservative for leverage, margin, and CFD workflows.' : '杠杆、保证金和 CFD 流程中的风险文案必须保持可见且审慎。',
    support: locale !== 'zh-CN' ? 'Support center requires ticket, notification, and service status integrations before live use.' : '客服中心上线前需要工单、通知和服务状态集成。',
    videoVerify: locale !== 'zh-CN' ? 'Video verification requires review workflow, retention rules, and privacy approval.' : '视频认证需要审核流程、留存规则和隐私审批。',
  };

  return [
    {
      label: locale !== 'zh-CN' ? 'Purpose' : '用途',
      value: detailById[entry.id] ?? localizeText(entry.subtitle, locale),
    },
    ...common,
  ];
}

function statusText(status: DiscoverEntryStatus, locale: 'en-US' | 'zh-CN') {
  if (status === 'ready') {
    return locale !== 'zh-CN' ? 'Connected to an existing local page.' : '已连接到现有本地页面。';
  }

  if (status === 'demo') {
    return locale !== 'zh-CN' ? 'Demo flow. Live services are not connected.' : '演示流程，未接入真实服务。';
  }

  return locale !== 'zh-CN' ? 'Preview placeholder for a future independent page.' : '未来独立页面的预览占位。';
}

const styles = StyleSheet.create({
  action: {
    marginTop: spacing.md,
  },
  detailCard: {
    gap: spacing.none,
    paddingVertical: spacing.none,
  },
  detailRow: {
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
});
