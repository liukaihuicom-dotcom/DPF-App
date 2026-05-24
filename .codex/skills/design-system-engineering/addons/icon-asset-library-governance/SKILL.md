---
name: icon-asset-library-governance
description: >
  Use only as a Design System Engineering add-on for production icon asset governance, especially Phosphor Icons primary library,
  Remix Icon financial/business supplements, Lucide linear system-action supplements, icon taxonomy, registry, naming, SVG quality, line/fill states,
  financial semantics, source licensing, React/Vue/Figma mappings, and Icon QA.
  Inputs include icon source policy, product taxonomy, component needs, UI states, token rules, platform targets, licensing constraints, and existing icon assets.
  Outputs icon source policy, taxonomy, icon registry, semantic/state mappings, token bindings, code/Figma mappings, QA report, migration and release governance.
  Do not use to randomly generate icons, scrape unknown assets, mix unlicensed libraries, handwrite page-local SVGs, or bypass Design System governance.
---

# Icon Asset Library Governance Skill v1.0.0-L5 中文版

> 文件路径：`.codex/skills/design-system-engineering/addons/icon-asset-library-governance/SKILL.md`  
> 版本：`v1.0.0-L5`  
> 等级：`L5 Add-on / Production Financial Icon Asset Library Governance Skill`  
> 父级 Skill：`Design System Engineering Skill v3.0.0-L5`  
> 可被调用：`Design System Engineering Skill v3.0.0-L5`、`UI Build Production Skill v3.0.0-L5`、`UI Reference Adaptation Add-on Skill v1.0.0-L5`  
> 目标：基于 Phosphor Icons 作为主库、Remix Icon 作为金融 / 业务补充库、Lucide 作为线性系统操作补充库，搭建生产级金融 icon 资产系统，确保图标语义准确、风格统一、来源合规、可被 AI 稳定调用、可被前端消费、可长期维护。

---

## 0. 核心定位

本 Skill 是 `Design System Engineering Skill` 的图标资产治理 Add-on。

它不是让 Codex 随机生成图标，也不是让 AI 从零画一堆 SVG。  
它负责建立一套生产级图标资产系统：

```text
Icon Source Policy
→ Financial Icon Taxonomy
→ Icon Selection
→ Style Normalization
→ Icon Registry
→ Token Binding
→ State Mapping
→ Code / Figma Mapping
→ QA Gate
→ Release Governance
```

它不负责：

```text
- 不随机生成图标
- 不直接抓取未知来源图标
- 不混用无许可图标
- 不绕过 Design System
- 不在页面内临时手写 SVG
- 不用 emoji / 插画 / 位图替代系统图标
- 不让每个页面自己选择图标风格
```

---

## 1. 图标库策略

### 1.1 主库策略

| 图标库 | 角色 | 使用范围 | 原因 |
|---|---|---|---|
| Phosphor Icons | 主库 | App / H5 / Web / Admin 的主要产品图标、金融图标、导航图标、业务图标 | 风格灵活，有 line / fill / duotone / 多种 weight，适合统一产品视觉语言 |
| Remix Icon | 业务补充库 | 金融、业务、账户、安全、支付、后台、状态、复杂业务语义补充 | 中性系统符号较全，适合补齐 Phosphor 不足的业务图标 |
| Lucide | 系统操作补充库 | search、filter、close、back、more、settings、chevron、upload、download 等线性系统操作 | 线性清晰、轻量，适合基础操作图标补充 |

### 1.2 图标库优先级

```text
1. Phosphor Icons
2. Remix Icon
3. Lucide
4. Custom Icon
```

### 1.3 选择规则

| 场景 | 选择规则 |
|---|---|
| 产品导航 | 优先 Phosphor |
| 金融业务图标 | 优先 Phosphor；缺失时 Remix |
| 钱包 / 入金 / 出金 / 银行卡 | Phosphor 优先，Remix 补充 |
| KYC / 合规 / 协议 / 审核 | Phosphor 优先，Remix 补充 |
| 系统操作 | Lucide 优先 |
| 后台管理操作 | Lucide / Remix |
| 状态图标 | Phosphor 优先；系统状态可用 Lucide |
| 非通用金融图标 | 进入 Custom Icon Request，不允许页面临时画 |

