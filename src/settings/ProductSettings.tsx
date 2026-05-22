import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

import {
  tradingAccountCountPresets,
  tradingAccountDataPresets,
  tradingAccountStatusPresets,
  type TradingAccountCountPreset,
  type TradingAccountDataPreset,
  type TradingAccountScenario,
  type TradingAccountStatusPreset,
} from '@/src/domain/accountProfiles';
import { normalizeDiscoverLayoutItems, type DiscoverLayoutItem } from '@/src/domain/discoverLayout';
import type { Locale, TranslationKey } from '@/src/i18n/translations';
import { translations } from '@/src/i18n/translations';
import type { ProfileAvatarId } from '@/src/components/ProfileAvatar';
import { themePalettes, type ResolvedThemeMode, type ThemeMode, type ThemePalette } from '@/src/theme/colors';
import type { AuthStatus, DiscoverModuleId, Role, TradeWorkspaceDataPreset, TradingAccountUsageOverride } from '@/src/domain/types';

const STORAGE_KEY = 'dupoin-mvp-product-settings';
const DEFAULT_THEME_MODE: ThemeMode = 'system';
const FALLBACK_SYSTEM_THEME_MODE: ResolvedThemeMode = 'lightBroker';
const DEFAULT_DISCOVER_MODULE_BY_ROLE: Record<Role, DiscoverModuleId> = {
  partner: 'partner',
  trader: 'community',
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
const tradingAccountScenarios: TradingAccountScenario[] = ['default', 'stateAnalysis'];
const tradingAccountUsageOverrides: TradingAccountUsageOverride[] = ['auto', 'normal', 'warning', 'abnormal'];
export const tradeWorkspaceDataPresets: TradeWorkspaceDataPreset[] = ['empty', 'sample'];
const profileAvatarIds: ProfileAvatarId[] = ['frank', 'mika', 'alex', 'sophia'];

type ProductSettings = {
  authStatus: AuthStatus;
  discoverLayoutItems: DiscoverLayoutItem[];
  locale: Locale;
  palette: ThemePalette;
  resolvedThemeMode: ResolvedThemeMode;
  role: Role;
  pendingOrderDataPreset: TradeWorkspaceDataPreset;
  positionDataPreset: TradeWorkspaceDataPreset;
  profileAvatarId: ProfileAvatarId;
  selectedDiscoverModuleByRole: Record<Role, DiscoverModuleId>;
  selectedDiscoverModuleId: DiscoverModuleId;
  selectedTradingAccountId: string;
  setAuthStatus: (authStatus: AuthStatus) => void;
  setDiscoverLayoutItems: (discoverLayoutItems: DiscoverLayoutItem[]) => void;
  setLocale: (locale: Locale) => void;
  setPendingOrderDataPreset: (pendingOrderDataPreset: TradeWorkspaceDataPreset) => void;
  setPositionDataPreset: (positionDataPreset: TradeWorkspaceDataPreset) => void;
  setProfileAvatarId: (profileAvatarId: ProfileAvatarId) => void;
  setRole: (role: Role) => void;
  setSelectedDiscoverModule: (moduleId: DiscoverModuleId) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setSelectedTradingAccountId: (selectedTradingAccountId: string) => void;
  setTradingAccountCountPreset: (tradingAccountCountPreset: TradingAccountCountPreset) => void;
  setTradingAccountDataPreset: (tradingAccountDataPreset: TradingAccountDataPreset) => void;
  setTradingAccountScenario: (tradingAccountScenario: TradingAccountScenario) => void;
  setTradingAccountStatusPreset: (tradingAccountStatusPreset: TradingAccountStatusPreset) => void;
  setTradingAccountUsageOverride: (tradingAccountUsageOverride: TradingAccountUsageOverride) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  themeMode: ThemeMode;
  tradingAccountCountPreset: TradingAccountCountPreset;
  tradingAccountDataPreset: TradingAccountDataPreset;
  tradingAccountScenario: TradingAccountScenario;
  tradingAccountStatusPreset: TradingAccountStatusPreset;
  tradingAccountUsageOverride: TradingAccountUsageOverride;
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

function isTradingAccountUsageOverride(value: unknown): value is TradingAccountUsageOverride {
  return typeof value === 'string' && tradingAccountUsageOverrides.includes(value as TradingAccountUsageOverride);
}

function isTradingAccountScenario(value: unknown): value is TradingAccountScenario {
  return typeof value === 'string' && tradingAccountScenarios.includes(value as TradingAccountScenario);
}

function isTradingAccountCountPreset(value: unknown): value is TradingAccountCountPreset {
  return typeof value === 'string' && tradingAccountCountPresets.includes(value as TradingAccountCountPreset);
}

function isTradingAccountDataPreset(value: unknown): value is TradingAccountDataPreset {
  return typeof value === 'string' && tradingAccountDataPresets.includes(value as TradingAccountDataPreset);
}

function isTradingAccountStatusPreset(value: unknown): value is TradingAccountStatusPreset {
  return typeof value === 'string' && tradingAccountStatusPresets.includes(value as TradingAccountStatusPreset);
}

function isTradeWorkspaceDataPreset(value: unknown): value is TradeWorkspaceDataPreset {
  return typeof value === 'string' && tradeWorkspaceDataPresets.includes(value as TradeWorkspaceDataPreset);
}

function isProfileAvatarId(value: unknown): value is ProfileAvatarId {
  return typeof value === 'string' && profileAvatarIds.includes(value as ProfileAvatarId);
}

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (value === 'system' || value in themePalettes);
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
  const systemColorScheme = useColorScheme();
  const stored = readStoredSettings();
  const [role, setRole] = useState<Role>(stored.role === 'partner' ? 'partner' : 'trader');
  const storedAuthStatus: AuthStatus =
    stored.authStatus === 'guest' || stored.authStatus === 'signedIn' ? stored.authStatus : stored.authStatus ? 'guest' : 'signedIn';
  const [authStatus, setAuthStatus] = useState<AuthStatus>(storedAuthStatus);
  const [discoverLayoutItems, updateDiscoverLayoutItems] = useState<DiscoverLayoutItem[]>(
    normalizeDiscoverLayoutItems(stored.discoverLayoutItems),
  );
  const setDiscoverLayoutItems = (items: DiscoverLayoutItem[]) => {
    updateDiscoverLayoutItems(normalizeDiscoverLayoutItems(items));
  };
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    isThemeMode(stored.themeMode) ? stored.themeMode : DEFAULT_THEME_MODE,
  );
  const [locale, setLocale] = useState<Locale>(stored.locale === 'en-US' ? 'en-US' : 'zh-CN');
  const [selectedDiscoverModuleByRole, setSelectedDiscoverModuleByRole] = useState<Record<Role, DiscoverModuleId>>(
    readStoredDiscoverModules(stored),
  );
  const [tradingAccountScenario, setTradingAccountScenario] = useState<TradingAccountScenario>(
    isTradingAccountScenario(stored.tradingAccountScenario) ? stored.tradingAccountScenario : 'default',
  );
  const [tradingAccountCountPreset, setTradingAccountCountPreset] = useState<TradingAccountCountPreset>(
    isTradingAccountCountPreset(stored.tradingAccountCountPreset) ? stored.tradingAccountCountPreset : 'scenario',
  );
  const [tradingAccountDataPreset, setTradingAccountDataPreset] = useState<TradingAccountDataPreset>(
    isTradingAccountDataPreset(stored.tradingAccountDataPreset) ? stored.tradingAccountDataPreset : 'scenario',
  );
  const [tradingAccountStatusPreset, setTradingAccountStatusPreset] = useState<TradingAccountStatusPreset>(
    isTradingAccountStatusPreset(stored.tradingAccountStatusPreset) ? stored.tradingAccountStatusPreset : 'scenario',
  );
  const [tradingAccountUsageOverride, setTradingAccountUsageOverride] = useState<TradingAccountUsageOverride>(
    isTradingAccountUsageOverride(stored.tradingAccountUsageOverride) ? stored.tradingAccountUsageOverride : 'auto',
  );
  const [positionDataPreset, setPositionDataPreset] = useState<TradeWorkspaceDataPreset>(
    isTradeWorkspaceDataPreset(stored.positionDataPreset) ? stored.positionDataPreset : 'empty',
  );
  const [pendingOrderDataPreset, setPendingOrderDataPreset] = useState<TradeWorkspaceDataPreset>(
    isTradeWorkspaceDataPreset(stored.pendingOrderDataPreset) ? stored.pendingOrderDataPreset : 'empty',
  );
  const [selectedTradingAccountId, setSelectedTradingAccountId] = useState(
    typeof stored.selectedTradingAccountId === 'string' && stored.selectedTradingAccountId ? stored.selectedTradingAccountId : 'demo-main',
  );
  const [profileAvatarId, setProfileAvatarId] = useState<ProfileAvatarId>(
    isProfileAvatarId(stored.profileAvatarId) ? stored.profileAvatarId : 'frank',
  );
  const setSelectedDiscoverModule = (moduleId: DiscoverModuleId) => {
    setSelectedDiscoverModuleByRole((current) => ({ ...current, [role]: moduleId }));
  };

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        authStatus,
        discoverLayoutItems,
        locale,
        pendingOrderDataPreset,
        positionDataPreset,
        profileAvatarId,
        role,
        selectedDiscoverModuleByRole,
        selectedTradingAccountId,
        themeMode,
        tradingAccountCountPreset,
        tradingAccountDataPreset,
        tradingAccountScenario,
        tradingAccountStatusPreset,
        tradingAccountUsageOverride,
      }),
    );
  }, [
    authStatus,
    discoverLayoutItems,
    locale,
    pendingOrderDataPreset,
    positionDataPreset,
    profileAvatarId,
    role,
    selectedDiscoverModuleByRole,
    selectedTradingAccountId,
    themeMode,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
    tradingAccountUsageOverride,
  ]);

  const value = useMemo<ProductSettings>(() => {
    const dictionary = translations[locale];
    const resolvedThemeMode: ResolvedThemeMode =
      themeMode === 'system' ? (systemColorScheme === 'dark' ? 'darkTerminal' : FALLBACK_SYSTEM_THEME_MODE) : themeMode;

    return {
      authStatus,
      discoverLayoutItems,
      locale,
      palette: themePalettes[resolvedThemeMode],
      pendingOrderDataPreset,
      positionDataPreset,
      profileAvatarId,
      resolvedThemeMode,
      role,
      selectedDiscoverModuleByRole,
      selectedDiscoverModuleId: selectedDiscoverModuleByRole[role],
      selectedTradingAccountId,
      setAuthStatus,
      setDiscoverLayoutItems,
      setLocale,
      setPendingOrderDataPreset,
      setPositionDataPreset,
      setProfileAvatarId,
      setRole,
      setSelectedDiscoverModule,
      setSelectedTradingAccountId,
      setThemeMode,
      setTradingAccountCountPreset,
      setTradingAccountDataPreset,
      setTradingAccountScenario,
      setTradingAccountStatusPreset,
      setTradingAccountUsageOverride,
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
      tradingAccountCountPreset,
      tradingAccountDataPreset,
      tradingAccountScenario,
      tradingAccountStatusPreset,
      tradingAccountUsageOverride,
    };
  }, [
    authStatus,
    discoverLayoutItems,
    locale,
    pendingOrderDataPreset,
    positionDataPreset,
    profileAvatarId,
    role,
    selectedDiscoverModuleByRole,
    selectedTradingAccountId,
    systemColorScheme,
    themeMode,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
    tradingAccountUsageOverride,
  ]);

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
