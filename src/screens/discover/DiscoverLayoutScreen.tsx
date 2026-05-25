import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon, type IconTone } from '@/src/components/AppIcon';
import { AppIconFrame } from '@/src/components/AppIconFrame';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import {
  getDiscoverLayoutWidgetById,
  type DiscoverLayoutItem,
  type DiscoverLayoutViewMode,
  type DiscoverLayoutWidget,
} from '@/src/domain/discoverLayout';
import type { DiscoverCampaignDefinition, DiscoverEntryDefinition } from '@/src/domain/discoverEntries';
import { localizeText } from '@/src/domain/format';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { shadows, type ThemeColors } from '@/src/theme/colors';
import { lineWidth, radius, spacing } from '@/src/theme/tokens';

const DRAG_ROW_HEIGHT = 176;
const menuViewModes: DiscoverLayoutViewMode[] = ['largeCard', 'smallCard', 'largeList', 'smallList'];

export default function DiscoverLayoutScreen() {
  const { discoverLayoutItems, locale, colors, role, setDiscoverLayoutItems } = useProductSettings();
  const [draftItems, setDraftItems] = useState<DiscoverLayoutItem[]>(discoverLayoutItems);
  const [expandedItemId, setExpandedItemId] = useState<DiscoverLayoutItem['id'] | null>(null);
  const visibleItems = draftItems
    .map((item) => {
      const widget = getDiscoverLayoutWidgetById(item.id);
      return widget ? { item, widget } : null;
    })
    .filter((item): item is { item: DiscoverLayoutItem; widget: DiscoverLayoutWidget } => Boolean(item))
    .filter(({ widget }) => widget.definition.roles.includes(role) || widget.definition.roles.includes('guest'));
  const modeLabels = getModeLabels(locale);
  const title = locale !== 'zh-CN' ? 'Layout settings' : '布局设置';
  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/discover');
  };
  const save = () => {
    setDiscoverLayoutItems(draftItems);
    void impactLight();
    router.replace('/discover');
  };
  const moveItem = (fromVisibleIndex: number, toVisibleIndex: number) => {
    if (fromVisibleIndex === toVisibleIndex || toVisibleIndex < 0 || toVisibleIndex >= visibleItems.length) {
      return;
    }

    const fromId = visibleItems[fromVisibleIndex]?.item.id;
    const toId = visibleItems[toVisibleIndex]?.item.id;
    if (!fromId || !toId) {
      return;
    }

    setDraftItems((current) => {
      const next = [...current];
      const fromIndex = next.findIndex((item) => item.id === fromId);
      const toIndex = next.findIndex((item) => item.id === toId);
      if (fromIndex < 0 || toIndex < 0) {
        return current;
      }
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    void impactLight();
  };
  const updateViewMode = (id: DiscoverLayoutItem['id'], viewMode: DiscoverLayoutViewMode) => {
    setDraftItems((current) => current.map((item) => (item.id === id ? { ...item, viewMode } : item)));
    void impactLight();
  };
  const toggleSettings = (id: DiscoverLayoutItem['id']) => {
    setExpandedItemId((current) => (current === id ? null : id));
    void impactLight();
  };

  return (
    <Screen
      contentInsetBottom={18}
      stickyFooterBackground="page"
      stickyFooter={
        <View style={styles.footerActions}>
          <ActionButton label={locale !== 'zh-CN' ? 'Cancel' : '取消'} onPress={close} style={StyleSheet.flatten([styles.footerButton, { backgroundColor: colors.surface.subtle }])} tone="neutral" />
          <ActionButton label={locale !== 'zh-CN' ? 'Save' : '保存'} onPress={save} style={styles.footerButton} tone="neutral" />
        </View>
      }>
      <View style={styles.introCopy}>
        <AppText variant="subtitle">{title}</AppText>
        <AppText numberOfLines={2} tone="muted" variant="caption">
          {locale !== 'zh-CN' ? 'Drag cards to reorder, then choose a widget size.' : '拖动卡片调整顺序，并选择小组件尺寸。'}
        </AppText>
      </View>

      <View style={styles.editorGrid}>
        {visibleItems.map(({ item, widget }, index) => (
          <LayoutEditorWidget
            index={index}
            isSettingsExpanded={expandedItemId === item.id}
            item={item}
            key={item.id}
            modeLabels={modeLabels}
            moveItem={moveItem}
            onViewModeChange={updateViewMode}
            toggleSettings={toggleSettings}
            widget={widget}
          />
        ))}
      </View>
    </Screen>
  );
}

function LayoutEditorWidget({
  index,
  isSettingsExpanded,
  item,
  modeLabels,
  moveItem,
  onViewModeChange,
  toggleSettings,
  widget,
}: {
  index: number;
  isSettingsExpanded: boolean;
  item: DiscoverLayoutItem;
  modeLabels: Record<DiscoverLayoutViewMode, string>;
  moveItem: (fromIndex: number, toIndex: number) => void;
  onViewModeChange: (id: DiscoverLayoutItem['id'], viewMode: DiscoverLayoutViewMode) => void;
  toggleSettings: (id: DiscoverLayoutItem['id']) => void;
  widget: DiscoverLayoutWidget;
}) {
  const { colors, locale } = useProductSettings();
  const dragY = useSharedValue(0);
  const scale = useSharedValue(1);
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(140)
        .activeCursor('grabbing')
        .runOnJS(true)
        .onBegin(() => {
          scale.value = withTiming(1.018, { duration: 120 });
        })
        .onChange((event) => {
          dragY.value = event.translationY;
        })
        .onFinalize((event) => {
          const step = Math.round(event.translationY / DRAG_ROW_HEIGHT);
          dragY.value = withTiming(0, { duration: 140 });
          scale.value = withTiming(1, { duration: 140 });
          moveItem(index, index + step);
        }),
    [dragY, index, moveItem, scale],
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }, { scale: scale.value }],
    zIndex: Math.abs(dragY.value) > 2 ? 20 : 0,
  }));
  const title = localizeText(widget.definition.title, locale);

  return (
    <Animated.View style={[styles.editorShell, animatedStyle, isSettingsExpanded && styles.editorShellExpanded]}>
        <View style={StyleSheet.flatten([styles.editorPreviewCard, shadows.panel, { backgroundColor: colors.surface.panel }])}>
          <View style={styles.editorChrome}>
            <GestureDetector gesture={gesture} touchAction="none">
              <View style={StyleSheet.flatten([styles.dragHandle, { backgroundColor: colors.surface.subtle }])}>
                <AppIcon name="icon.system.more" size={16} />
              </View>
            </GestureDetector>
            <View style={styles.flex}>
              <AppText numberOfLines={1} variant="subtitle">
                {title}
              </AppText>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {modeLabels[item.viewMode]}
              </AppText>
            </View>
            <View style={styles.moveButtons}>
              <NativePressable
                accessibilityLabel={`${title} settings`}
                accessibilityState={{ expanded: isSettingsExpanded }}
                minTouch={32}
                onPress={() => toggleSettings(item.id)}
                style={StyleSheet.flatten([styles.moveButton, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
                <AppIcon name="icon.system.settings" size={14} />
              </NativePressable>
            </View>
          </View>

          {isSettingsExpanded ? (
            <View style={StyleSheet.flatten([styles.sizeMenu, shadows.panel, { backgroundColor: colors.surface.panel }])}>
              {menuViewModes.map((mode, index) => {
                const selected = item.viewMode === mode;
                return (
                  <NativePressable
                    accessibilityLabel={`${title} ${modeLabels[mode]}`}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected }}
                    key={mode}
                    minTouch={48}
                    onPress={() => {
                      onViewModeChange(item.id, mode);
                      toggleSettings(item.id);
                    }}
                    style={StyleSheet.flatten([
                      styles.sizeMenuItem,
                      index < menuViewModes.length - 1 && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline },
                      selected && { backgroundColor: colors.surface.subtle },
                    ])}>
                    <ModeMenuIcon mode={mode} selected={selected} />
                    <AppText numberOfLines={1} tone={selected ? 'default' : 'muted'} variant="subtitle">
                      {modeLabels[mode]}
                    </AppText>
                  </NativePressable>
                );
              })}
            </View>
          ) : null}

          <View style={getPreviewSlotStyle(item.viewMode)}>
            <DiscoverLayoutPreview mode={item.viewMode} widget={widget} />
          </View>
        </View>
      </Animated.View>
  );
}

