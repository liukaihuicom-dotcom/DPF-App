# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Codex Skill Routing Rules

This project uses a production-grade AI product design engineering skill system.

Codex must not read every skill by default. Codex must select the right skill based on the task type.

Before starting any task, Codex must classify the task and output:

1. Task Type
2. Required Skills
3. Skill Execution Order
4. Skills Not Needed
5. Missing Inputs
6. Expected Outputs

## 0. Quick Local Expo Demo Startup Skill

Use:

`.codex/skills/quick-local-expo-demo-startup/SKILL.md`

Priority:

- This Skill has first routing priority for quick Expo / Metro startup, local app demo startup, and mobile phone demo requests.
- Use this Skill when the user asks to start the app, start Expo, start a local service, run the app, or experience the demo on a phone.
- The goal is quick Expo service reuse or startup, not complex startup governance.
- When this Skill is triggered, read it before modifying startup scripts, checking ports, or running local dev servers.
- If the request involves Expo code changes beyond local startup governance, also follow the Expo v54 documentation rule before writing code.

Trigger when the task involves:

- 启动 app
- 启动 App
- 启动 Expo
- 启动 expo
- 启动 Metro
- 启动本地 demo
- 启动本地演示
- 启动本地服务
- 跑一下 app
- 跑一下 Expo
- 手机体验 demo
- 手机体验 Demo
- 手机扫码体验
- 手机上看 demo
- 打开 app demo
- 打开本地 app
- 本地运行 app
- 本地启动服务
- 电脑终端启动 expo
- 终端启动 Expo
- 快速启动服务
- 快速预览 App
- start app
- start expo
- expo start
- start metro
- run app
- run expo
- local demo
- mobile demo
- phone preview
- scan QR
- start local service

Required outputs:

- Project root and Expo dependency check
- Port `8081` check before startup
- Existing service decision: reuse Expo / Metro if already running, otherwise stop if occupied by a non-Expo service
- Startup script audit and required package.json updates
- Default command: `npm run dev:app`
- Default mode: LAN for phone demo support
- Local Metro address: `http://localhost:8081`
- Phone demo instructions: same Wi-Fi and scan terminal Expo QR Code with Expo Go or the project Dev Build
- Current mode, port, tunnel status, blockers, and next-stage decision

Hard rules:

- Check whether Expo / Metro is already running on `8081` before starting.
- Reuse an existing Expo / Metro service instead of starting a duplicate.
- If no Expo / Metro service is running, use `npm run dev:app`.
- `npm run dev:app` must default to LAN mode.
- Do not allow automatic port drift from `8081`.
- Do not default to tunnel.
- Do not silently kill port-owning processes.
- Do not treat LAN IP or tunnel URLs as stable fixed links.

## 1. Product Engineering Skill

Use:

`.codex/skills/ai-product-production-delivery/SKILL.md`

Trigger when the task involves:

- Product requirements
- Business requirements
- Product scope
- User roles
- Permission matrix
- State machine
- Page Contract
- API Contract
- Error codes
- Risk / compliance rules
- Traceability
- Test case mapping
- Release decision
- Production product delivery package

Required outputs:

- Product Kernel
- Module Contract
- Business Rule Matrix
- RBAC Policy
- State Machine
- Page Contract
- API Draft
- Error Code Mapping
- Traceability Matrix
- Test Case Mapping
- QA Gate
- Release Decision

Hard rules:

- Do not generate UI before Page Contract is clear.
- Do not assume business rules silently.
- Missing business rules must be recorded as assumptions or blockers.
- Do not bypass Product Skill when the task involves business logic, permissions, state, risk, API, or compliance.

## 2. Design System Engineering Skill

Use:

`.codex/skills/design-system-engineering/SKILL.md`

Trigger when the task involves:

- Design tokens
- Variables
- Component Manifest
- Business components
- Icon registry
- Pattern registry
- Theme / brand / density / platform modes
- CSS variables
- Tailwind mapping
- React / Vue mapping
- Design System QA
- Production design system governance

Required outputs:

- tokens.json
- component-manifest.json
- business-component-manifest.json
- icon-registry.json
- pattern-registry.json
- ai-readable-index.json
- code mapping
- QA Gate

Hard rules:

- Do not create random visual styles.
- Do not create one-off page components.
- Do not hardcode color, spacing, radius, shadow, typography, or icon style.
- All UI must bind to tokens and registered components.
- If icons are involved, also use Icon Asset Library Governance Skill.

## 3. UI Build Production Skill

Use:

`.codex/skills/ui-build-production/SKILL.md`

Trigger when the task involves:

- Building App / H5 / Web / Admin pages
- HTML / React / Vue UI output
- State matrix
- Interaction flow
- Responsive behavior
- Visual QA
- Dev handoff
- Page implementation

UI Build must consume:

- Page Contract
- tokens.json
- component-manifest.json
- pattern-registry.json
- platform rules
- UX Gate result when available
- Copy package when user-facing copy is involved
- Icon registry when icons are involved

Required outputs:

- Page implementation
- State Matrix
- Interaction Map
- Token Usage Report
- Component Usage Report
- Visual QA Report
- Dev Handoff
- Release Decision

Hard rules:

- Do not build static demo pages.
- Do not bypass Page Contract.
- Do not bypass Design System.
- Do not generate random one-off styles.
- Do not mark production-ready without QA.

## 4. Reference Adaptation Add-on

Use:

`.codex/skills/ui-build-production/addons/reference-adaptation/SKILL.md`

Trigger when the task includes:

- Mobbin reference
- App screenshot
- Web screenshot
- Competitor UI
- Dribbble
- Behance
- Figma Community reference
- "参考这个页面风格"
- "借鉴这个页面"
- "复刻这个 UI 风格"
- "按照这个截图优化 UI"

Required outputs:

- Visual DNA
- Similarity Risk Checklist
- Token Mapping
- Component Mapping
- Pattern Mapping
- Business Adaptation
- UI Build Reference Input

Hard rules:

- Do not copy the reference UI directly.
- Do not copy logo, brand color, original icon, original copywriting, proprietary illustration, pixel-level layout, or trade dress.
- The add-on output is only UI Build Reference Input.
- Final UI must still be generated through Product Skill + Design System Skill + UI Build Skill.
- If reference contains icons, use Icon Governance Skill.
- If reference contains copy, use Financial Copy & Localization Skill.

## 5. UX Interaction Quality Gate Add-on

Use:

`.codex/skills/ui-build-production/addons/ux-interaction-quality-gate/SKILL.md`

Trigger when the task involves:

- UX review
- Task flow
- Interaction quality
- Error recovery
- Feedback quality
- Platform behavior
- Accessibility baseline
- Financial UX risk
- Cognitive load
- Release readiness
- "是否符合国际 UX 标准"
- "检查交互是否合理"
- "优化用户体验"

Required outputs:

- UX Task Flow Report
- Interaction Review Report
- Feedback Recovery Report
- Accessibility Checklist
- Financial UX Risk Report
- UX Quality Score
- Severity: Blocker / Critical / Major / Minor
- Decision: ux_ready / conditional_ready / major_fix_required / blocked

Hard rules:

- Any Blocker or Critical UX issue prevents production delivery.
- Do not mark UX ready if the user cannot complete the core task.
- Do not mark UX ready if error recovery is missing.
- Do not weaken financial risk information for visual simplicity.
- UX Gate must run before production handoff for high-risk financial flows.

## 6. Financial Copy & Localization Add-on

Use:

`.codex/skills/ui-build-production/addons/financial-copy-localization/SKILL.md`

Trigger when the task involves:

- UX copy
- English copy
- Indonesian localization
- Bahasa Indonesia
- Financial terminology
- Forex / CFD / derivatives / broker terminology
- CTA wording
- Error copy
- Toast copy
- Dialog copy
- Empty state copy
- Success / failed state copy
- Risk disclosure
- Agreement copy
- KYC copy
- Deposit / withdrawal copy
- i18n keys
- Compliance-sensitive copy

Required outputs:

