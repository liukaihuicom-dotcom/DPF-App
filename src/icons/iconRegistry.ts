import type { ThemeColors } from '@/src/theme/colors';
import { iconsaxIconRegistry } from '@/src/icons/iconsaxRegistry.generated';

export type IconCategory =
  | 'account'
  | 'banking'
  | 'brand'
  | 'copy_trading'
  | 'data'
  | 'education'
  | 'ib_partner'
  | 'kyc_compliance'
  | 'library_asset'
  | 'navigation'
  | 'notification'
  | 'promotion'
  | 'review'
  | 'security'
  | 'status'
  | 'support'
  | 'system'
  | 'trading'
  | 'trading_account'
  | 'wallet';
export type IconPlatform = 'app' | 'h5' | 'web' | 'admin';
export type IconTone =
  | 'amber'
  | 'blue'
  | 'brand'
  | 'danger'
  | 'disabled'
  | 'down'
  | 'info'
  | 'inverse'
  | 'panel'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'tertiary'
  | 'text'
  | 'textDim'
  | 'textMuted'
  | 'up'
  | 'warning'
  | 'white';
export type IconSourceLibrary = 'phosphor' | 'remix' | 'lucide' | 'iconsax' | 'custom';
export type IconState = 'default' | 'active' | 'disabled' | 'success' | 'warning' | 'danger' | 'inverse';
export type IconStyleName = 'line' | 'fill' | 'duotone';

export type AppIconDefinition = {
  category: IconCategory;
  defaultSize: number;
  defaultCanvasSize?: number;
  defaultGlyphSize?: number;
  defaultTone: IconTone;
  forbidden: string[];
  legacyNames: string[];
  license: {
    attributionRequired: boolean;
    name: 'MIT' | 'ISC' | 'Remix Icon License v1.0' | 'Iconsax Free License' | 'custom-owned';
    url: string;
  };
  localAssetPath: string;
  meaning: string;
  modified: boolean;
  safeAreaInset?: number;
  shapeFit?: 'square' | 'rectangle' | 'circle' | 'balanced';
  platforms: IconPlatform[];
  registryScope?: 'semantic' | 'library_asset';
  sizes: readonly number[];
  sourceCategory?: string;
  sourceIconName: string;
  sourceLibrary: IconSourceLibrary;
  states: IconState[];
  status: 'approved' | 'deprecated' | 'blocked' | 'draft';
  style: {
    active: IconStyleName;
    default: IconStyleName;
    disabled: IconStyleName;
  };
  tokenBinding: {
    color: string;
    size: string;
  };
  toneTokens: IconTone[];
  usage: string[];
  viewBox?: number;
};

