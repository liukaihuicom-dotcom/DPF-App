# Project Skill Index

本项目的 AI 产品设计工程生产链路由 3 个核心 Skill 和 1 个 UI Build Add-on 组成。执行顺序遵循：产品工程总控层 → 设计系统工程层 → 页面生产交付层；参考案例转化只作为 UI Build 的前置 Add-on。

## 核心 Skill

| Skill 名称 | 路径 | 职责 | 触发场景 | 输入 | 输出 | 禁止行为 |
|---|---|---|---|---|---|---|
| AI Product Production Delivery Skill | `skills/ai-product-production-delivery/SKILL.md` | 产品工程总控层，负责业务建模、模块拆解、角色权限、业务规则、页面契约、API 草案、风控规则、测试映射和交付验收 | 产品需求、模块、业务规则、角色权限、页面契约、API、风控、测试映射、发布决策 | 业务目标、用户角色、功能范围、流程、约束、合规要求、现有文档 | Product Kernel、Business Rules、Page Contracts、API Contracts、Risk Rules、Traceability Matrix、QA Gate | 直接生成 Demo 页面、跳过业务契约、静默脑补缺失规则、绕过 QA 决策 |
| Design System Engineering Skill | `skills/design-system-engineering/SKILL.md` | 设计系统工程层，负责变量系统、Design Token、组件库、业务组件、图标库、Pattern Registry、Code Mapping、设计系统 QA 和治理 | 变量系统、组件库、图标库、Pattern、Design Token、Code Mapping、设计系统 QA、组件治理 | Product Kernel、Page Contract、品牌约束、平台模式、现有组件和 token | tokens.json、component-manifest.json、business-component-manifest.json、icon-registry.json、pattern-registry.json、code mapping、QA rules | 随意定义视觉风格、硬编码样式、脱离组件清单造组件、替代业务流程和页面契约 |
| UI Build Production Skill | `skills/ui-build-production/SKILL.md` | 页面生产交付层，基于 Page Contract、Design System、Component Manifest、Pattern Registry 和 State Matrix 输出可运行、可验收、可交付的 UI 页面 | 页面搭建、HTML / React / Vue、状态矩阵、交互反馈、视觉 QA、响应式 QA、开发交付 | page-contract.json、tokens.json、component-manifest.json、business-component-manifest.json、icon-registry.json、pattern-registry.json、mock-data.json、UI Build Reference Input | 页面代码、状态矩阵、交互事件映射、组件使用报告、Token 使用报告、视觉 QA、响应式 QA、A11y QA、开发交付说明 | 无契约直接做页面、随机样式、临时造组件、静态截图式页面、缺状态页面、绕过 Design System |

## UI Build Add-on

| Add-on 名称 | 路径 | 职责 | 触发场景 | 输入 | 输出 | 禁止行为 |
|---|---|---|---|---|---|---|
| UI Reference Adaptation Add-on Skill | `skills/ui-build-production/addons/reference-adaptation/SKILL.md` | 将参考案例转化为 UI Build 可消费的结构化输入，包含 Visual DNA、Similarity Risk、Token Mapping、Component Mapping、Pattern Mapping、Business Adaptation | Mobbin、App 截图、Web Reference、Dribbble、Behance、Figma Community、竞品截图、参考这个页面风格 | 参考截图或链接、参考说明、目标业务、Page Contract、Design System、Component Manifest、Pattern Registry | UI Build Reference Input、Visual DNA、Token Mapping、Component Mapping、Pattern Mapping、Business Adaptation、Similarity Risk | 作为第 4 个平级核心 Skill、直接生成最终页面、替代 Page Contract、绕过 Design System 或 Component Manifest、复制品牌资产和像素级布局 |

## 调用顺序

1. 产品需求、业务规则、页面契约、API、风控和测试映射：读取 `skills/ai-product-production-delivery/SKILL.md`。
2. Token、组件、图标、Pattern、Code Mapping 和设计系统 QA：读取 `skills/design-system-engineering/SKILL.md`。
3. 页面搭建、状态矩阵、交互反馈、视觉 QA 和开发交付：读取 `skills/ui-build-production/SKILL.md`。
4. 出现 Mobbin、截图、竞品 UI 或参考页面风格时：先读取 `skills/ui-build-production/addons/reference-adaptation/SKILL.md`，生成 UI Build Reference Input 后再交给 UI Build Production Skill。

## 路径约束

- `reference-adaptation` 必须位于 `skills/ui-build-production/addons/reference-adaptation/`。
- 不允许保留 `skills/ui-reference-adaptation/`、`skills/reference-adaptation/`、`skills/mobbin-adaptation/` 作为平级核心 Skill。
- Add-on 只为 UI Build 提供参考输入，不改变 3 个核心 Skill 的生产链路。
