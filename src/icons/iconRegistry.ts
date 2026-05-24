import type { ThemeColors } from '@/src/theme/colors';

export type IconCategory =
  | 'account'
  | 'banking'
  | 'brand'
  | 'copy_trading'
  | 'data'
  | 'education'
  | 'ib_partner'
  | 'kyc_compliance'
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
  | 'success'
  | 'text'
  | 'textDim'
  | 'textMuted'
  | 'up'
  | 'warning'
  | 'white';
export type IconSourceLibrary = 'phosphor' | 'remix' | 'lucide' | 'custom';
export type IconState = 'default' | 'active' | 'disabled' | 'success' | 'warning' | 'danger' | 'inverse';
export type IconStyleName = 'line' | 'fill' | 'duotone';

export type AppIconDefinition = {
  category: IconCategory;
  defaultSize: number;
  defaultTone: IconTone;
  forbidden: string[];
  legacyNames: string[];
  license: {
    attributionRequired: boolean;
    name: 'MIT' | 'ISC' | 'Remix Icon License v1.0' | 'custom-owned';
    url: string;
  };
  localAssetPath: string;
  meaning: string;
  modified: boolean;
  platforms: IconPlatform[];
  sizes: readonly number[];
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
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalHandWithdrawIcon.tsx",
    "meaning": "Withdrawal, outgoing funds, payout request, or send-money transaction",
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
    "sourceIconName": "HandWithdraw",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.wallet.transfer": {
    "category": "wallet",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use for market volatility."
    ],
    "legacyNames": [
      "transferSwitch"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalArrowsLeftRightIcon.tsx",
    "meaning": "Transfer, swap, or two-way movement between accounts",
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
    "sourceIconName": "ArrowsLeftRight",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.account.trading": {
    "category": "trading_account",
    "defaultSize": 24,
    "defaultTone": "blue",
    "forbidden": [
      "Avoid for generic profile, user switching, or archive action.",
      "Do not use for personal profile, bank institution, or one-off wallet balance."
    ],
    "legacyNames": [
      "accountBank",
      "tradingAccount"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalVaultIcon.tsx",
    "meaning": "Trading account asset container, margin account identity, account switcher, and account list entry",
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
    "sourceIconName": "Vault",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.notification.bell": {
    "category": "notification",
    "defaultSize": 24,
    "defaultTone": "textMuted",
    "forbidden": [
      "Do not use for alert risk severity; use riskWarning/riskShield."
    ],
    "legacyNames": [
      "notificationBell"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalBellIcon.tsx",
    "meaning": "Notifications entry",
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
    "sourceIconName": "Bell",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.system.chevron_down": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use as next navigation.",
      "Do not use shafted down arrows for dropdown controls."
    ],
    "legacyNames": [
      "expandDown"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalChevronDownIcon.tsx",
    "meaning": "Dropdown or expandable control",
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
    "sourceIconName": "ChevronDown",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.system.back": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "text",
    "forbidden": [
      "Do not use for previous market movement."
    ],
    "legacyNames": [
      "navigateBack"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalArrowLeftIcon.tsx",
    "meaning": "Back navigation",
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
    "sourceIconName": "ArrowLeft",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.system.chevron_right": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use for market up/down state."
    ],
    "legacyNames": [
      "navigateNext"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalChevronRightIcon.tsx",
    "meaning": "Next row navigation and disclosure",
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
    "sourceIconName": "ChevronRight",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.trading.market": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Use up/down tones only when representing market direction."
    ],
    "legacyNames": [
      "marketTrend"
    ],
    "license": {
      "attributionRequired": false,
      "name": "Remix Icon License v1.0",
      "url": "https://github.com/Remix-Design/RemixIcon/blob/master/License"
    },
    "localAssetPath": "src/icons/local/remix/LocalStockLineIcon.tsx",
    "meaning": "Market trend, quote movement, chart entry, or trading direction",
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
    "sourceIconName": "stock-line",
    "sourceLibrary": "remix",
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
    ]
  },
  "icon.notification.feedback": {
    "category": "notification",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for community group."
    ],
    "legacyNames": [
      "chatFeedback"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalChatCircleIcon.tsx",
    "meaning": "Feedback or single conversation entry",
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
    "sourceIconName": "ChatCircle",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.copy.community": {
    "category": "copy_trading",
    "defaultSize": 24,
    "defaultTone": "textMuted",
    "forbidden": [
      "Do not use for individual support ticket."
    ],
    "legacyNames": [
      "communityChat"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalUsersThreeIcon.tsx",
    "meaning": "Community, group chat, or social trading discussions",
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
    "sourceIconName": "UsersThree",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.status.check": {
    "category": "status",
    "defaultSize": 24,
    "defaultTone": "textMuted",
    "forbidden": [
      "Do not use as full verification badge."
    ],
    "legacyNames": [
      "checkMark"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalCheckIcon.tsx",
    "meaning": "Checkbox or compact selected indicator",
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
    "sourceIconName": "Check",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.status.verified": {
    "category": "status",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for generic checkbox when checkMark is enough."
    ],
    "legacyNames": [
      "statusVerified"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalSealCheckIcon.tsx",
    "meaning": "Verified state, selected account, completed status",
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
    "sourceIconName": "SealCheck",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.trading.history": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "text",
    "forbidden": [
      "Do not use for countdown risk unless paired with warning tone."
    ],
    "legacyNames": [
      "historyClock"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalHistoryIcon.tsx",
    "meaning": "Order history, transaction history, pending activity, or time filter",
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
    "sourceIconName": "History",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.navigation.discover": {
    "category": "navigation",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for location."
    ],
    "legacyNames": [
      "discoverCompass"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalCompassIcon.tsx",
    "meaning": "Discover and module exploration entry",
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
    "sourceIconName": "Compass",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.system.more": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "textMuted",
    "forbidden": [
      "Do not use for loading."
    ],
    "legacyNames": [
      "moreDots"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalEllipsisIcon.tsx",
    "meaning": "More actions menu",
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
    "sourceIconName": "Ellipsis",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.notification.email": {
    "category": "notification",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for app notifications."
    ],
    "legacyNames": [
      "emailMessage"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalEnvelopeOpenIcon.tsx",
    "meaning": "Email, inbox, password recovery",
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
    "sourceIconName": "EnvelopeOpen",
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
    ]
  },
  "icon.account.phone_verified": {
    "category": "account",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for voice support or customer service headset."
    ],
    "legacyNames": [
      "phoneVerified"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalSmartphoneNfcIcon.tsx",
    "meaning": "Phone number entry, SMS verification, and confirmed phone contact",
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
    "sourceIconName": "SmartphoneNfc",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.promotion.reward": {
    "category": "promotion",
    "defaultSize": 24,
    "defaultTone": "amber",
    "forbidden": [
      "Do not use for trading ticket or coupon unless promo-specific."
    ],
    "legacyNames": [
      "rewardGift"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalGiftIcon.tsx",
    "meaning": "Rewards, bonus, promotional gift",
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
    "sourceIconName": "Gift",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.market.global": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use for account identity."
    ],
    "legacyNames": [
      "globalMarket"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalGlobeHemisphereWestIcon.tsx",
    "meaning": "Global market, language, regional onboarding",
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
    "sourceIconName": "GlobeHemisphereWest",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.education.academy": {
    "category": "education",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for KYC completion."
    ],
    "legacyNames": [
      "educationCap"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalStudentIcon.tsx",
    "meaning": "Education, academy, trading lessons",
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
    "sourceIconName": "Student",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.support.headset": {
    "category": "support",
    "defaultSize": 24,
    "defaultTone": "textMuted",
    "forbidden": [
      "Do not use for audio/media."
    ],
    "legacyNames": [
      "supportHeadset"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalHeadsetIcon.tsx",
    "meaning": "Support center or service contact",
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
    "sourceIconName": "Headset",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.kyc.identity": {
    "category": "kyc_compliance",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for generic account tab."
    ],
    "legacyNames": [
      "identityCard"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalIdentificationCardIcon.tsx",
    "meaning": "Identity verification, onboarding KYC, profile document",
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
    "sourceIconName": "IdentificationCard",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.risk.info": {
    "category": "status",
    "defaultSize": 24,
    "defaultTone": "textMuted",
    "forbidden": [
      "Do not use as success status."
    ],
    "legacyNames": [
      "infoCircle"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalInfoIcon.tsx",
    "meaning": "Inline help, disclosure, risk explanation",
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
    "sourceIconName": "Info",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.market.watchlist": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "text",
    "forbidden": [
      "Do not use for task checklist."
    ],
    "legacyNames": [
      "quoteList"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalListBulletsIcon.tsx",
    "meaning": "Watchlist, quote list, list view",
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
    "sourceIconName": "ListBullets",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.trading.order": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for plain market quote list.",
      "Do not use for task checklist or KYC checklist."
    ],
    "legacyNames": [
      "taskChecklist",
      "orderList"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalListChecksIcon.tsx",
    "meaning": "Order list, open orders, and order-based position grouping",
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
    "sourceIconName": "ListChecks",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.security.lock": {
    "category": "security",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use for regulatory review."
    ],
    "legacyNames": [
      "secureLock"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalLockKeyIcon.tsx",
    "meaning": "Password, locked field, protected content",
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
    "sourceIconName": "LockKey",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.security.password_rules": {
    "category": "security",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for PIN keypad or account lock."
    ],
    "legacyNames": [
      "passwordRules"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalPasswordIcon.tsx",
    "meaning": "Password rule validation and credential setup guidance",
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
    "sourceIconName": "Password",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.security.key_access": {
    "category": "security",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for password visibility toggle."
    ],
    "legacyNames": [
      "keyAccess"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalKeyRoundIcon.tsx",
    "meaning": "PIN setup, unlock, or access-key semantics",
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
    "sourceIconName": "KeyRound",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.system.keyboard_digits": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use for text search or trading keyboard shortcuts."
    ],
    "legacyNames": [
      "keyboardDigits"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalKeyboardIcon.tsx",
    "meaning": "Numeric keyboard, OTP input, or PIN keypad hint",
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
    "sourceIconName": "Keyboard",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.system.password_visible": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use for market watchlist visibility."
    ],
    "legacyNames": [
      "showPassword"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalEyeIcon.tsx",
    "meaning": "Toggle password visibility in credential fields",
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
    "sourceIconName": "Eye",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.system.search": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "text",
    "forbidden": [
      "Do not use for inspect/detail navigation."
    ],
    "legacyNames": [
      "searchGlass"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalSearchIcon.tsx",
    "meaning": "Search entry and field prefix",
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
    "sourceIconName": "Search",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.wallet.deposit": {
    "category": "wallet",
    "defaultSize": 24,
    "defaultTone": "down",
    "forbidden": [
      "Do not use for generic code/coupon.",
      "Do not use for account balance, wallet overview, or transfer between accounts."
    ],
    "legacyNames": [
      "qrCode",
      "walletDeposit"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalHandDepositIcon.tsx",
    "meaning": "Deposit, incoming funds, successful credit, or receive-money transaction",
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
    "sourceIconName": "HandDeposit",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.ib.network": {
    "category": "ib_partner",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for transfer funds."
    ],
    "legacyNames": [
      "partnerNetwork"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalShareNetworkIcon.tsx",
    "meaning": "Partner network, sharing, referral graph",
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
    "sourceIconName": "ShareNetwork",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.security.risk_shield": {
    "category": "security",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use as generic success when statusVerified is clearer."
    ],
    "legacyNames": [
      "riskShield"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalShieldCheckIcon.tsx",
    "meaning": "Security, fraud prevention, compliance protection",
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
    "sourceIconName": "ShieldCheck",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.system.settings": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use for market depth."
    ],
    "legacyNames": [
      "settingsSliders"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalSlidersHorizontalIcon.tsx",
    "meaning": "Settings, filters, product controls, sort",
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
    "sourceIconName": "SlidersHorizontal",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.promotion.ticket": {
    "category": "promotion",
    "defaultSize": 24,
    "defaultTone": "amber",
    "forbidden": [
      "Do not use for trading order ticket; use icon.trading.order."
    ],
    "legacyNames": [
      "promoTicket"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalTicketIcon.tsx",
    "meaning": "Coupon, promotion, simulated contest badge",
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
    "sourceIconName": "Ticket",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.promotion.achievement": {
    "category": "promotion",
    "defaultSize": 24,
    "defaultTone": "amber",
    "forbidden": [
      "Do not use for account status."
    ],
    "legacyNames": [
      "achievementTrophy"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalTrophyIcon.tsx",
    "meaning": "Challenge, leaderboard, achievement",
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
    "sourceIconName": "Trophy",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.account.user": {
    "category": "account",
    "defaultSize": 24,
    "defaultTone": "text",
    "forbidden": [
      "Do not use for bank/funding account."
    ],
    "legacyNames": [
      "userProfile"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalUserIcon.tsx",
    "meaning": "User, client, account owner, profile preview",
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
    "sourceIconName": "User",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.account.avatar": {
    "category": "account",
    "defaultSize": 24,
    "defaultTone": "text",
    "forbidden": [
      "Do not use for add-account action."
    ],
    "legacyNames": [
      "userAvatar"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalUserCircleIcon.tsx",
    "meaning": "Profile avatar placeholder and profile module",
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
    "sourceIconName": "UserCircle",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.account.add_user": {
    "category": "account",
    "defaultSize": 24,
    "defaultTone": "text",
    "forbidden": [
      "Do not use for KYC verification."
    ],
    "legacyNames": [
      "addUser"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalUserCirclePlusIcon.tsx",
    "meaning": "Add account, add client, invite user",
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
    "sourceIconName": "UserCirclePlus",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.system.close": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use as failed status without label."
    ],
    "legacyNames": [
      "closeX"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalXIcon.tsx",
    "meaning": "Close, cancel, dismiss, or destructive close when paired with danger tone",
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
    "sourceIconName": "X",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.wallet.balance": {
    "category": "wallet",
    "defaultSize": 24,
    "defaultTone": "blue",
    "forbidden": [
      "Do not use for bank institution, deposit action, or archive action."
    ],
    "legacyNames": [
      "accountBalance"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalWalletIcon.tsx",
    "meaning": "Account balance, available funds, equity snapshot, and wallet balance detail",
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
    "sourceIconName": "Wallet",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.account.archive": {
    "category": "account",
    "defaultSize": 24,
    "defaultTone": "text",
    "forbidden": [
      "Do not use for wallet, balance, delete, or download."
    ],
    "legacyNames": [
      "archiveAccount"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalArchiveIcon.tsx",
    "meaning": "Archive or hide a trading account from active lists",
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
    "sourceIconName": "Archive",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.system.delete": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "danger",
    "forbidden": [
      "Do not use for modal close or temporary dismiss."
    ],
    "legacyNames": [
      "destructiveDelete"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalTrash2Icon.tsx",
    "meaning": "Delete, remove, or irreversible destructive action",
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
    "sourceIconName": "Trash2",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.system.logout": {
    "category": "system",
    "defaultSize": 24,
    "defaultTone": "danger",
    "forbidden": [
      "Do not use for deleting account data or closing a modal."
    ],
    "legacyNames": [
      "logoutSession"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalLogOutIcon.tsx",
    "meaning": "Log out of the current session while preserving remembered account identity",
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
    "sourceIconName": "LogOut",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.trading.order_ticket": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for market watchlist or transaction history."
    ],
    "legacyNames": [
      "tradeTicket"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalReceiptIcon.tsx",
    "meaning": "Trade ticket, market order entry, and order creation flow",
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
    "sourceIconName": "Receipt",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.trading.group_by_symbol": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "textDim",
    "forbidden": [
      "Do not use for QR code, scan, or payment address."
    ],
    "legacyNames": [
      "groupBySymbol"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalSortAscendingIcon.tsx",
    "meaning": "Sort or group positions by trading symbol",
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
    "sourceIconName": "SortAscending",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.trading.close_position": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "danger",
    "forbidden": [
      "Do not use for modal close; use icon.system.close for dismissal."
    ],
    "legacyNames": [
      "closePosition"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalXCircleIcon.tsx",
    "meaning": "Close all positions or cancel an active trading exposure",
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
    "sourceIconName": "XCircle",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.trading.close_losing_position": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "danger",
    "forbidden": [
      "Do not use for successful verification or completed status."
    ],
    "legacyNames": [
      "closeLosingPosition"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalTrendDownIcon.tsx",
    "meaning": "Close losing positions, stop-loss related action, or downside exposure reduction",
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
    "sourceIconName": "TrendDown",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.trading.buy": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "down",
    "forbidden": [
      "Do not use for generic market trend without an actual buy direction."
    ],
    "legacyNames": [
      "tradeBuy"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalChartLineUpIcon.tsx",
    "meaning": "Buy direction marker in positions and order details",
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
    "sourceIconName": "ChartLineUp",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.trading.sell": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "up",
    "forbidden": [
      "Do not use for generic market trend without an actual sell direction."
    ],
    "legacyNames": [
      "tradeSell"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalChartLineDownIcon.tsx",
    "meaning": "Sell direction marker in positions and order details",
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
    "sourceIconName": "ChartLineDown",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.status.rejected": {
    "category": "status",
    "defaultSize": 24,
    "defaultTone": "danger",
    "forbidden": [
      "Do not use for user-close or dismiss actions."
    ],
    "legacyNames": [
      "statusRejected"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalCircleXIcon.tsx",
    "meaning": "Rejected, failed, or blocked status in financial workflows",
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
    "sourceIconName": "CircleX",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.feedback.rating": {
    "category": "support",
    "defaultSize": 24,
    "defaultTone": "amber",
    "forbidden": [
      "Do not use for challenge award, promotion, or verified status."
    ],
    "legacyNames": [
      "appRating"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalStarIcon.tsx",
    "meaning": "App rating or satisfaction scoring entry",
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
    "sourceIconName": "Star",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.support.help_center": {
    "category": "support",
    "defaultSize": 24,
    "defaultTone": "textMuted",
    "forbidden": [
      "Do not use for regulatory disclosure; use icon.risk.info."
    ],
    "legacyNames": [
      "helpCenter"
    ],
    "license": {
      "attributionRequired": false,
      "name": "ISC",
      "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/lucide/LocalCircleQuestionMarkIcon.tsx",
    "meaning": "Help center, FAQ, and guided assistance",
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
    "sourceIconName": "CircleQuestionMark",
    "sourceLibrary": "lucide",
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
    ]
  },
  "icon.support.about": {
    "category": "support",
    "defaultSize": 24,
    "defaultTone": "textMuted",
    "forbidden": [
      "Do not use for risk warning or inline disclosure."
    ],
    "legacyNames": [
      "aboutApp"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalInfoIcon.tsx",
    "meaning": "About app, product information, and company information entry",
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
    "sourceIconName": "Info",
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
    ]
  },
  "icon.navigation.function_center": {
    "category": "navigation",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for trading orders or task checklist."
    ],
    "legacyNames": [
      "functionCenter"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalSquaresFourIcon.tsx",
    "meaning": "Function center, app module dashboard, or shortcut hub",
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
    "sourceIconName": "SquaresFour",
    "sourceLibrary": "phosphor",
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
    ]
  },
  "icon.trading.volume": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "brand",
    "forbidden": [
      "Do not use for price trend or market direction."
    ],
    "legacyNames": [
      "tradeVolume"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalChartBarIcon.tsx",
    "meaning": "Trading volume, analytics volume metric, and aggregated activity size",
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
    "sourceIconName": "ChartBar",
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
    ]
  },
  "icon.market.gold": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "amber",
    "forbidden": [
      "Do not use for deposit, reward, or balance."
    ],
    "legacyNames": [
      "goldCommodity"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalCoinsIcon.tsx",
    "meaning": "Gold, metals, and commodity instrument visual",
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
    "sourceIconName": "Coins",
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
    ]
  },
  "icon.market.index": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "blue",
    "forbidden": [
      "Do not use for account analytics or volume metric."
    ],
    "legacyNames": [
      "indexMarket"
    ],
    "license": {
      "attributionRequired": false,
      "name": "MIT",
      "url": "https://github.com/duongdev/phosphor-react-native/blob/main/LICENSE"
    },
    "localAssetPath": "src/icons/local/phosphor/LocalChartLineIcon.tsx",
    "meaning": "Index, futures, and benchmark market instrument visual",
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
    "sourceIconName": "ChartLine",
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
    ]
  },
  "icon.market.stock": {
    "category": "trading",
    "defaultSize": 24,
    "defaultTone": "text",
    "forbidden": [
      "Do not use proprietary company logos as functional instrument icons."
    ],
    "legacyNames": [
      "stockAsset"
    ],
    "license": {
      "attributionRequired": false,
      "name": "Remix Icon License v1.0",
      "url": "https://github.com/Remix-Design/RemixIcon/blob/master/License"
    },
    "localAssetPath": "src/icons/local/remix/LocalStockLineIcon.tsx",
    "meaning": "Stock and equity instrument visual without brand-logo copying",
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
    "sourceIconName": "stock-line",
    "sourceLibrary": "remix",
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
    ]
  }
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

export function resolveIconTone(colors: ThemeColors, tone: IconTone | string): string {
  switch (tone) {
    case 'danger':
      return colors.icon.danger;
    case 'disabled':
      return colors.icon.disabled;
    case 'down':
    case 'success':
      return colors.icon.success;
    case 'inverse':
    case 'panel':
    case 'white':
      return colors.icon.inverse;
    case 'up':
      return colors.icon.danger;
    case 'amber':
    case 'warning':
      return colors.icon.warning;
    case 'blue':
    case 'info':
      return colors.icon.info;
    case 'brand':
    case 'cyan':
    case 'primary':
    case 'text':
    case 'textDim':
    case 'textMuted':
      return colors.icon.primary;
    default:
      return tone;
  }
}