function DiscoverLayoutPreview({ mode, widget }: { mode: DiscoverLayoutViewMode; widget: DiscoverLayoutWidget }) {
  const { colors, locale } = useProductSettings();
  const definition = widget.definition;
  const title = localizeText(definition.title, locale);
  const subtitle = localizeText(definition.subtitle, locale);
  const iconTone = widget.kind === 'entry' ? getDiscoverEntryIconTone(widget.definition) : getDiscoverCampaignIconTone(widget.definition);
  const isSmall = mode === 'smallCard' || mode === 'smallList';
  const isList = mode === 'largeList' || mode === 'smallList';

  if (isList) {
    return (
      <View style={StyleSheet.flatten([styles.previewList, mode === 'smallList' && styles.previewSmallList, { backgroundColor: colors.surface.panel }])}>
        <AppIconFrame
          iconSizeVariant="sm"
          name={definition.icon}
          sizeVariant="sm"
          style={{ backgroundColor: getDiscoverIconBackgroundColor(colors, iconTone) }}
          tone={iconTone}
        />
        <View style={styles.previewCopy}>
          <AppText numberOfLines={1} variant="subtitle">
            {title}
          </AppText>
          {mode === 'largeList' ? (
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        <AppIcon name="icon.system.chevron_right" size={12} />
      </View>
    );
  }

  return (
    <View style={StyleSheet.flatten([styles.previewCard, isSmall && styles.previewSmallCard, { backgroundColor: colors.surface.panel }])}>
      <View style={styles.previewCopy}>
        {widget.kind === 'campaign' ? (
          <View style={StyleSheet.flatten([styles.previewBadge, { backgroundColor: colors.overlay.brand.subtle }])}>
            <AppText numberOfLines={1} tone="brand" variant="caption">
              {localizeText(widget.definition.badge, locale)}
            </AppText>
          </View>
        ) : null}
        <AppText numberOfLines={2} variant="subtitle">
          {title}
        </AppText>
        <AppText numberOfLines={isSmall ? 1 : 2} tone="muted" variant="caption">
          {subtitle}
        </AppText>
      </View>
      <AppIconFrame
        iconSizeVariant={isSmall ? 'sm' : 'md'}
        name={definition.icon}
        sizeVariant={isSmall ? 'sm' : 'xl'}
        style={{ backgroundColor: getDiscoverIconBackgroundColor(colors, iconTone) }}
        tone={iconTone}
      />
    </View>
  );
}

function ModeMenuIcon({ mode, selected }: { mode: DiscoverLayoutViewMode; selected: boolean }) {
  const { colors } = useProductSettings();
  const isList = mode === 'largeList' || mode === 'smallList';
  const isSmall = mode === 'smallCard' || mode === 'smallList';
  const railColor = selected ? colors.brand.fg : colors.text.tertiary;
  const fillColor = selected ? colors.overlay.brand.subtle : colors.surface.panel;

  return (
    <View style={StyleSheet.flatten([styles.menuIcon, isList ? styles.menuListIcon : styles.menuCardIcon, isSmall && styles.menuSmallIcon, { borderColor: railColor, backgroundColor: fillColor }])}>
      {isList ? (
        <>
          <View style={StyleSheet.flatten([styles.menuIconDot, { backgroundColor: railColor }])} />
          <View style={styles.menuIconLines}>
            <View style={StyleSheet.flatten([styles.menuIconLine, { backgroundColor: railColor }])} />
            <View style={StyleSheet.flatten([styles.menuIconLine, styles.menuIconShortLine, { backgroundColor: railColor }])} />
          </View>
        </>
      ) : (
        <>
          <View style={StyleSheet.flatten([styles.menuIconLine, { backgroundColor: railColor }])} />
          <View style={StyleSheet.flatten([styles.menuIconLine, styles.menuIconShortLine, { backgroundColor: railColor }])} />
          <View style={StyleSheet.flatten([styles.menuIconDot, styles.menuCardDot, { backgroundColor: railColor }])} />
        </>
      )}
    </View>
  );
}

function getModeLabels(locale: string): Record<DiscoverLayoutViewMode, string> {
  return {
    largeCard: locale !== 'zh-CN' ? 'Large card' : '大号卡片',
    largeList: locale !== 'zh-CN' ? 'Large list' : '大号列表',
    smallCard: locale !== 'zh-CN' ? 'Small card' : '小号卡片',
    smallList: locale !== 'zh-CN' ? 'Small list' : '小号列表',
  };
}

function getPreviewSlotStyle(mode: DiscoverLayoutViewMode) {
  return mode === 'largeCard' || mode === 'largeList' ? styles.previewFullSlot : styles.previewHalfSlot;
}

function getDiscoverEntryIconTone(entry: DiscoverEntryDefinition): IconTone {
  const toneByEntryId: Record<DiscoverEntryDefinition['id'], IconTone> = {
    challenge: 'success',
    community: 'info',
    education: 'warning',
    openAccount: 'info',
    partnerPortal: 'brand',
    profile: 'brand',
    rewards: 'warning',
    support: 'info',
  };

  return toneByEntryId[entry.id];
}

function getDiscoverCampaignIconTone(campaign: DiscoverCampaignDefinition): IconTone {
  const toneByCampaignId: Record<DiscoverCampaignDefinition['id'], IconTone> = {
    academySprint: 'warning',
    paperChallenge: 'success',
    partnerBooster: 'brand',
    referCommission: 'warning',
    riskQuizCredit: 'info',
  };

  return toneByCampaignId[campaign.id];
}

function getDiscoverIconBackgroundColor(colors: ThemeColors, tone: IconTone) {
  switch (tone) {
    case 'brand':
      return colors.overlay.brand.subtle;
    case 'danger':
      return colors.overlay.danger.subtle;
    case 'info':
      return colors.overlay.info.subtle;
    case 'success':
      return colors.overlay.success.subtle;
    case 'up':
      return colors.overlay.up.subtle;
    case 'down':
      return colors.overlay.down.subtle;
    case 'warning':
      return colors.overlay.warning.subtle;
    default:
      return colors.iconBg.neutral;
  }
}

const styles = StyleSheet.create({
  dragHandle: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  editorChrome: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editorGrid: {
    gap: spacing.md,
  },
  editorPreviewCard: {
    borderRadius: radius.lg,
    gap: spacing.md,
    overflow: 'visible',
    padding: spacing.md,
  },
  editorShell: {
    position: 'relative',
  },
  editorShellExpanded: {
    zIndex: 40,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footerButton: {
    flex: 1,
  },
  introCopy: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
  },
  menuCardDot: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  menuCardIcon: {
    alignItems: 'flex-start',
    height: 30,
    justifyContent: 'flex-start',
    padding: spacing.xs,
  },
  menuIcon: {
    borderRadius: radius.xs,
    borderWidth: lineWidth.hairline,
    flexShrink: 0,
    width: 36,
  },
  menuIconDot: {
    borderRadius: radius.full,
    height: 6,
    width: 6,
  },
  menuIconLine: {
    borderRadius: radius.full,
    height: 4,
    width: 16,
  },
  menuIconLines: {
    gap: spacing.xs,
  },
  menuIconShortLine: {
    width: 10,
  },
  menuListIcon: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    height: 22,
    paddingHorizontal: spacing.xs,
  },
  menuSmallIcon: {
    width: 30,
  },
  moveButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  moveButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  previewBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    maxWidth: 104,
    minHeight: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  previewCard: {
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 116,
    padding: spacing.md,
  },
  previewCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  previewFullSlot: {
    width: '100%',
  },
  previewHalfSlot: {
    alignSelf: 'stretch',
    width: '52%',
  },
  previewList: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 72,
    padding: spacing.md,
  },
  previewSmallCard: {
    flexDirection: 'column',
    minHeight: 142,
  },
  previewSmallList: {
    minHeight: 68,
  },
  sizeMenu: {
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'absolute',
    right: spacing.md,
    top: 54,
    width: 164,
    zIndex: 30,
  } as ViewStyle,
  sizeMenuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