- UX Copy Table
- English Copy
- Indonesian Copy
- i18n Keys
- Terminology Mapping
- Risk Copy Review
- CTA Safety Review
- Copy QA Score
- Release Decision

Hard rules:

- Do not promise profits.
- Do not use "risk-free", "guaranteed profit", "easy money", "safe investment", or similar claims.
- Do not weaken risk disclosures.
- Do not translate financial terms inconsistently.
- Do not directly copy competitor wording.
- Do not hardcode user-facing copy without i18n keys.
- High-risk copy must be marked for native or compliance review when needed.

## 7. Icon Asset Library Governance Add-on

Use:

`.codex/skills/design-system-engineering/addons/icon-asset-library-governance/SKILL.md`

Trigger when the task involves:

- Icon library
- Financial icons
- App / Web / Admin icons
- Navigation icons
- System operation icons
- Phosphor Icons
- Remix Icon
- Lucide
- icon-registry.json
- Icon naming
- SVG quality
- Icon QA
- "图标质量低"
- "搭建金融图标库"

Source strategy:

1. Phosphor Icons as primary library
2. Remix Icon as financial / business supplement
3. Lucide as linear system-operation supplement
4. Custom icon only when approved libraries cannot express the business meaning

Required outputs:

- Icon taxonomy
- icon-registry.schema.json
- icon-registry.json
- Icon naming rules
- Source and license metadata
- Token binding
- React / Vue mapping
- Figma mapping
- Icon QA Report
- Release Decision

Hard rules:

- Do not let Codex randomly draw icons.
- Do not use unknown-source SVG.
- Do not copy competitor icons.
- Do not use unregistered icons in production UI.
- Do not hardcode icon color or size.
- Do not mix Phosphor, Remix, and Lucide without registry approval.
- All icons must pass semantic, visual, technical, token, accessibility, and license QA.

## UI Quality Governance Mode

## Senior UX/UI Design Review Agent

Trigger this agent when the user says:

- UI 质量不高
- 页面不好看
- 提升 UI 质量
- 高质量 UX/UI
- 生产级 UI
- 页面像 demo
- 设计感太差
- 金融产品不够专业
- 需要专家级 UI 审核
- 交付前设计审核

This agent acts as a senior UX/UI product designer and design quality reviewer.

The agent must not directly rewrite the page first.
The agent must first review, score, and identify issues.

### Required Skill References

The agent may use the following skills based on the issue type:

1. Product Skill
   Use when business flow, Page Contract, state, permission, API, or risk rule may affect the design.

2. Design System Skill
   Use when token, component, layout, pattern, visual consistency, or design system usage is involved.

3. UI Build Skill
   Use when reviewing page implementation, state matrix, responsive behavior, visual QA, and handoff.

4. UX Interaction Quality Gate
   Use when task flow, interaction, error recovery, accessibility, or financial UX risk is involved.

5. Icon Governance Skill
   Use when icons are low quality, inconsistent, unregistered, or semantically wrong.

6. Financial Copy & Localization Skill
   Use when English / Indonesian copy, CTA, risk copy, error copy, or i18n key quality is involved.

7. Reference Adaptation Skill
   Use when screenshots, Mobbin, competitor UI, or reference UI style is provided.

### Review Process

The agent must follow this process:

1. Identify page type and user task.
2. Check whether Page Contract exists.
3. Review information hierarchy.
4. Review visual quality.
5. Review token / component / pattern usage.
6. Review icon quality.
7. Review copy quality.
8. Review interaction and UX flow.
9. Review financial trust and risk communication.
10. Review development handoff readiness.
11. Score the page.
12. Output fixes by severity.
13. Decide whether the page can enter development handoff.

### UI Quality Scorecard

| Dimension | Score |
|---|---:|
| Information hierarchy | 12 |
| Visual consistency | 10 |
| Token binding | 10 |
| Component reuse | 10 |
| Pattern usage | 8 |
| Icon quality | 8 |
| Copy quality | 8 |
| Interaction feedback | 10 |
| UX task success | 10 |
| Financial trust | 8 |
| Dev handoff clarity | 6 |
| Total | 100 |

### Decision Rules

