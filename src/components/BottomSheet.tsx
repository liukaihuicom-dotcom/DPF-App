import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import {
  BottomSheetFooter as GorhomBottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, layout, radius, spacing } from '@/src/theme/tokens';

import { ActionButton, type ActionButtonTone, type ActionButtonVariant } from './ActionButton';
import { AppIcon, type AppIconName } from './AppIcon';
import { HeaderIconButton, HeaderIconSlot } from './HeaderIconButton';
import { AppText } from './Typography';

export type BottomSheetAction = {
  accessibilityLabel?: string;
  disabled?: boolean;
  icon?: AppIconName;
  label: string;
  loading?: boolean;
  onPress: () => void;
  tone?: ActionButtonTone;
  variant?: ActionButtonVariant;
};

export type BottomSheetHeaderAction = {
  accessibilityLabel: string;
  icon: AppIconName;
  onPress: () => void;
};

export type BottomSheetHeaderOptions = {
  leftAction?: BottomSheetHeaderAction;
  leftIcon?: AppIconName;
  rightAction?: BottomSheetHeaderAction;
  /** @deprecated Use `rightAction` for explicit business actions. */
  onRightPress?: () => void;
  /** @deprecated Use `rightAction.accessibilityLabel`. */
  rightAccessibilityLabel?: string;
  /** @deprecated Use `rightAction.icon`. */
  rightIcon?: AppIconName;
  /** @deprecated Put supporting context in the content area by default. */
  subtitle?: string;
  title: string;
};

export type BottomSheetOptions = {
  content: ReactNode;
  contentSizing?: 'auto' | 'fill';
  footer?: ReactNode | BottomSheetAction[];
  header?: false | BottomSheetHeaderOptions;
  onDismiss?: () => void;
  snapPoints?: Array<string | number>;
  /** @deprecated Use `header.title` or `header: false` so the header mode is explicit. */
  subtitle?: string;
  /** @deprecated Use `header.title` or `header: false` so the header mode is explicit. */
  title?: string;
};

type BottomSheetPresetBaseOptions = Pick<BottomSheetOptions, 'content' | 'footer' | 'onDismiss' | 'snapPoints'>;
type BottomSheetHeaderPresetOptions = BottomSheetPresetBaseOptions & BottomSheetHeaderOptions;

export const bottomSheetPresets = {
  actionMenu(options: BottomSheetPresetBaseOptions): BottomSheetOptions {
    return {
      ...options,
      header: false,
    };
  },
  detail(options: BottomSheetHeaderPresetOptions): BottomSheetOptions {
    const { content, footer, snapPoints, ...header } = options;

    return {
      content,
      footer,
      header,
      snapPoints,
    };
  },
  selection(options: BottomSheetHeaderPresetOptions): BottomSheetOptions {
    const { content, footer, snapPoints, ...header } = options;

    return {
      content,
      footer,
      header,
      snapPoints,
    };
  },
};

type BottomSheetContextValue = {
  back: () => void;
  hide: () => void;
  push: (options: BottomSheetOptions) => void;
  show: (options: BottomSheetOptions) => void;
};

const TOP_RESERVED_SPACE = layout.topReservedSpace;
const MAX_PAGE_SHEET_WIDTH = layout.appMaxWidth;
const SHEET_HEADER_HEIGHT = layout.sheetHeaderHeight;

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);
const BottomSheetOptionsContext = createContext<BottomSheetOptions | null>(null);
const BottomSheetStackDepthContext = createContext(0);

export function BottomSheetProvider({ children }: PropsWithChildren) {
  const [stack, setStack] = useState<BottomSheetOptions[]>([]);
  const hide = useCallback(() => {
    setStack((current) => {
      current.at(-1)?.onDismiss?.();
      return [];
    });
  }, []);
  const show = useCallback((nextOptions: BottomSheetOptions) => setStack([nextOptions]), []);
  const push = useCallback((nextOptions: BottomSheetOptions) => setStack((current) => [...current, nextOptions]), []);
  const back = useCallback(() => {
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : []));
  }, []);
  const value = useMemo(() => ({ back, hide, push, show }), [back, hide, push, show]);
  const options = stack.at(-1) ?? null;

  return (
    <BottomSheetContext.Provider value={value}>
      <BottomSheetStackDepthContext.Provider value={stack.length}>
        <BottomSheetOptionsContext.Provider value={options}>
          <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        </BottomSheetOptionsContext.Provider>
      </BottomSheetStackDepthContext.Provider>
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error('useBottomSheet must be used inside BottomSheetProvider');
  }

  return context;
}