---

## 2. 来源与许可规则

### 2.1 来源策略

| Source | 是否允许 | 条件 |
|---|---:|---|
| Phosphor Icons | 是 | 必须保留许可信息和来源元数据 |
| Remix Icon | 是 | 必须保留 Remix Icon 来源和许可元数据 |
| Lucide | 是 | 必须保留 ISC 许可元数据 |
| Custom SVG | 条件允许 | 必须通过风格 QA 和所有权审查 |
| 网页未知 SVG | 否 | 来源、许可、所有权不清楚 |
| 竞品图标 | 否 | 存在品牌和 trade dress 风险 |
| AI 生成图标 | 条件允许 | 必须通过原创性、风格、所有权审查 |
| Emoji | 否 | 不是生产级图标系统 |
| PNG / 位图图标 | 否 | 不可缩放，不能稳定绑定 token |

### 2.2 许可元数据要求

每个图标条目必须包含：

```json
{
  "source_library": "phosphor | remix | lucide | custom",
  "source_icon_name": "string",
  "license": "MIT | Remix Icon License v1.0 | ISC | custom-owned",
  "license_url": "string",
  "attribution_required": "boolean",
  "modified": "boolean"
}
```

### 2.3 许可 QA 规则

```text
- 没有 source_library 和 license 的图标不得进入生产。
- 未知来源图标必须阻断。
- 竞品派生图标必须阻断。
- 修改第三方图标必须保留来源元数据。
- 自定义图标必须包含 owner 和 creation source。
```

---

## 3. 图标视觉标准

### 3.1 基础标准

| 项目 | 标准 |
|---|---|
| 基础画布 | 24 × 24 |
| 扩展尺寸 | 16 / 20 / 24 / 32 |
| 默认风格 | line |
| 激活风格 | fill 或 weight-up version |
| 线宽 | 使用来源默认；混用时按视觉重量归一 |
| 圆角风格 | 默认圆润，不使用过尖锐风格，除非来源图标本身要求 |
| 视觉对齐 | 在 24px 画布中视觉居中 |
| 颜色 | 必须绑定 `color.icon.*` token |
| 文件格式 | SVG |
| Runtime 格式 | React / Vue / SVG sprite / Icon component |
| 位图导出 | 仅用于 App Store 或营销素材，不作为源资产 |

### 3.2 风格归一规则

Phosphor、Remix、Lucide 的绘制体系不同，因此必须做视觉归一。

| 差异 | 归一规则 |
|---|---|
| 线宽不一致 | 调整图标 size 或 weight，不随机写 CSS override |
| 视觉密度不一致 | 优先选择同一家图标库 |
| 端点圆润 / 尖锐差异 | 同一导航组内不得明显混用 |
| Fill 形态差异 | fill 仅用于选中 / active 状态 |
| 细节过多 | 简化或更换图标 |
| 视觉重心不齐 | 只通过 approved mapping 调整 viewBox 或 wrapper 对齐 |
| 来源命名不同 | 通过 icon registry alias 统一 |

### 3.3 禁止的视觉结果

```text
- 图标一粗一细
- 同一导航中混用 line / fill / duotone
- 同一页面内图标圆角风格明显不同
- 图标视觉重心不齐
- 24px 图标强行拉伸成 28px
- 图标颜色硬编码
- 选中态只靠颜色且无 fill / weight / label 辅助
- 用业务不准确的图标凑数
- 用装饰插画代替功能图标
```

---

## 4. Icon Token Binding

### 4.1 颜色 Token

| Token | 用途 |
|---|---|
| `color.icon.primary` | 主要功能图标 |
| `color.icon.secondary` | 次级图标 |
| `color.icon.tertiary` | 弱化图标 |
| `color.icon.inverse` | 深色 / 彩色背景上的图标 |
| `color.icon.disabled` | 禁用状态 |
| `color.icon.success` | 成功 |
| `color.icon.warning` | 警告 |
| `color.icon.danger` | 错误 / 危险 |
| `color.icon.info` | 信息提示 |
| `color.icon.active` | 选中导航 / 激活状态 |