export const iconRegistry = {
  "icon.brand.apple": {
      "category": "brand",
      "defaultSize": 17,
      "defaultTone": "text",
      "forbidden": [
          "Do not recolor as risk or market status."
      ],
      "legacyNames": [
          "appApple"
      ],
      "license": {
          "attributionRequired": false,
          "name": "MIT",
          "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
      },
      "localAssetPath": "src/icons/local/phosphor/LocalAppleLogoIcon.tsx",
      "meaning": "Apple sign-in provider mark",
      "modified": false,
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "AppleLogo",
      "sourceLibrary": "phosphor",
      "states": [
          "default"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.sm"
      },
      "toneTokens": [
          "text"
      ],
      "usage": [
          "Apple sign-in provider mark.",
          "Apple sign-in provider mark"
      ]
  },
  "icon.wallet.withdrawal": {
      "category": "wallet",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "amber",
      "forbidden": [
          "Do not use for price trend.",
          "Do not use for refresh, exchange, or internal transfer."
      ],
      "legacyNames": [
          "actionRefresh",
          "walletWithdrawal"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Withdrawal, outgoing funds, payout request, or send-money transaction",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "MoneySend",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "warning",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.warning",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "amber",
          "danger",
          "text"
      ],
      "usage": [
          "Refresh or withdraw-style cyclical action when paired with label.",
          "Withdrawal, outgoing funds, payout request, or send-money transaction.",
          "Withdrawal, outgoing funds, payout request, or send-money transaction"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Money"
  },
  "icon.wallet.transfer": {
      "category": "wallet",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use for market volatility."
      ],
      "viewBox": 24,
      "legacyNames": [
          "transferSwitch"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Transfer, swap, or two-way movement between accounts",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "ArrowSwapHorizontal",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "disabled"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.info",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "blue",
          "text",
          "brand"
      ],
      "usage": [
          "Transfer, swap, or two-way movement between accounts.",
          "Transfer, swap, or two-way movement between accounts"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Arrow"
  },
  "icon.account.trading": {
      "category": "trading_account",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "blue",
      "forbidden": [
          "Avoid for generic profile, user switching, or archive action.",
          "Do not use for personal profile, bank institution, or one-off wallet balance."
      ],
      "viewBox": 24,
      "legacyNames": [
          "accountBank",
          "tradingAccount"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Trading account asset container, margin account identity, account switcher, and account list entry",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "UserTag",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.info",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "blue",
          "text",
          "brand"
      ],
      "usage": [
          "Trading account asset container, margin account identity, account switcher, and account list entry.",
          "Trading account asset container, margin account identity, account switcher, and account list entry"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Users"
  },
  "icon.notification.bell": {
      "category": "notification",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textMuted",
      "forbidden": [
          "Do not use for alert risk severity; use riskWarning/riskShield."
      ],
      "viewBox": 24,
      "legacyNames": [
          "notificationBell"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Notifications entry",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Notification",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "disabled"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.secondary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textMuted",
          "textDim"
      ],
      "usage": [
          "Notifications entry.",
          "Notifications entry"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Notifications"
  },
  "icon.system.chevron_down": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use as next navigation.",
          "Do not use shafted down arrows for dropdown controls."
      ],
      "viewBox": 24,
      "legacyNames": [
          "expandDown"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Dropdown or expandable control",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "ArrowDown2",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.tertiary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textDim"
      ],
      "usage": [
          "Dropdown or expandable control. Use the chevron-style down arrow without a shaft for global dropdown affordances.",
          "Dropdown or expandable control"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Arrow"
  },
  "icon.system.back": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "text",
      "forbidden": [
          "Do not use for previous market movement."
      ],
      "viewBox": 24,
      "legacyNames": [
          "navigateBack"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Back navigation",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "ArrowLeft",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "disabled"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textMuted"
      ],
      "usage": [
          "Back navigation.",
          "Back navigation"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Arrow"
  },
  "icon.system.chevron_right": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use for market up/down state."
      ],
      "viewBox": 24,
      "legacyNames": [
          "navigateNext"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Next row navigation and disclosure",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "ArrowRight2",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "disabled"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.tertiary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textDim",
          "panel"
      ],
      "usage": [
          "Next row navigation and disclosure.",
          "Next row navigation and disclosure"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Arrow"
  },
  "icon.trading.market": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Use up/down tones only when representing market direction."
      ],
      "viewBox": 24,
      "legacyNames": [
          "marketTrend"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Market trend, quote movement, chart entry, or trading direction",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "BusinessChart",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "success",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "up",
          "down",
          "text",
          "textDim"
      ],
      "usage": [
          "Market trend, quote movement, trading volume, or position direction.",
          "Market trend, quote movement, chart entry, or trading direction"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Business"
  },
  "icon.notification.feedback": {
      "category": "notification",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for community group."
      ],
      "viewBox": 24,
      "legacyNames": [
          "chatFeedback"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Feedback or single conversation entry",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "MessageText",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "textMuted"
      ],
      "usage": [
          "Feedback or single conversation entry.",
          "Feedback or single conversation entry"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Emails-Messages"
  },
  "icon.copy.community": {
      "category": "copy_trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textMuted",
      "forbidden": [
          "Do not use for individual support ticket."
      ],
      "viewBox": 24,
      "legacyNames": [
          "communityChat"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Community, group chat, or social trading discussions",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Profile2user",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.secondary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textMuted",
          "down",
          "brand"
      ],
      "usage": [
          "Community, group chat, or social trading discussions.",
          "Community, group chat, or social trading discussions"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Users"
  },
  "icon.status.check": {
      "category": "status",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textMuted",
      "forbidden": [
          "Do not use as full verification badge."
      ],
      "viewBox": 24,
      "legacyNames": [
          "checkMark"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Checkbox or compact selected indicator",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "TickCircle",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "success"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "panel",
          "white",
          "brand",
          "down"
      ],
      "usage": [
          "Checkbox or compact selected indicator.",
          "Checkbox or compact selected indicator"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.status.verified": {
      "category": "status",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for generic checkbox when checkMark is enough."
      ],
      "viewBox": 24,
      "legacyNames": [
          "statusVerified"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Verified state, selected account, completed status",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Verify",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "success",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "down",
          "text"
      ],
      "usage": [
          "Verified state, selected account, completed status.",
          "Verified state, selected account, completed status"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.trading.history": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "text",
      "forbidden": [
          "Do not use for countdown risk unless paired with warning tone."
      ],
      "viewBox": 24,
      "legacyNames": [
          "historyClock"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Order history, transaction history, pending activity, or time filter",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "TimeClock",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "warning"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textDim",
          "amber"
      ],
      "usage": [
          "Order history, pending review, recent activity, time filter.",
          "Order history, transaction history, pending activity, or time filter"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Time"
  },
  "icon.navigation.discover": {
      "category": "navigation",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for location."
      ],
      "viewBox": 24,
      "legacyNames": [
          "discoverCompass"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Discover and module exploration entry",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "EssetionalDiscover",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "textDim"
      ],
      "usage": [
          "Discover and module exploration entry.",
          "Discover and module exploration entry"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.system.more": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textMuted",
      "forbidden": [
          "Do not use for loading."
      ],
      "viewBox": 24,
      "legacyNames": [
          "moreDots"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "More actions menu",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "More",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.secondary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textMuted"
      ],
      "usage": [
          "More actions menu.",
          "More actions menu"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Settings"
  },
  "icon.notification.email": {
      "category": "notification",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for app notifications."
      ],
      "viewBox": 24,
      "legacyNames": [
          "emailMessage"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Email, inbox, password recovery",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Sms",
      "sourceLibrary": "iconsax",
      "states": [
          "default"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "textMuted"
      ],
      "usage": [
          "Email, inbox, password recovery.",
          "Email, inbox, password recovery"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Emails-Messages"
  },
  "icon.account.phone_verified": {
      "category": "account",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for voice support or customer service headset."
      ],
      "viewBox": 24,
      "legacyNames": [
          "phoneVerified"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Phone number entry, SMS verification, and confirmed phone contact",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Mobile",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "success"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "textMuted",
          "down"
      ],
      "usage": [
          "Phone number entry, SMS verification, and confirmed phone contact.",
          "Phone number entry, SMS verification, and confirmed phone contact"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Computers-Devices-Electronics"
  },
  "icon.promotion.reward": {
      "category": "promotion",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "amber",
      "forbidden": [
          "Do not use for trading ticket or coupon unless promo-specific."
      ],
      "viewBox": 24,
      "legacyNames": [
          "rewardGift"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Rewards, bonus, promotional gift",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Gift",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.warning",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "amber",
          "brand"
      ],
      "usage": [
          "Rewards, bonus, promotional gift.",
          "Rewards, bonus, promotional gift"
      ],
      "registryScope": "semantic",
      "sourceCategory": "School-Learning"
  },
  "icon.market.global": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use for account identity."
      ],
      "viewBox": 24,
      "legacyNames": [
          "globalMarket"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Global market, language, regional onboarding",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Global",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "panel"
      ],
      "usage": [
          "Global market, language, regional onboarding.",
          "Global market, language, regional onboarding"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Location"
  },
  "icon.education.academy": {
      "category": "education",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for KYC completion."
      ],
      "viewBox": 24,
      "legacyNames": [
          "educationCap"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Education, academy, trading lessons",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Teacher",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "success"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "textDim"
      ],
      "usage": [
          "Education, academy, trading lessons.",
          "Education, academy, trading lessons"
      ],
      "registryScope": "semantic",
      "sourceCategory": "School-Learning"
  },
  "icon.support.headset": {
      "category": "support",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textMuted",
      "forbidden": [
          "Do not use for audio/media."
      ],
      "viewBox": 24,
      "legacyNames": [
          "supportHeadset"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Support center or service contact",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Headphone",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.secondary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textMuted",
          "brand"
      ],
      "usage": [
          "Support center or service contact.",
          "Support center or service contact"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Computers-Devices-Electronics"
  },
  "icon.kyc.identity": {
      "category": "kyc_compliance",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for generic account tab."
      ],
      "viewBox": 24,
      "legacyNames": [
          "identityCard"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Identity verification, onboarding KYC, profile document",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Personalcard",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "warning",
          "success"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "down",
          "brand",
          "text"
      ],
      "usage": [
          "Identity verification, onboarding KYC, profile document.",
          "Identity verification, onboarding KYC, profile document"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Business"
  },
  "icon.risk.info": {
      "category": "status",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textMuted",
      "forbidden": [
          "Do not use as success status."
      ],
      "viewBox": 24,
      "legacyNames": [
          "infoCircle"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Inline help, disclosure, risk explanation",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "InfoCircle",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "warning",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.secondary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textMuted",
          "blue",
          "danger"
      ],
      "usage": [
          "Inline help, disclosure, risk explanation.",
          "Inline help, disclosure, risk explanation"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.market.watchlist": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "text",
      "forbidden": [
          "Do not use for task checklist."
      ],
      "viewBox": 24,
      "legacyNames": [
          "quoteList"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Watchlist, quote list, list view",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "ClipboardText",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textDim"
      ],
      "usage": [
          "Watchlist, quote list, list view.",
          "Watchlist, quote list, list view"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Content-Edit"
  },
  "icon.trading.order": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for plain market quote list.",
          "Do not use for task checklist or KYC checklist."
      ],
      "viewBox": 24,
      "legacyNames": [
          "taskChecklist",
          "orderList"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Order list, open orders, and order-based position grouping",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "TaskSquare",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "text",
          "textDim"
      ],
      "usage": [
          "Orders, trading journal, task checklist, execution list.",
          "Order list, open orders, and order-based position grouping.",
          "Order list, open orders, and order-based position grouping"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Content-Edit"
  },
  "icon.security.lock": {
      "category": "security",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use for regulatory review."
      ],
      "viewBox": 24,
      "legacyNames": [
          "secureLock"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Password, locked field, protected content",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Lock",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "danger",
          "success",
          "disabled"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.tertiary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textDim",
          "brand"
      ],
      "usage": [
          "Password, locked field, protected content.",
          "Password, locked field, protected content"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Security"
  },
  "icon.security.password_rules": {
      "category": "security",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for PIN keypad or account lock."
      ],
      "viewBox": 24,
      "legacyNames": [
          "passwordRules"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Password rule validation and credential setup guidance",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "PasswordCheck",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "warning",
          "success"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textDim",
          "brand",
          "down"
      ],
      "usage": [
          "Password rule validation and credential setup guidance.",
          "Password rule validation and credential setup guidance"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Security"
  },
  "icon.security.key_access": {
      "category": "security",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for password visibility toggle."
      ],
      "viewBox": 24,
      "legacyNames": [
          "keyAccess"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "PIN setup, unlock, or access-key semantics",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Key",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "success"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "textDim"
      ],
      "usage": [
          "PIN setup, unlock, or access-key semantics.",
          "PIN setup, unlock, or access-key semantics"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Security"
  },
  "icon.system.keyboard_digits": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use for text search or trading keyboard shortcuts."
      ],
      "viewBox": 24,
      "legacyNames": [
          "keyboardDigits"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Numeric keyboard, OTP input, or PIN keypad hint",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Keyboard",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.tertiary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textDim",
          "brand"
      ],
      "usage": [
          "Numeric keyboard, OTP input, or PIN keypad hint.",
          "Numeric keyboard, OTP input, or PIN keypad hint"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Computers-Devices-Electronics"
  },
  "icon.system.password_visible": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use for market watchlist visibility."
      ],
      "viewBox": 24,
      "legacyNames": [
          "showPassword"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Toggle password visibility in credential fields",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Eye",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.tertiary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textDim",
          "text"
      ],
      "usage": [
          "Toggle password visibility in credential fields.",
          "Toggle password visibility in credential fields"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Security"
  },
  "icon.system.search": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "text",
      "forbidden": [
          "Do not use for inspect/detail navigation."
      ],
      "viewBox": 24,
      "legacyNames": [
          "searchGlass"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Search entry and field prefix",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "SearchNormal",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "disabled"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textDim"
      ],
      "usage": [
          "Search entry and field prefix.",
          "Search entry and field prefix"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Search"
  },
  "icon.wallet.deposit": {
      "category": "wallet",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "down",
      "forbidden": [
          "Do not use for generic code/coupon.",
          "Do not use for account balance, wallet overview, or transfer between accounts."
      ],
      "viewBox": 24,
      "legacyNames": [
          "qrCode",
          "walletDeposit"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Deposit, incoming funds, successful credit, or receive-money transaction",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "MoneyRecive",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "success",
          "warning"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.success",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "down",
          "brand",
          "text"
      ],
      "usage": [
          "Deposit QR, account QR, scan code.",
          "Deposit, incoming funds, successful credit, or receive-money transaction.",
          "Deposit, incoming funds, successful credit, or receive-money transaction"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Money"
  },
  "icon.ib.network": {
      "category": "ib_partner",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for transfer funds."
      ],
      "viewBox": 24,
      "legacyNames": [
          "partnerNetwork"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Partner network, sharing, referral graph",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Share",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "blue",
          "text"
      ],
      "usage": [
          "Partner network, sharing, referral graph.",
          "Partner network, sharing, referral graph"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.security.risk_shield": {
      "category": "security",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use as generic success when statusVerified is clearer."
      ],
      "viewBox": 24,
      "legacyNames": [
          "riskShield"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Security, fraud prevention, compliance protection",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "ShieldTick",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "success",
          "warning"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "down",
          "textMuted"
      ],
      "usage": [
          "Security, fraud prevention, compliance protection.",
          "Security, fraud prevention, compliance protection"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Security"
  },
  "icon.system.settings": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use for market depth."
      ],
      "viewBox": 24,
      "legacyNames": [
          "settingsSliders"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Settings, filters, product controls, sort",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Setting2",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.tertiary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "textDim"
      ],
      "usage": [
          "Settings, filters, product controls, sort.",
          "Settings, filters, product controls, sort"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Settings"
  },
  "icon.promotion.ticket": {
      "category": "promotion",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "amber",
      "forbidden": [
          "Do not use for trading order ticket; use icon.trading.order."
      ],
      "viewBox": 24,
      "legacyNames": [
          "promoTicket"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Coupon, promotion, simulated contest badge",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Ticket",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.warning",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "amber",
          "textDim"
      ],
      "usage": [
          "Coupon, promotion, simulated contest badge.",
          "Coupon, promotion, simulated contest badge"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Money"
  },
  "icon.promotion.achievement": {
      "category": "promotion",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "amber",
      "forbidden": [
          "Do not use for account status."
      ],
      "viewBox": 24,
      "legacyNames": [
          "achievementTrophy"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Challenge, leaderboard, achievement",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Cup",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.warning",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "amber",
          "textDim"
      ],
      "usage": [
          "Challenge, leaderboard, achievement.",
          "Challenge, leaderboard, achievement"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.account.user": {
      "category": "account",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "text",
      "forbidden": [
          "Do not use for bank/funding account."
      ],
      "viewBox": 24,
      "legacyNames": [
          "userProfile"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "User, client, account owner, profile preview",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "User",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "blue"
      ],
      "usage": [
          "User, client, account owner, profile preview.",
          "User, client, account owner, profile preview"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Users"
  },
  "icon.account.avatar": {
      "category": "account",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "text",
      "forbidden": [
          "Do not use for add-account action."
      ],
      "viewBox": 24,
      "legacyNames": [
          "userAvatar"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Profile avatar placeholder and profile module",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "ProfileCircle",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textMuted"
      ],
      "usage": [
          "Profile avatar placeholder and profile module.",
          "Profile avatar placeholder and profile module"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Users"
  },
  "icon.account.add_user": {
      "category": "account",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "text",
      "forbidden": [
          "Do not use for KYC verification."
      ],
      "viewBox": 24,
      "legacyNames": [
          "addUser"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Add account, add client, invite user",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "UserAdd",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "brand"
      ],
      "usage": [
          "Add account, add client, invite user.",
          "Add account, add client, invite user"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Users"
  },
  "icon.system.close": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use as failed status without label."
      ],
      "viewBox": 24,
      "legacyNames": [
          "closeX"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Close, cancel, dismiss, or destructive close when paired with danger tone",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "CloseCircle",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.tertiary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textDim",
          "danger",
          "panel"
      ],
      "usage": [
          "Close, cancel, dismiss, delete when paired with danger tone.",
          "Close, cancel, dismiss, or destructive close when paired with danger tone"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.wallet.balance": {
      "category": "wallet",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "blue",
      "forbidden": [
          "Do not use for bank institution, deposit action, or archive action."
      ],
      "viewBox": 24,
      "legacyNames": [
          "accountBalance"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Account balance, available funds, equity snapshot, and wallet balance detail",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Wallet",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.info",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "blue",
          "text",
          "brand"
      ],
      "usage": [
          "Account balance, available funds, equity snapshot, and wallet balance detail.",
          "Account balance, available funds, equity snapshot, and wallet balance detail"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Money"
  },
  "icon.account.archive": {
      "category": "account",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "text",
      "forbidden": [
          "Do not use for wallet, balance, delete, or download."
      ],
      "viewBox": 24,
      "legacyNames": [
          "archiveAccount"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Archive or hide a trading account from active lists",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "EssetionalArchive",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textDim"
      ],
      "usage": [
          "Archive or hide a trading account from active lists.",
          "Archive or hide a trading account from active lists"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.system.delete": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "danger",
      "forbidden": [
          "Do not use for modal close or temporary dismiss."
      ],
      "viewBox": 24,
      "legacyNames": [
          "destructiveDelete"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Delete, remove, or irreversible destructive action",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Trash",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.danger",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "danger",
          "text"
      ],
      "usage": [
          "Delete, remove, or irreversible destructive action.",
          "Delete, remove, or irreversible destructive action"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.system.logout": {
      "category": "system",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "danger",
      "forbidden": [
          "Do not use for deleting account data or closing a modal."
      ],
      "viewBox": 24,
      "legacyNames": [
          "logoutSession"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Log out of the current session while preserving remembered account identity",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Logout",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.danger",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "danger",
          "textDim",
          "text"
      ],
      "usage": [
          "Log out of the current session while preserving remembered account identity.",
          "Log out of the current session while preserving remembered account identity"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Arrow"
  },
  "icon.trading.order_ticket": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for market watchlist or transaction history."
      ],
      "viewBox": 24,
      "legacyNames": [
          "tradeTicket"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Trade ticket, market order entry, and order creation flow",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "ReceiptText",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "up",
          "down",
          "text"
      ],
      "usage": [
          "Trade ticket, market order entry, and order creation flow.",
          "Trade ticket, market order entry, and order creation flow"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Money"
  },
  "icon.trading.group_by_symbol": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textDim",
      "forbidden": [
          "Do not use for QR code, scan, or payment address."
      ],
      "viewBox": 24,
      "legacyNames": [
          "groupBySymbol"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Sort or group positions by trading symbol",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Sort",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.tertiary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "textDim",
          "brand"
      ],
      "usage": [
          "Sort or group positions by trading symbol.",
          "Sort or group positions by trading symbol"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.trading.close_position": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "danger",
      "forbidden": [
          "Do not use for modal close; use icon.system.close for dismissal."
      ],
      "viewBox": 24,
      "legacyNames": [
          "closePosition"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Close all positions or cancel an active trading exposure",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "CloseCircle",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.danger",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "danger",
          "textDim"
      ],
      "usage": [
          "Close all positions or cancel an active trading exposure.",
          "Close all positions or cancel an active trading exposure"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.trading.close_losing_position": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "danger",
      "forbidden": [
          "Do not use for successful verification or completed status."
      ],
      "viewBox": 24,
      "legacyNames": [
          "closeLosingPosition"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Close losing positions, stop-loss related action, or downside exposure reduction",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "TrendDown",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.danger",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "danger",
          "amber"
      ],
      "usage": [
          "Close losing positions, stop-loss related action, or downside exposure reduction.",
          "Close losing positions, stop-loss related action, or downside exposure reduction"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Business"
  },
  "icon.trading.buy": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "down",
      "forbidden": [
          "Do not use for generic market trend without an actual buy direction."
      ],
      "viewBox": 24,
      "legacyNames": [
          "tradeBuy"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Buy direction marker in positions and order details",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "TrendUp",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "success"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.success",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "down",
          "brand"
      ],
      "usage": [
          "Buy direction marker in positions and order details.",
          "Buy direction marker in positions and order details"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Business"
  },
  "icon.trading.sell": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "up",
      "forbidden": [
          "Do not use for generic market trend without an actual sell direction."
      ],
      "viewBox": 24,
      "legacyNames": [
          "tradeSell"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Sell direction marker in positions and order details",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "TrendDown",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.danger",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "up",
          "danger"
      ],
      "usage": [
          "Sell direction marker in positions and order details.",
          "Sell direction marker in positions and order details"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Business"
  },
  "icon.status.rejected": {
      "category": "status",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "danger",
      "forbidden": [
          "Do not use for user-close or dismiss actions."
      ],
      "viewBox": 24,
      "legacyNames": [
          "statusRejected"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Rejected, failed, or blocked status in financial workflows",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "CloseCircle",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "danger"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.danger",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "danger",
          "textDim"
      ],
      "usage": [
          "Rejected, failed, or blocked status in financial workflows.",
          "Rejected, failed, or blocked status in financial workflows"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.feedback.rating": {
      "category": "support",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "amber",
      "forbidden": [
          "Do not use for challenge award, promotion, or verified status."
      ],
      "viewBox": 24,
      "legacyNames": [
          "appRating"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "App rating or satisfaction scoring entry",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Star",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.warning",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "amber",
          "textDim"
      ],
      "usage": [
          "App rating or satisfaction scoring entry.",
          "App rating or satisfaction scoring entry"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Support-Like-Question"
  },
  "icon.support.help_center": {
      "category": "support",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textMuted",
      "forbidden": [
          "Do not use for regulatory disclosure; use icon.risk.info."
      ],
      "viewBox": 24,
      "legacyNames": [
          "helpCenter"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Help center, FAQ, and guided assistance",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "MessageQuestion",
      "sourceLibrary": "iconsax",
      "states": [
          "default"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.secondary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textMuted",
          "brand"
      ],
      "usage": [
          "Help center, FAQ, and guided assistance.",
          "Help center, FAQ, and guided assistance"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Support-Like-Question"
  },
  "icon.support.about": {
      "category": "support",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "textMuted",
      "forbidden": [
          "Do not use for risk warning or inline disclosure."
      ],
      "viewBox": 24,
      "legacyNames": [
          "aboutApp"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "About app, product information, and company information entry",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "circle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "InfoCircle",
      "sourceLibrary": "iconsax",
      "states": [
          "default"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.secondary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "textMuted",
          "brand"
      ],
      "usage": [
          "About app, product information, and company information entry.",
          "About app, product information, and company information entry"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Essetional"
  },
  "icon.navigation.function_center": {
      "category": "navigation",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for trading orders or task checklist."
      ],
      "viewBox": 24,
      "legacyNames": [
          "functionCenter"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Function center, app module dashboard, or shortcut hub",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Element4",
      "sourceLibrary": "iconsax",
      "states": [
          "default",
          "active"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "textDim"
      ],
      "usage": [
          "Function center, app module dashboard, or shortcut hub.",
          "Function center, app module dashboard, or shortcut hub"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Grid"
  },
  "icon.trading.volume": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "brand",
      "forbidden": [
          "Do not use for price trend or market direction."
      ],
      "viewBox": 24,
      "legacyNames": [
          "tradeVolume"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Trading volume, analytics volume metric, and aggregated activity size",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "balanced",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Chart2",
      "sourceLibrary": "iconsax",
      "states": [
          "default"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.active",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "brand",
          "text",
          "textDim"
      ],
      "usage": [
          "Trading volume, analytics volume metric, and aggregated activity size.",
          "Trading volume, analytics volume metric, and aggregated activity size"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Business"
  },
  "icon.market.gold": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "amber",
      "forbidden": [
          "Do not use for deposit, reward, or balance."
      ],
      "viewBox": 24,
      "legacyNames": [
          "goldCommodity"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Gold, metals, and commodity instrument visual",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "square",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Coin",
      "sourceLibrary": "iconsax",
      "states": [
          "default"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.warning",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "amber",
          "brand"
      ],
      "usage": [
          "Gold, metals, and commodity instrument visual.",
          "Gold, metals, and commodity instrument visual"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Money"
  },
  "icon.market.index": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "blue",
      "forbidden": [
          "Do not use for account analytics or volume metric."
      ],
      "viewBox": 24,
      "legacyNames": [
          "indexMarket"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Index, futures, and benchmark market instrument visual",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "Chart1",
      "sourceLibrary": "iconsax",
      "states": [
          "default"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.info",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "blue",
          "brand",
          "text"
      ],
      "usage": [
          "Index, futures, and benchmark market instrument visual.",
          "Index, futures, and benchmark market instrument visual"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Business"
  },
  "icon.market.stock": {
      "category": "trading",
      "defaultSize": 24,
      "defaultCanvasSize": 24,
      "defaultGlyphSize": 21,
      "defaultTone": "text",
      "forbidden": [
          "Do not use proprietary company logos as functional instrument icons."
      ],
      "viewBox": 24,
      "legacyNames": [
          "stockAsset"
      ],
      "license": {
          "attributionRequired": false,
          "name": "Iconsax Free License",
          "url": "https://docs.iconsax.io/license-and-terms/license"
      },
      "localAssetPath": "src/icons/local/iconsax/iconsaxGeneratedIcons.tsx",
      "meaning": "Stock and equity instrument visual without brand-logo copying",
      "modified": false,
      "safeAreaInset": 1.5,
      "shapeFit": "rectangle",
      "platforms": [
          "app",
          "h5",
          "web"
      ],
      "sizes": [
          8,
          12,
          16,
          20,
          24,
          32,
          40,
          48,
          64
      ],
      "sourceIconName": "BusinessChart",
      "sourceLibrary": "iconsax",
      "states": [
          "default"
      ],
      "status": "approved",
      "style": {
          "default": "line",
          "active": "fill",
          "disabled": "line"
      },
      "tokenBinding": {
          "color": "color.icon.primary",
          "size": "size.icon.md"
      },
      "toneTokens": [
          "text",
          "brand",
          "blue"
      ],
      "usage": [
          "Stock and equity instrument visual without brand-logo copying.",
          "Stock and equity instrument visual without brand-logo copying"
      ],
      "registryScope": "semantic",
      "sourceCategory": "Business"
  },
  ...iconsaxIconRegistry,
} as const satisfies Record<string, AppIconDefinition>;

export const legacyIconNameMap = {
  "appApple": "icon.brand.apple",
  "actionRefresh": "icon.wallet.withdrawal",
  "transferSwitch": "icon.wallet.transfer",
  "accountBank": "icon.account.trading",
  "notificationBell": "icon.notification.bell",
  "expandDown": "icon.system.chevron_down",
  "navigateBack": "icon.system.back",
  "navigateNext": "icon.system.chevron_right",
  "marketTrend": "icon.trading.market",
  "chatFeedback": "icon.notification.feedback",
  "communityChat": "icon.copy.community",
  "checkMark": "icon.status.check",
  "statusVerified": "icon.status.verified",
  "historyClock": "icon.trading.history",
  "discoverCompass": "icon.navigation.discover",
  "moreDots": "icon.system.more",
  "emailMessage": "icon.notification.email",
  "phoneVerified": "icon.account.phone_verified",
  "rewardGift": "icon.promotion.reward",
  "globalMarket": "icon.market.global",
  "educationCap": "icon.education.academy",
  "supportHeadset": "icon.support.headset",
  "identityCard": "icon.kyc.identity",
  "quoteList": "icon.market.watchlist",
  "taskChecklist": "icon.trading.order",
  "secureLock": "icon.security.lock",
  "passwordRules": "icon.security.password_rules",
  "keyAccess": "icon.security.key_access",
  "keyboardDigits": "icon.system.keyboard_digits",
  "showPassword": "icon.system.password_visible",
  "searchGlass": "icon.system.search",
  "qrCode": "icon.wallet.deposit",
  "partnerNetwork": "icon.ib.network",
  "riskShield": "icon.security.risk_shield",
  "settingsSliders": "icon.system.settings",
  "promoTicket": "icon.promotion.ticket",
  "achievementTrophy": "icon.promotion.achievement",
  "userProfile": "icon.account.user",
  "userAvatar": "icon.account.avatar",
  "addUser": "icon.account.add_user",
  "walletDeposit": "icon.wallet.deposit",
  "walletWithdrawal": "icon.wallet.withdrawal",
  "accountBalance": "icon.wallet.balance",
  "tradingAccount": "icon.account.trading",
  "archiveAccount": "icon.account.archive",
  "destructiveDelete": "icon.system.delete",
  "logoutSession": "icon.system.logout",
  "tradeTicket": "icon.trading.order_ticket",
  "orderList": "icon.trading.order",
  "groupBySymbol": "icon.trading.group_by_symbol",
  "closePosition": "icon.trading.close_position",
  "closeLosingPosition": "icon.trading.close_losing_position",
  "tradeBuy": "icon.trading.buy",
  "tradeSell": "icon.trading.sell",
  "statusRejected": "icon.status.rejected",
  "appRating": "icon.feedback.rating",
  "helpCenter": "icon.support.help_center",
  "aboutApp": "icon.support.about",
  "functionCenter": "icon.navigation.function_center",
  "tradeVolume": "icon.trading.volume",
  "goldCommodity": "icon.market.gold",
  "indexMarket": "icon.market.index",
  "stockAsset": "icon.market.stock",
  "infoCircle": "icon.risk.info",
  "closeX": "icon.system.close"
} as const;

export type AppIconName = keyof typeof iconRegistry;
export type LegacyAppIconName = keyof typeof legacyIconNameMap;

export function isAppIconName(name: string): name is AppIconName {
  return name in iconRegistry;
}

export function resolveIconName(name: AppIconName | LegacyAppIconName): AppIconName {
  return (name in iconRegistry ? name : legacyIconNameMap[name as LegacyAppIconName]) as AppIconName;
}

export function resolveIconTone(colors: ThemeColors, tone: IconTone): string {
  switch (tone) {
    case 'danger':
      return colors.icon.danger;
    case 'disabled':
      return colors.icon.disabled;
    case 'down':
      return colors.icon.marketDown;
    case 'success':
      return colors.icon.success;
    case 'inverse':
    case 'panel':
    case 'white':
      return colors.icon.inverse;
    case 'up':
      return colors.icon.marketUp;
    case 'amber':
    case 'warning':
      return colors.icon.warning;
    case 'blue':
    case 'info':
      return colors.icon.info;
    case 'brand':
      return colors.icon.active;
    case 'primary':
    case 'text':
      return colors.icon.primary;
    case 'secondary':
    case 'textDim':
      return colors.icon.secondary;
    case 'tertiary':
    case 'textMuted':
      return colors.icon.tertiary;
    default:
      return colors.icon.primary;
  }
}