export function GlobalBottomSheetHost() {
  const options = useContext(BottomSheetOptionsContext);
  const stackDepth = useContext(BottomSheetStackDepthContext);
  const { back, hide } = useBottomSheet();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { locale, palette, resolvedThemeMode } = useProductSettings();
  const modalRef = useRef<BottomSheetModal>(null);
  const [backdropInteractive, setBackdropInteractive] = useState(false);
  const maxHeight = Math.max(1, height - insets.top - TOP_RESERVED_SPACE);
  const sheetWidth = Math.min(width, MAX_PAGE_SHEET_WIDTH);
  const horizontalInset = Math.max(0, (width - sheetWidth) / 2);
  const backdropColor = `${resolvedThemeMode === 'darkTerminal' || resolvedThemeMode === 'midnightBlue' ? palette.bg : palette.text}99`;
  const hasFooter = Boolean(options?.footer);
  const snapPoints = useMemo(() => {
    if (options?.snapPoints?.length) {
      return options.snapPoints;
    }

    return [];
  }, [options?.snapPoints]);
  const hasExplicitSnapPoints = snapPoints.length > 0;
  const footerComponent = useCallback(
    (props: BottomSheetFooterProps) => (
      options?.footer ? <AppBottomSheetFooter {...props} footer={options.footer} hide={hide} /> : null
    ),
    [hide, options?.footer],
  );

  useEffect(() => {
    if (options) {
      setBackdropInteractive(false);
      modalRef.current?.present();
      const timer = setTimeout(() => {
        setBackdropInteractive(true);
      }, 250);

      return () => clearTimeout(timer);
    } else {
      setBackdropInteractive(false);
      modalRef.current?.dismiss();
    }
  }, [options]);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <AppBottomSheetBackdrop {...props} backgroundColor={backdropColor} />, [backdropColor]);
  if (!options) {
    return null;
  }

  const headerOptions = resolveHeaderOptions(options);

  return (
    <>
      <Pressable
        accessibilityElementsHidden
        accessible={false}
        disabled={!backdropInteractive}
        importantForAccessibility="no-hide-descendants"
        onPress={hide}
        style={StyleSheet.flatten([styles.hostBackdrop, { backgroundColor: backdropColor, height, width }])}
      />
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: palette.bg }}
        containerStyle={styles.modalContainer}
        detached={false}
        enableContentPanningGesture
        enableDynamicSizing={!hasExplicitSnapPoints}
        enablePanDownToClose
        footerComponent={options.footer ? footerComponent : undefined}
        handleIndicatorStyle={{ backgroundColor: palette.line, width: 40 }}
        handleStyle={styles.handle}
        index={0}
        keyboardBlurBehavior="restore"
        maxDynamicContentSize={maxHeight}
        onDismiss={hide}
        ref={modalRef}
        snapPoints={snapPoints}
        style={StyleSheet.flatten([styles.modal, { borderColor: palette.lineSoft, marginLeft: horizontalInset, width: sheetWidth }])}
        topInset={insets.top + TOP_RESERVED_SPACE}>
        {headerOptions ? <BottomSheetHeader back={back} header={headerOptions} isNested={stackDepth > 1} locale={locale} /> : null}
        <BottomSheetContent hasFooter={Boolean(options.footer)}>{options.content}</BottomSheetContent>
      </BottomSheetModal>
    </>
  );
}

function resolveHeaderOptions(options: BottomSheetOptions): BottomSheetHeaderOptions | null {
  if (options.header === false) {
    return null;
  }

  if (options.header) {
    return options.header;
  }

  return {
    subtitle: options.subtitle,
    title: options.title ?? '',
  };
}

function BottomSheetHeader({
  back,
  header,
  isNested,
  locale,
}: {
  back: () => void;
  header: BottomSheetHeaderOptions;
  isNested: boolean;
  locale: string;
}) {
  const { palette } = useProductSettings();
  const nestedBackAction: BottomSheetHeaderAction = useMemo(
    () => ({
      accessibilityLabel: locale !== 'zh-CN' ? 'Back' : '返回',
      icon: 'icon.system.back',
      onPress: back,
    }),
    [back, locale],
  );
  const leftAction = isNested ? nestedBackAction : header.leftAction;
  const rightAction = resolveHeaderRightAction(header);

  return (
    <BottomSheetView style={StyleSheet.flatten([styles.header, { backgroundColor: palette.bg }])}>
      <HeaderIconSlot>
        {leftAction ? (
          <HeaderIconButton
            accessibilityLabel={leftAction.accessibilityLabel}
            icon={leftAction.icon}
            onPress={leftAction.onPress}
            tone="default"
          />
        ) : header.leftIcon ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.decorativeHeaderIcon}>
            <AppIcon tone="text" name={header.leftIcon} size={layout.headerIconSize} />
          </View>
        ) : null}
      </HeaderIconSlot>
      <View style={styles.headerCopy}>
        <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.headerTitle} variant="sheetTitle">
          {header.title}
        </AppText>
      </View>
      <HeaderIconSlot>
        {rightAction ? (
          <HeaderIconButton
            accessibilityLabel={rightAction.accessibilityLabel}
            icon={rightAction.icon}
            onPress={rightAction.onPress}
            tone="default"
          />
        ) : null}
      </HeaderIconSlot>
    </BottomSheetView>
  );
}