### 4.2 尺寸 Token

| Token | 值 | 用途 |
|---|---:|---|
| `size.icon.xs` | 16px | 文本内联、紧凑后台 |
| `size.icon.sm` | 20px | 列表项、小按钮 |
| `size.icon.md` | 24px | 默认 App / Web 图标 |
| `size.icon.lg` | 32px | 功能卡片、空状态 |
| `size.icon.xl` | 40px | 少量插画型图标 |

### 4.3 图标状态 Token

| 状态 | 风格 |
|---|---|
| default | line + `color.icon.secondary` |
| active | fill 或 weight-up + `color.icon.active` |
| disabled | line + `color.icon.disabled` |
| danger | line/fill + `color.icon.danger` |
| success | line/fill + `color.icon.success` |
| warning | line/fill + `color.icon.warning` |
| inverse | line/fill + `color.icon.inverse` |

---

## 5. 金融图标分类体系

### 5.1 核心分类

| Category | 作用 |
|---|---|
| navigation | 底部导航 / 侧边栏 / 顶部导航 |
| system | 返回、关闭、搜索、筛选、更多、设置 |
| account | 用户、资料、认证、安全 |
| trading_account | 交易账号、MT4/MT5、杠杆、账户类型 |
| wallet | 钱包、余额、入金、出金、转账 |
| banking | 银行、银行卡、银行账户、币种 |
| trading | 图表、持仓、订单、信号、市场、点差 |
| copy_trading | 跟单、策略、导师、跟随者、表现 |
| ib_partner | Partner、邀请、返佣、佣金、层级、网络 |
| kyc_compliance | KYC、文件、地址证明、协议、风险披露 |
| review | 待处理、审核中、已通过、已拒绝 |
| status | 成功、警告、错误、锁定、受限 |
| notification | 通知、消息、提醒、公告 |
| security | 锁、安全盾、密码、设备、验证 |
| data | 报表、分析、仪表盘、导出 |

### 5.2 金融最小图标集

| Icon Key | 含义 | 首选来源 |
|---|---|---|
| `icon.wallet.default` | 钱包 | Phosphor |
| `icon.wallet.deposit` | 入金 | Phosphor / Remix |
| `icon.wallet.withdrawal` | 出金 | Phosphor / Remix |
| `icon.wallet.transfer` | 转账 | Phosphor |
| `icon.wallet.exchange` | 兑换 | Phosphor / Remix |
| `icon.bank.default` | 银行 | Phosphor / Remix |
| `icon.bank.card` | 银行卡 | Phosphor |
| `icon.bank.account` | 银行账户 | Remix |
| `icon.currency.default` | 货币 | Phosphor / Remix |
| `icon.account.user` | 用户账户 | Phosphor |
| `icon.account.trading` | 交易账户 | Phosphor / Remix |
| `icon.account.security` | 账户安全 | Phosphor |
| `icon.kyc.identity` | 身份验证 | Phosphor / Remix |
| `icon.kyc.document` | 文件 | Phosphor |
| `icon.kyc.poa` | 地址证明 | Remix / Custom |
| `icon.kyc.video` | 视频验证 | Phosphor |
| `icon.agreement.default` | 协议 | Phosphor / Remix |
| `icon.risk.disclosure` | 风险披露 | Phosphor / Remix |
| `icon.trading.chart` | 图表 | Phosphor |
| `icon.trading.market` | 市场 | Phosphor / Remix |
| `icon.trading.order` | 订单 | Phosphor |
| `icon.trading.position` | 持仓 | Remix / Custom |
| `icon.trading.leverage` | 杠杆 | Custom if no accurate icon |
| `icon.trading.margin` | 保证金 | Custom if no accurate icon |
| `icon.trading.spread` | 点差 | Custom if no accurate icon |
| `icon.copy.strategy` | 跟单策略 | Phosphor / Remix |
| `icon.copy.leader` | 策略主理人 | Phosphor / Remix |
| `icon.copy.follower` | 跟随者 | Phosphor |
| `icon.ib.partner` | Partner | Phosphor / Remix |
| `icon.ib.invite` | 邀请链接 | Phosphor |
| `icon.ib.rebate` | 返佣 | Remix / Custom |
| `icon.ib.commission` | 佣金 | Phosphor / Remix |
| `icon.ib.network` | IB 网络 | Phosphor |
| `icon.status.success` | 成功 | Phosphor / Lucide |
| `icon.status.warning` | 警告 | Phosphor / Lucide |
| `icon.status.error` | 错误 | Phosphor / Lucide |
| `icon.status.pending` | 待处理 | Phosphor |
| `icon.status.reviewing` | 审核中 | Remix / Lucide |
| `icon.status.restricted` | 受限 | Phosphor / Remix |
| `icon.status.locked` | 锁定 | Phosphor / Lucide |
| `icon.system.search` | 搜索 | Lucide |
| `icon.system.filter` | 筛选 | Lucide |
| `icon.system.close` | 关闭 | Lucide |
| `icon.system.back` | 返回 | Lucide |
| `icon.system.more` | 更多 | Lucide |
| `icon.system.settings` | 设置 | Lucide |
| `icon.system.upload` | 上传 | Lucide |
| `icon.system.download` | 下载 | Lucide |
| `icon.system.chevron_right` | 右箭头 | Lucide |
| `icon.system.calendar` | 日历 | Lucide |
| `icon.system.copy` | 复制操作 | Lucide |

