import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProductSettings } from '@/src/settings/ProductSettings';

type BottomSheetContextValue = {
  hide: () => void;
  show: (content: ReactNode) => void;
};

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);
const BottomSheetContentContext = createContext<ReactNode | null>(null);

export function BottomSheetProvider({ children }: PropsWithChildren) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const hide = useCallback(() => setContent(null), []);
  const show = useCallback((nextContent: ReactNode) => setContent(nextContent), []);
  const value = useMemo(() => ({ hide, show }), [hide, show]);

  return (
    <BottomSheetContext.Provider value={value}>
      <BottomSheetContentContext.Provider value={content}>{children}</BottomSheetContentContext.Provider>
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
  const content = useContext(BottomSheetContentContext);
  const { hide } = useBottomSheet();
  const { locale, palette } = useProductSettings();

  if (!content) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.host}>
      <Pressable
        accessibilityLabel={locale === 'en-US' ? 'Close bottom sheet' : '关闭底部弹框'}
        accessibilityRole="button"
        onPress={hide}
        style={styles.backdrop}
      />
      <View pointerEvents="box-none" style={styles.sheetSlot}>
        <View style={StyleSheet.flatten([styles.sheet, { backgroundColor: palette.bg, borderColor: palette.lineSoft }])}>
          <SafeAreaView edges={['bottom']} style={styles.sheetSafe}>
            <View style={StyleSheet.flatten([styles.handle, { backgroundColor: palette.line }])} />
            {content}
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.46)',
  },
  handle: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 4,
    marginBottom: 10,
    marginTop: 8,
    width: 40,
  },
  host: {
    ...StyleSheet.absoluteFillObject,
    elevation: 1000,
    zIndex: 1000,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    maxHeight: '82%',
    overflow: 'hidden',
    width: '100%',
  },
  sheetSafe: {
    flexShrink: 1,
  },
  sheetSlot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingTop: 64,
    width: '100%',
  },
});
