import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import type { Locale, TranslationKey } from '@/src/i18n/translations';
import { translations } from '@/src/i18n/translations';
import { themePalettes, type ThemeMode, type ThemePalette } from '@/src/theme/colors';
import type { AuthStatus, DiscoverModuleId, Role } from '@/src/domain/types';

const STORAGE_KEY = 'broker-fx-product-settings';
const DEFAULT_THEME_MODE: ThemeMode = 'lightBroker';
const DEFAULT_DISCOVER_MODULE_BY_ROLE: Record<Role, DiscoverModuleId> = {
  partner: 'partner',
  trader: 'challenge',
};
const discoverModuleIds: DiscoverModuleId[] = [
  'challenge',
  'education',
  'community',
  'profile',
  'onboarding',
  'partner',
  'markets',
  'accounts',
  'support',
  'rewards',
];

type ProductSettings = {
  authStatus: AuthStatus;
  locale: Locale;
  palette: ThemePalette;
  role: Role;
  selectedDiscoverModuleByRole: Record<Role, DiscoverModuleId>;
  selectedDiscoverModuleId: DiscoverModuleId;
  setAuthStatus: (authStatus: AuthStatus) => void;
  setSelectedDiscoverModule: (moduleId: DiscoverModuleId) => void;
  setLocale: (locale: Locale) => void;
  setRole: (role: Role) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  themeMode: ThemeMode;
};

const ProductSettingsContext = createContext<ProductSettings | null>(null);

function readStoredSettings() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function isDiscoverModuleId(value: unknown): value is DiscoverModuleId {
  return typeof value === 'string' && discoverModuleIds.includes(value as DiscoverModuleId);
}

function readStoredDiscoverModules(stored: Record<string, unknown>): Record<Role, DiscoverModuleId> {
  const storedModules = stored.selectedDiscoverModuleByRole;

  if (!storedModules || typeof storedModules !== 'object') {
    return DEFAULT_DISCOVER_MODULE_BY_ROLE;
  }

  const modules = storedModules as Partial<Record<Role, unknown>>;

  return {
    partner: isDiscoverModuleId(modules.partner) ? modules.partner : DEFAULT_DISCOVER_MODULE_BY_ROLE.partner,
    trader: isDiscoverModuleId(modules.trader) ? modules.trader : DEFAULT_DISCOVER_MODULE_BY_ROLE.trader,
  };
}

export function ProductSettingsProvider({ children }: PropsWithChildren) {
  const stored = readStoredSettings();
  const [role, setRole] = useState<Role>(stored.role === 'partner' ? 'partner' : 'trader');
  const storedAuthStatus: AuthStatus =
    stored.authStatus === 'guest' || stored.authStatus === 'signedIn' ? stored.authStatus : stored.authStatus ? 'guest' : 'signedIn';
  const [authStatus, setAuthStatus] = useState<AuthStatus>(storedAuthStatus);
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    stored.themeMode && stored.themeMode in themePalettes ? stored.themeMode : DEFAULT_THEME_MODE,
  );
  const [locale, setLocale] = useState<Locale>(stored.locale === 'en-US' ? 'en-US' : 'zh-CN');
  const [selectedDiscoverModuleByRole, setSelectedDiscoverModuleByRole] = useState<Record<Role, DiscoverModuleId>>(
    readStoredDiscoverModules(stored),
  );
  const setSelectedDiscoverModule = (moduleId: DiscoverModuleId) => {
    setSelectedDiscoverModuleByRole((current) => ({ ...current, [role]: moduleId }));
  };

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ authStatus, locale, role, selectedDiscoverModuleByRole, themeMode }));
  }, [authStatus, locale, role, selectedDiscoverModuleByRole, themeMode]);

  const value = useMemo<ProductSettings>(() => {
    const dictionary = translations[locale];
    return {
      authStatus,
      locale,
      palette: themePalettes[themeMode],
      role,
      selectedDiscoverModuleByRole,
      selectedDiscoverModuleId: selectedDiscoverModuleByRole[role],
      setAuthStatus,
      setLocale,
      setRole,
      setSelectedDiscoverModule,
      setThemeMode,
      t: (key, params) => {
        let text: string = dictionary[key] ?? translations['zh-CN'][key] ?? key;

        if (params) {
          Object.entries(params).forEach(([paramKey, paramValue]) => {
            text = text.replaceAll(`{${paramKey}}`, String(paramValue));
          });
        }

        return text;
      },
      themeMode,
    };
  }, [authStatus, locale, role, selectedDiscoverModuleByRole, themeMode]);

  return <ProductSettingsContext.Provider value={value}>{children}</ProductSettingsContext.Provider>;
}

export function useProductSettings() {
  const context = useContext(ProductSettingsContext);

  if (!context) {
    throw new Error('useProductSettings must be used inside ProductSettingsProvider');
  }

  return context;
}

export function useI18n() {
  const { locale, t } = useProductSettings();
  return { locale, t };
}

export function useThemePalette() {
  return useProductSettings().palette;
}