---

## 6. 图标命名规则

### 6.1 语义 Key 格式

```text
icon.{category}.{meaning}.{variant?}.{state?}
```

示例：

```text
icon.wallet.deposit
icon.wallet.withdrawal
icon.trading.margin
icon.kyc.identity
icon.ib.rebate
icon.system.search
icon.status.success
icon.navigation.wallet.active
```

### 6.2 命名要求

| 规则 | 要求 |
|---|---|
| 语义优先 | 按产品含义命名，不按来源图标名命名 |
| 来源别名其次 | 来源图标名存入 registry |
| 禁止视觉命名 | 避免 `nice-wallet`、`blue-icon`、`thin-icon` |
| 禁止临时命名 | 避免 `icon1`、`new-deposit`、`test-icon` |
| 命名稳定 | UI 使用后不得无迁移直接改名 |
| 状态明确 | Active / disabled / danger 状态必须声明 |
| 分类必需 | 每个图标必须属于 taxonomy category |

### 6.3 来源别名示例

```json
{
  "icon.wallet.deposit": {
    "source_library": "phosphor",
    "source_icon_name": "ArrowCircleDown",
    "display_name": "Deposit",
    "category": "wallet"
  }
}
```

---

## 7. Icon Registry Schema

### 7.1 `icon-registry.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Financial Icon Registry Schema",
  "type": "object",
  "required": ["icons"],
  "properties": {
    "icons": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "icon_key",
          "category",
          "meaning",
          "source_library",
          "source_icon_name",
          "style",
          "sizes",
          "states",
          "token_binding",
          "usage",
          "license",
          "status"
        ],
        "properties": {
          "icon_key": {
            "type": "string",
            "pattern": "^icon\\.[a-z0-9_]+(\\.[a-z0-9_]+)+$"
          },
          "category": {"type": "string"},
          "meaning": {"type": "string"},
          "source_library": {"enum": ["phosphor", "remix", "lucide", "custom"]},
          "source_icon_name": {"type": "string"},
          "style": {
            "type": "object",
            "required": ["default", "active"],
            "properties": {
              "default": {"type": "string"},
              "active": {"type": "string"},
              "disabled": {"type": "string"}
            }
          },
          "sizes": {"type": "array", "items": {"enum": [16, 20, 24, 32, 40]}},
          "states": {
            "type": "array",
            "items": {"enum": ["default", "active", "disabled", "success", "warning", "danger", "inverse"]}
          },
          "token_binding": {
            "type": "object",
            "required": ["color", "size"],
            "properties": {
              "color": {"type": "string"},
              "size": {"type": "string"}
            }
          },
          "usage": {"type": "array", "items": {"type": "string"}},
          "platforms": {"type": "array", "items": {"enum": ["app", "h5", "web", "admin"]}},
          "license": {
            "type": "object",
            "required": ["name", "url"],
            "properties": {
              "name": {"type": "string"},
              "url": {"type": "string"},
              "attribution_required": {"type": "boolean"}
            }
          },
          "modified": {"type": "boolean"},
          "status": {"enum": ["draft", "approved", "deprecated", "blocked"]},
          "replacement": {"type": "string"}
        }
      }
    }
  }
}
```

### 7.2 Registry 条目示例

```json
{
  "icon_key": "icon.wallet.deposit",
  "category": "wallet",
  "meaning": "Deposit funds into wallet or trading account",
  "source_library": "phosphor",
  "source_icon_name": "ArrowCircleDown",
  "style": {
    "default": "line",
    "active": "fill",
    "disabled": "line"
  },
  "sizes": [20, 24, 32],
  "states": ["default", "active", "disabled"],
  "token_binding": {
    "color": "color.icon.primary",
    "size": "size.icon.md"
  },
  "usage": ["deposit entry", "wallet operation", "transaction action"],
  "platforms": ["app", "h5", "web"],
  "license": {
    "name": "MIT",
    "url": "https://phosphoricons.com",
    "attribution_required": false
  },
  "modified": false,
  "status": "approved"
}
```

---

## 8. 图标选择算法

Codex 必须按以下顺序执行：

```text
1. 读取图标请求的业务含义。
2. 匹配金融图标分类体系。
3. 先搜索 icon registry。
4. 如果已有 approved 图标，直接使用。
5. 如果缺失，先搜索 Phosphor。
6. 如果 Phosphor 语义匹配弱，搜索 Remix。
7. 如果是系统操作图标，搜索 Lucide。
8. 如果所有来源都不准确，创建 Custom Icon Request。
9. 执行语义 QA。
10. 执行视觉 QA。
11. 执行许可 QA。
12. 加入 icon-registry.json。
13. 输出 code mapping 和 Figma mapping。
```

### 8.1 Request → Source Decision

| 请求类型 | 第一来源 | 第二来源 | 第三来源 |
|---|---|---|---|
| Wallet / account / trading | Phosphor | Remix | Custom |
| Banking / payment | Phosphor | Remix | Custom |
| KYC / compliance | Phosphor | Remix | Custom |
| Partner / IB | Phosphor | Remix | Custom |
| System operation | Lucide | Phosphor | Remix |
| Status feedback | Phosphor | Lucide | Remix |
| Data / dashboard | Phosphor | Remix | Lucide |
| Admin operation | Lucide | Remix | Phosphor |

---

## 9. Custom Icon Request

只有当所有 approved 图标库都无法准确表达业务含义时，才允许定制图标。

### 9.1 定制图标申请模板

```md
# Custom Icon Request

