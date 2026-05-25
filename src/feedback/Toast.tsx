import { usePathname } from 'expo-router';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeedbackToast, type FeedbackToastTone } from '@/src/components/feedback/FeedbackToast';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { size, spacing } from '@/src/theme/tokens';

type ToastTone = FeedbackToastTone;

type ToastPayload = {
  dismissible?: boolean;
  durationMs?: number;
  message?: string;
  title: string;
  tone?: ToastTone;
};

type ActiveToast = Required<Pick<ToastPayload, 'dismissible' | 'durationMs' | 'tone'>> &
  Omit<ToastPayload, 'dismissible' | 'durationMs' | 'tone'> & {
    id: number;
  };

type ToastContextValue = {
  show: (payload: ToastPayload) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_TITLE_DURATION_MS = 3000;
const TOAST_MESSAGE_DURATION_MS = 4500;
const TOAST_LONG_MESSAGE_DURATION_MS = 6000;
const TOAST_LONG_MESSAGE_LENGTH = 90;
const TOAST_ENTER_MS = 180;
const TOAST_EXIT_MS = 140;

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const nextToastId = useRef(0);

  const hide = useCallback(() => {
    setToast(null);
  }, []);

  const show = useCallback(
    (payload: ToastPayload) => {
      const nextToast: ActiveToast = {
        id: nextToastId.current + 1,
        message: payload.message,
        title: payload.title,
        dismissible: payload.dismissible ?? true,
        durationMs: payload.durationMs ?? resolveToastDuration(payload),
        tone: payload.tone ?? 'default',
      };
      nextToastId.current = nextToast.id;
      setToast(nextToast);
    },
    [],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <FeedbackToastHost onDismiss={hide} toast={toast} />
    </ToastContext.Provider>
  );
}

function resolveToastDuration(payload: ToastPayload) {
  if (!payload.message) {
    return TOAST_TITLE_DURATION_MS;
  }

  return payload.message.length > TOAST_LONG_MESSAGE_LENGTH ? TOAST_LONG_MESSAGE_DURATION_MS : TOAST_MESSAGE_DURATION_MS;
}

function FeedbackToastHost({ onDismiss, toast }: { onDismiss: () => void; toast: ActiveToast | null }) {
  const { t } = useProductSettings();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const hasTopNavigation = pathname ? !/^\/(?:launch|brand-splash|auth(?:\/|$)|$)/.test(pathname) : true;
  const top = insets.top + (hasTopNavigation ? size.sheet.headerHeight + spacing.md : spacing.lg);

  return (
    <View
      accessibilityElementsHidden={!toast}
      pointerEvents="box-none"
      style={StyleSheet.flatten([
        styles.host,
        {
          paddingTop: top,
          width,
        },
      ])}>
      {toast ? <AnimatedFeedbackToast dismissLabel={t('common.cancel')} onDismiss={onDismiss} toast={toast} /> : null}
    </View>
  );
}

function AnimatedFeedbackToast({
  dismissLabel,
  onDismiss,
  toast,
}: {
  dismissLabel: string;
  onDismiss: () => void;
  toast: ActiveToast;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeWithAnimation = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    opacity.value = withTiming(0, { duration: TOAST_EXIT_MS, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(-8, { duration: TOAST_EXIT_MS, easing: Easing.out(Easing.quad) }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
  }, [onDismiss, opacity, translateY]);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = -8;
    opacity.value = withTiming(1, { duration: TOAST_ENTER_MS, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: TOAST_ENTER_MS, easing: Easing.out(Easing.cubic) });
    AccessibilityInfo.announceForAccessibility([toast.title, toast.message].filter(Boolean).join('. '));
    timer.current = setTimeout(closeWithAnimation, toast.durationMs);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [closeWithAnimation, opacity, toast.durationMs, toast.id, toast.message, toast.title, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <FeedbackToast
        dismissible={toast.dismissible}
        dismissLabel={dismissLabel}
        message={toast.message}
        onDismiss={closeWithAnimation}
        title={toast.title}
        tone={toast.tone}
      />
    </Animated.View>
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

const styles = StyleSheet.create({
  host: {
    alignItems: 'center',
    alignSelf: 'center',
    left: 0,
    paddingHorizontal: spacing.lg,
    pointerEvents: 'box-none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 90,
  },
});
