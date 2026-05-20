import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';

import { AppText } from '../components/Typography';

type ToastTone = 'danger' | 'default' | 'success' | 'warning';

type ToastPayload = {
  message?: string;
  title: string;
  tone?: ToastTone;
};

type ToastContextValue = {
  show: (payload: ToastPayload) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const palette = useThemePalette();
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    setToast(null);
  }, []);

  const show = useCallback(
    (payload: ToastPayload) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      setToast({ tone: 'default', ...payload });

      timer.current = setTimeout(hide, 2400);
    },
    [hide],
  );

  const value = useMemo(() => ({ show }), [show]);

  const tone = toast?.tone ?? 'default';
  const toneColor =
    tone === 'success' ? palette.down : tone === 'warning' ? palette.amber : tone === 'danger' ? palette.danger : palette.brand;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View
          pointerEvents="box-none"
          style={{
            alignItems: 'center',
            left: 0,
            paddingHorizontal: 14,
            paddingTop: 18,
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 90,
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: palette.panelHigh,
              borderColor: palette.line,
              borderRadius: 16,
              borderWidth: 1,
              elevation: 12,
              flexDirection: 'row',
              gap: 10,
              maxWidth: 420,
              minHeight: 52,
              paddingHorizontal: 12,
              paddingVertical: 10,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.14,
              shadowRadius: 24,
              width: '100%',
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: `${toneColor}18`,
                borderColor: `${toneColor}66`,
                borderRadius: 999,
                borderWidth: 1,
                height: 26,
                justifyContent: 'center',
                width: 26,
              }}>
              <AppText style={{ color: toneColor }} variant="caption">
                {tone === 'success' ? '✓' : tone === 'danger' ? '!' : tone === 'warning' ? '!' : 'i'}
              </AppText>
            </View>
            <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
              <AppText numberOfLines={1} variant="body">
                {toast.title}
              </AppText>
              {toast.message ? (
                <AppText numberOfLines={2} tone="muted" variant="caption">
                  {toast.message}
                </AppText>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    return {
      show: () => undefined,
    };
  }

  return context;
}