- Icon Key:
- Category:
- Business Meaning:
- Why Existing Library Fails:
- Required Style:
- Default State:
- Active State:
- Size:
- Token Binding:
- Platforms:
- Similar Existing Icons:
- Risk:
- Owner:
- Status:
```

### 9.2 Custom Icon 规则

```text
- 必须遵守 24x24 基础画布。
- 必须匹配主库的视觉重量。
- 必须有 line 版本。
- 如果用于选中导航状态，必须有 fill 版本。
- 不得模仿竞品图标。
- 必须通过 semantic、visual、technical、license QA。
- 必须加入 icon-registry.json 后才能用于 UI。
```

---

## 10. Code Mapping

### 10.1 Icon Component Contract

```tsx
<Icon
  name="icon.wallet.deposit"
  size="md"
  color="primary"
  state="default"
  ariaLabel="Deposit"
/>
```

### 10.2 React Mapping

```tsx
const iconMap = {
  "icon.wallet.deposit": {
    source: "phosphor",
    component: "ArrowCircleDown",
    defaultWeight: "regular",
    activeWeight: "fill"
  },
  "icon.system.search": {
    source: "lucide",
    component: "Search",
    defaultWeight: "stroke"
  }
}
```

### 10.3 Vue Mapping

```ts
export const iconMap = {
  "icon.wallet.deposit": {
    source: "phosphor",
    component: "ArrowCircleDown",
    defaultWeight: "regular",
    activeWeight: "fill"
  },
  "icon.system.search": {
    source: "lucide",
    component: "Search"
  }
}
```

### 10.4 CSS Token Mapping

```css
.icon {
  width: var(--size-icon-md);
  height: var(--size-icon-md);
  color: var(--color-icon-secondary);
}

