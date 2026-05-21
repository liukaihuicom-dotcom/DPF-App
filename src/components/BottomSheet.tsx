import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProductSettings } from '@/src/settings/ProductSettings';

import { ActionButton, type ActionButtonTone } from './ActionButton';
import { NativePressable } from './NativePressable';
import { PhosphorIcon } from './PhosphorIcon';
import { AppText } from './Typography';

export type BottomSheetAction = {
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress: () => void;
  tone?: ActionButtonTone;
};

export type BottomSheetOptions = {
  content: ReactNode;
  footer?: ReactNode | BottomSheetAction[];
  snapPoints?: Array<string | number>;
  subtitle?: string;
  title: string;
};

type BottomSheetContextValue = {
  hide: () => void;
  show: (options: BottomSheetOptions) => void;
};

const TOP_RESERVED_SPACE = 24;
const MAX_PAGE_SHEET_WIDTH = 430;

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);
const BottomSheetOptionsContext = createContext<BottomSheetOptions | null>(null);

export function BottomSheetProvider({ children }: PropsWithChildren) {
  const [options, setOptions] = useState<BottomSheetOptions | null>(null);
  const hide = useCallback(() => setOptions(null), []);
  const show = useCallback((nextOptions: BottomSheetOptions) => setOptions(nextOptions), []);
  const value = useMemo(() => ({ hide, show }), [hide, show]);

  return (
    <BottomSheetContext.Provider value={value}>
      <BottomSheetOptionsContext.Provider value={options}>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      </BottomSheetOptionsContext.Provider>
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
  const { hide } = useBottomSheet();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { locale, palette, themeMode } = useProductSettings();
  const modalRef = useRef<BottomSheetModal>(null);
  const maxHeight = Math.max(1, height - insets.top - TOP_RESERVED_SPACE);
  const sheetWidth = Math.min(width, MAX_PAGE_SHEET_WIDTH);
  const horizontalInset = Math.max(0, (width - sheetWidth) / 2);
  const backdropColor = `${themeMode === 'lightBroker' ? palette.text : palette.bg}99`;
  const hasCustomSnapPoints = Boolean(options?.snapPoints?.length);
  const snapPoints = useMemo(() => {
    if (options?.snapPoints?.length) {
      return options.snapPoints;
    }

    return undefined;
  }, [options?.snapPoints]);

  useEffect(() => {
    if (options) {
      modalRef.current?.present();
    } else {
      modalRef.current?.dismiss();
    }
  }, [options]);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <AppBottomSheetBackdrop {...props} backgroundColor={backdropColor} />, [backdropColor]);

  if (!options) {
    return null;
  }

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: palette.bg }}
      detached={false}
      enableContentPanningGesture
      enableDynamicSizing={!hasCustomSnapPoints}
      enablePanDownToClose
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
      <BottomSheetHeader hide={hide} locale={locale} subtitle={options.subtitle} title={options.title} />
      <BottomSheetContent>{options.content}</BottomSheetContent>
      {options.footer ? <BottomSheetFooter footer={options.footer} hide={hide} /> : null}
    </BottomSheetModal>
  );
}

function BottomSheetHeader({
  hide,
  locale,
  subtitle,
  title,
}: {
  hide: () => void;
  locale: string;
  subtitle?: string;
  title: string;
}) {
  const { palette } = useProductSettings();

  return (
    <BottomSheetView style={StyleSheet.flatten([styles.header, { borderBottomColor: palette.lineSoft }])}>
      <View style={styles.headerCopy}>
        <AppText numberOfLines={2} variant="subtitle">
          {title}
        </AppText>
        {subtitle ? (
          <AppText numberOfLines={2} tone="muted" variant="caption">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <NativePressable
        accessibilityLabel={locale === 'en-US' ? 'Close bottom sheet' : '关闭底部弹框'}
        accessibilityRole="button"
        minTouch={40}
        onPress={hide}
        style={StyleSheet.flatten([styles.closeButton, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
        <PhosphorIcon color={palette.textDim} name="x" size={14} />
      </NativePressable>
    </BottomSheetView>
  );
}

function BottomSheetContent({ children }: { children: ReactNode }) {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {children}
    </BottomSheetScrollView>
  );
}

function BottomSheetFooter({ footer, hide }: { footer: ReactNode | BottomSheetAction[]; hide: () => void }) {
  const insets = useSafeAreaInsets();
  const { palette } = useProductSettings();

  if (!Array.isArray(footer)) {
    return (
      <BottomSheetView style={StyleSheet.flatten([styles.footer, { borderTopColor: palette.lineSoft, paddingBottom: Math.max(insets.bottom, 14) }])}>
        {footer}
      </BottomSheetView>
    );
  }

  return (
    <BottomSheetView style={StyleSheet.flatten([styles.footer, { borderTopColor: palette.lineSoft, paddingBottom: Math.max(insets.bottom, 14) }])}>
      {footer.map((action) => (
        <ActionButton
          accessibilityLabel={action.accessibilityLabel}
          disabled={action.disabled}
          key={action.label}
          label={action.label}
          loading={action.loading}
          onPress={() => {
            action.onPress();
            hide();
          }}
          tone={action.tone}
        />
      ))}
    </BottomSheetView>
  );
}

function AppBottomSheetBackdrop({ backgroundColor, ...props }: BottomSheetBackdropProps & {
  backgroundColor: string;
}) {
  return (
    <BottomSheetBackdrop
      {...props}
      accessibilityElementsHidden
      accessibilityRole="none"
      accessible={false}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      enableTouchThrough={false}
      importantForAccessibility="no-hide-descendants"
      opacity={1}
      pressBehavior="close"
      style={StyleSheet.flatten([styles.backdrop, { backgroundColor }])}
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  content: {
    gap: 14,
    padding: 16,
  },
  footer: {
    borderTopWidth: 1,
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handle: {
    paddingBottom: 5,
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 62,
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  headerCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
});