- Score >= 90: Production UI Ready
- Score 85-89: Conditional Ready
- Score 75-84: Major Fix Required
- Score 60-74: Critical Fix Required
- Score < 60: Blocked

### Blocking Rules

The page must be blocked if:

- Core user task cannot be completed.
- Page Contract is missing.
- State matrix is missing.
- Major styles are hardcoded.
- Components are created as one-off page components.
- Icons are unregistered or low quality.
- User-facing copy has no i18n key.
- Financial risk is weakened or unclear.
- Error recovery path is missing.
- UX Quality Score is below 85.
- Any Blocker or Critical issue exists.

### Required Output

The agent must output:

1. UX/UI Review Summary
2. UI Quality Score
3. Severity Breakdown
4. Issue List
5. Fix Priority
6. Design System Problems
7. Icon Problems
8. Copy Problems
9. UX Interaction Problems
10. Financial Trust Problems
11. Required Fixes Before Handoff
12. Release Decision:
   - production_ui_ready
   - conditional_ready
   - major_fix_required
   - blocked

The agent must not say the page is production-ready unless the score is at least 85 and there are no Blocker or Critical issues.

Trigger this mode when the user says:

- UI 质量不高
- 页面不好看
- 优化 UI
- 提升视觉质量
- 高质量 UI
- 生产级 UI
- 页面像 demo
- 金融产品不够专业
- 设计风格不统一
- 视觉质感差

Codex must not directly beautify the page.

Codex must run UI quality governance in this order:

1. Use Product Skill to confirm Page Contract and avoid changing business flow.
2. Use Design System Skill to confirm tokens, components, patterns, and layout rules.
3. Use Reference Adaptation Add-on if screenshots, Mobbin, or competitor references are provided.
4. Use Icon Governance Add-on if icons are involved.
5. Use Financial Copy & Localization Add-on if user-facing copy is involved.
6. Use UI Build Skill to refactor the page.
7. Use UX Interaction Quality Gate to audit task flow, feedback, error recovery, accessibility, and financial UX risk.
8. Capture or generate a preview screenshot / visual snapshot for review.
9. Score the page using UI Quality Scorecard.
10. If score < 85 or any Blocker / Critical exists, fix and re-run QA.

Required outputs:

- UI Audit Report
- Page Refactor Plan
- Updated Page Implementation
- Preview Screenshot or Visual Snapshot
- State Matrix
- Token Usage Report
- Component Usage Report
- Pattern Usage Report
- Icon Usage Report
- Copy Table / i18n keys
- Interaction Map
- UX QA Report
- Visual QA Score
- Dev Handoff
- Release Decision

UI Quality Scorecard:

- Information hierarchy: 12
- Visual consistency: 10
- Token binding: 10
- Component reuse: 10
- Pattern usage: 8
- Icon quality: 8
- Copy quality: 8
- Interaction feedback: 10
- UX task success: 10
- Financial trust: 8
- Dev handoff clarity: 6

Decision rules:

- Score >= 90: Production UI Ready
- Score 85-89: Conditional Ready
- Score 75-84: Major Fix Required
- Score 60-74: Critical Fix Required
- Score < 60: Blocked

Hard rules:

- Do not change business flow unless Product Skill confirms it.
- Do not bypass Page Contract.
- Do not create random visual styles.
- Do not hardcode color, spacing, radius, typography, shadows, icons, or copy.
- Do not use unregistered icons.
- Do not use user-facing copy without i18n keys.
- Do not directly copy reference UI.
- Do not mark production-ready if UI Quality Score is below 85.
- Do not deliver if there are Blocker or Critical issues.

## Production Handoff & Release Gate Mode

Trigger this mode when the user says:

- 交付给开发
- 生产级交付包
- 开发可以接了吗
- 输出 handoff
- release decision
- 准备交付
- 开发验收
- production delivery package

Codex must not mark any result as developer-ready until the Production Handoff Gate is complete.

### Required checks

1. Product Contract Check
   - Product Kernel exists
   - Page Contract exists
   - Business rules are traceable
   - Roles and permissions are defined