.icon[data-state="active"] {
  color: var(--color-icon-active);
}
```

### 10.5 Accessibility Mapping

| 场景 | 要求 |
|---|---|
| 装饰性图标 | `aria-hidden="true"` |
| 图标按钮 | 必须有 `aria-label` |
| 状态图标 | 附近必须有文字说明 |
| 风险图标 | 不得作为唯一风险提示 |
| 导航图标 | 尽量搭配可见 label |

---

## 11. Figma Mapping

### 11.1 Figma 组件结构

```text
Icons/
├── 01_Navigation/
├── 02_System/
├── 03_Account/
├── 04_Wallet/
├── 05_Trading/
├── 06_CopyTrading/
├── 07_IB_Partner/
├── 08_KYC_Compliance/
├── 09_Status/
└── 10_Deprecated/
```

### 11.2 Figma Variant 规则

| Property | Values |
|---|---|
| Category | navigation / system / wallet / trading / kyc / status |
| Style | line / fill |
| State | default / active / disabled / danger / success / warning |
| Size | 16 / 20 / 24 / 32 |
| Source | phosphor / remix / lucide / custom |

### 11.3 Figma 命名

```text
Icon / Wallet / Deposit
Icon / Wallet / Withdrawal
Icon / Trading / Margin
Icon / KYC / Identity
Icon / System / Search
Icon / Status / Success
```

---

## 12. Icon QA Gate

### 12.1 QA 维度

| Gate | 检查项 | Block 条件 |
|---|---|---|
| Source Gate | 是否有来源和许可 | 未知来源 |
| Semantic Gate | 是否匹配业务含义 | 业务隐喻错误 |
| Style Gate | 线宽和视觉密度是否一致 | 明显风格不统一 |
| Size Gate | 16 / 20 / 24 / 32 是否清晰 | 20 或 24px 破碎不可读 |
| Alignment Gate | 视觉重心和 viewBox 是否正确 | 被裁切或偏心 |
| Token Gate | 颜色和尺寸是否使用 token | 硬编码颜色 / 尺寸 |
| State Gate | 是否定义 default / active / disabled | 导航缺状态 |
| Accessibility Gate | 图标按钮是否有 label | 动作图标无 label |
| Platform Gate | App / H5 / Web / Admin 是否可用 | 某端明显失效 |
| Registry Gate | 是否注册后使用 | 未注册图标 |

### 12.2 Severity Matrix

| Severity | 定义 | 是否阻断 |
|---|---|---:|
| Blocker | 未知来源、缺许可、竞品派生、风险 / 安全图标错误 | 是 |
| Critical | 语义错误、破坏核心任务、图标按钮不可访问 | 是 |
| Major | 风格不统一、缺 active 状态、20/24px 可读性差 | 条件阻断 |
| Minor | 轻微视觉不平衡、命名可优化 | 否 |
| Info | 可选优化 | 否 |

### 12.3 QA Scorecard

| 维度 | 分值 |
|---|---:|
| Semantic Accuracy | 20 |
| Visual Consistency | 20 |
| Technical Quality | 15 |
| Token Binding | 15 |
| State Coverage | 10 |
| Accessibility | 10 |
| License / Source Compliance | 10 |

| 分数 | Decision |
|---|---|
| 90-100 | icon_ready |
| 80-89 | conditional_ready |
| 70-79 | major_fix_required |
| <70 | blocked |

---

## 13. Icon Release Decision

| Decision | 条件 |
|---|---|
| `icon_ready` | 0 Blocker，0 Critical，score ≥ 90 |
| `conditional_ready` | 0 Blocker，0 Critical，score 80-89，Major 有 owner |
| `major_fix_required` | Major 问题影响一致性或可读性 |
| `blocked` | 任意 Blocker / Critical 或 score < 70 |

---

## 14. 治理与版本管理

### 14.1 版本规则

| 变更 | 版本类型 |
|---|---|
| 新增图标 | Minor |
| 重命名 icon key | Major |
| 更换来源图标库 | Major |
| 修改视觉风格 | Major |
| 修复对齐 | Patch |
| 废弃图标 | Minor with migration |
| 删除图标 | Major after deprecation cycle |

### 14.2 废弃模板

```md
# Deprecated Icon