function resolveHeaderRightAction(header: BottomSheetHeaderOptions): BottomSheetHeaderAction | undefined {
  if (header.rightAction) {
    return header.rightAction;
  }

  if (header.onRightPress && header.rightIcon && header.rightAccessibilityLabel) {
    return {
      accessibilityLabel: header.rightAccessibilityLabel,
      icon: header.rightIcon,
      onPress: header.onRightPress,
    };
  }

  return undefined;
}

function BottomSheetContent({ children, hasFooter }: { children: ReactNode; hasFooter: boolean }) {
  const options = useContext(BottomSheetOptionsContext);
  const hasHeader = Boolean(options && resolveHeaderOptions(options));
  const contentSizing = options?.contentSizing ?? 'auto';

  return (
    <BottomSheetScrollView
      enableFooterMarginAdjustment={hasFooter}
      contentContainerStyle={StyleSheet.flatten([
        styles.content,
        contentSizing === 'fill' && styles.contentFill,
        hasHeader && styles.contentWithHeader,
        hasFooter && styles.contentWithFooter,
      ])}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {hasHeader ? <BottomSheetHeaderSpacer /> : null}
      {children}
    </BottomSheetScrollView>
  );
}

function BottomSheetHeaderSpacer() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.headerSpacer}
    />
  );
}

function AppBottomSheetFooter({
  animatedFooterPosition,
  footer,
  hide,
}: {
  animatedFooterPosition: BottomSheetFooterProps['animatedFooterPosition'];
  footer: ReactNode | BottomSheetAction[];
  hide: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { palette } = useProductSettings();
  const footerStyle = StyleSheet.flatten([styles.footer, { backgroundColor: palette.bg, borderTopColor: palette.lineSoft, paddingBottom: Math.max(insets.bottom, 14) }]);

  if (!Array.isArray(footer)) {
    return (
      <GorhomBottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <View style={footerStyle}>{footer}</View>
      </GorhomBottomSheetFooter>
    );
  }

  return (
    <GorhomBottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <View style={footerStyle}>
        {footer.map((action) => (
          <ActionButton
            accessibilityLabel={action.accessibilityLabel}
            disabled={action.disabled}
            icon={action.icon}
            key={action.label}
            label={action.label}
            loading={action.loading}
            onPress={() => {
              action.onPress();
              hide();
            }}
            tone={action.tone}
            variant={action.variant}
          />
        ))}
      </View>
    </GorhomBottomSheetFooter>
  );
}

function AppBottomSheetBackdrop({ animatedIndex, backgroundColor }: BottomSheetBackdropProps & {
  backgroundColor: string;
}) {
  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP),
    }),
    [animatedIndex],
  );

  return (
    <Animated.View
      accessibilityElementsHidden
      accessibilityRole="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.flatten([styles.backdrop, { backgroundColor }, animatedStyle])}
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    gap: spacing.md,
    padding: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  contentFill: {
    flexGrow: 1,
  },
  contentWithHeader: {
    paddingTop: 0,
  },
  contentWithFooter: {
    paddingBottom: 148,
  },
  footer: {
    borderTopWidth: lineWidth.hairline,
    gap: 10,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  handle: {
    paddingBottom: 5,
    paddingTop: 8,
  },
  hostBackdrop: {
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    height: SHEET_HEADER_HEIGHT,
    paddingHorizontal: layout.screenPaddingX,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  decorativeHeaderIcon: {
    alignItems: 'center',
    height: layout.headerIconButtonSize,
    justifyContent: 'center',
    width: layout.headerIconButtonSize,
  },
  headerTitle: {
    textAlign: 'center',
  },
  headerSpacer: {
    height: SHEET_HEADER_HEIGHT,
  },
  modal: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: lineWidth.hairline,
    overflow: 'hidden',
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1001,
  },
});