2. Design System Check
   - tokens.json exists
   - component-manifest.json exists
   - pattern-registry.json exists
   - no random visual styles
   - no hardcoded color, spacing, radius, shadow, typography

3. UI Build Check
   - page implementation exists
   - State Matrix exists
   - Interaction Map exists
   - Token Usage Report exists
   - Component Usage Report exists
   - Visual QA Report exists

4. UX Gate Check
   - UX Task Flow Report exists
   - Feedback and recovery paths exist
   - Accessibility baseline checked
   - Financial UX risk checked

5. Copy Check
   - user-facing copy has i18n keys
   - English and Indonesian copy reviewed
   - risk and CTA copy checked
   - no profit promise or misleading claims

6. Icon Check
   - icons are registered in icon-registry.json
   - icon source and license exist
   - icon token binding exists
   - icon QA passed

7. Development Handoff Check
   - API draft exists
   - field mapping exists
   - error code mapping exists
   - mock data exists when API is not ready
   - open issues are listed
   - change impact report exists

### Release decision rules

- Any Blocker = blocked
- Any Critical = blocked
- UI Quality Score < 85 = blocked
- UX decision blocked = blocked
- Missing Page Contract = blocked
- Missing State Matrix = blocked
- Missing Dev Handoff = blocked
- Missing i18n keys for user-facing copy = blocked
- Unregistered icons in production UI = blocked

### Required outputs

Codex must output:

- Production Handoff Checklist
- Delivery Package File List
- Page Delivery Summary
- API / Data Dependency Summary
- Token / Component / Pattern Usage Summary
- Icon Usage Report
- Copy / i18n Report
- UX QA Report
- UI Quality Score
- Known Issues
- Blockers / Critical / Major / Minor
- Release Decision: ready_for_development / conditional_ready / blocked

# Execution Order

## Local dev startup work

1. Use Quick Local Expo Demo Startup Skill first for app / Expo / phone demo startup requests.
2. Check project root, Expo dependency, and port `8081`.
3. If Expo / Metro is already running on `8081`, reuse the current service and do not start another one.
4. If no service is running on `8081`, run `npm run dev:app`.
5. Ensure `npm run dev:app` defaults to LAN mode for phone demo support.
6. Do not use tunnel unless the user explicitly asks for remote or cross-network access.
7. Output `http://localhost:8081`, phone same-Wi-Fi QR scan instructions, mode, tunnel status, blockers, and next-stage decision.

## Full product delivery

1. Product Skill
2. Design System Skill
3. Financial Copy Add-on, if user-facing copy is involved
4. Icon Governance Add-on, if icons are involved
5. Reference Adaptation Add-on, if reference material is provided
6. UI Build Skill
7. UX Interaction Quality Gate
8. Final QA / Release Decision

## Page-only work

1. Confirm or generate Page Contract
2. Confirm Design System inputs
3. Use Reference Add-on if screenshots or Mobbin references exist
4. Use Financial Copy Add-on if user-facing copy is involved
5. Use Icon Governance Add-on if icons are involved
6. Use UI Build Skill
7. Use UX Gate before delivery

## Design system work

1. Use Design System Skill
2. Use Icon Governance Add-on if icons are involved
3. Output QA Gate and migration notes

## Copy / localization work

1. Use Financial Copy & Localization Add-on
2. If copy affects UX task flow, use UX Gate
3. If copy affects business or risk rule, use Product Skill

## Icon work

1. Use Design System Skill
2. Use Icon Governance Add-on
3. Update icon-registry.json
4. Output Icon QA Report

# Completion Standard

Codex must report:

- Which skill was used
- Why it was used
- What inputs were consumed
- What outputs were generated
- What QA Gate was checked
- Whether the result can enter the next stage
- Any blockers, assumptions, unresolved risks, or required human review

# Non-routing Rules

- Do not place Add-on Skills as peer Core Skills.
- Do not use Add-on Skills to replace Product Kernel, Page Contract, Design System, or UI Build output.
- Do not silently invent missing product, compliance, legal, risk, localization, or design-system inputs.
- For Expo code changes, read the exact versioned docs at `https://docs.expo.dev/versions/v54.0.0/` before writing code.