- Icon Key:
- Reason:
- Replacement:
- Impacted Pages:
- Impacted Components:
- Migration:
- Removal Version:
- Owner:
```

---

## 15. AI 执行命令

### 15.1 初始化金融图标资产系统

```txt
使用 Icon Asset Library Governance Skill v1.0.0-L5 初始化生产级金融图标资产系统。

来源策略：
- Phosphor Icons 作为主库
- Remix Icon 作为金融 / 业务补充库
- Lucide 作为线性系统操作补充库

要求：
1. 创建 icon taxonomy。
2. 创建 icon-registry.json。
3. 定义来源与许可规则。
4. 定义图标命名规则。
5. 定义视觉风格归一规则。
6. 定义 token binding。
7. 定义金融最小图标集。
8. 定义 React / Vue / Figma mapping。
9. 定义 QA Gate 和 release decision。
10. 禁止使用未知来源图标。
```

### 15.2 为 UI 选择图标

```txt
使用 Icon Asset Library Governance Skill v1.0.0-L5 选择图标。

输入：
- Business meaning:
- Page:
- Platform:
- Component:
- State:
- Preferred style:
- Existing icon registry:

规则：
1. 先搜索 icon registry。
2. Phosphor 作为主库。
3. Remix 用于金融 / 业务补充。
4. Lucide 用于系统操作。
5. 如果没有准确图标，创建 Custom Icon Request。
6. 输出 icon key、source、source icon name、style、token binding、accessibility label 和 QA decision。
```

### 15.3 审核现有图标

```txt
使用 Icon Asset Library Governance Skill v1.0.0-L5 审核当前图标系统。

检查：
- Source and license
- Semantic accuracy
- Style consistency
- Size readability
- Token binding
- State coverage
- Accessibility
- Registry completeness
- Duplicate icons
- Deprecated icons

输出：
- Issues by severity
- Fix plan
- Replacement suggestions
- Icon QA score
- Release decision
```

---

## 16. Forbidden Rules

```text
- 禁止让 Codex 随机画图标。
- 禁止使用未知来源 SVG。
- 禁止复制竞品图标。
- 禁止没有 registry 审批就混用 Phosphor、Remix、Lucide。
- 禁止在生产 UI 中使用未注册图标。
- 禁止硬编码图标颜色或尺寸。
- 禁止使用 emoji 作为产品图标。
- 禁止使用 PNG 作为源图标。
- 禁止用装饰图标表达关键金融含义。
- 禁止只用图标表达风险。
- 禁止无迁移直接重命名 icon key。
```

---

## 17. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| 有来源策略 | 是 |
| 有许可元数据 | 是 |
| 有金融分类体系 | 是 |
| 有 Icon Registry Schema | 是 |
| 有图标命名规则 | 是 |
| 有风格归一规则 | 是 |
| 有 Token Binding | 是 |
| 有金融最小图标集 | 是 |
| 有 Code Mapping | 是 |
| 有 Figma Mapping | 是 |
| 有无障碍规则 | 是 |
| 有 QA Gate | 是 |
| 有 Release Decision | 是 |
| 有版本 / 废弃治理 | 是 |

---

## 18. 最终定义

```text
Icon Asset Library Governance Skill v1.0.0-L5
= Phosphor Primary Source
+ Remix Financial Supplement
+ Lucide System Supplement
+ Financial Icon Taxonomy
+ Icon Registry
+ Style Normalization
+ Token Binding
+ State Mapping
+ Code Mapping
+ Figma Mapping
+ Accessibility
+ License Governance
+ Icon QA Gate
+ Release Decision
```

它的价值不是收集更多图标。  
它的价值是让图标使用变得 **语义准确、风格统一、来源合规、生产可用、AI 可读取**。
