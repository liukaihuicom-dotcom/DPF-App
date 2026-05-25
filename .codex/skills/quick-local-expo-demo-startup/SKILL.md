---
name: quick-local-expo-demo-startup
description: >
  Use for quick Expo, Metro, local app demo startup, mobile phone previews, QR scan demos,
  and local service reuse for Expo React Native projects. Checks project root, Expo dependency,
  port 8081 ownership, startup scripts, LAN mode, tunnel status, blockers, and next-stage decisions.
  Do not use for UI refactors, business feature development, production deployment, API work, or database setup.
---

# Quick Local Expo Demo Startup Skill v1.2.0

> L5 级快速启动本地 App / Expo / 手机 Demo 服务 Skill  
> 适用范围：Expo / React Native / Metro / 本地终端启动 / 手机扫码体验 Demo  
> 核心目标：用户一句“启动 app / 启动 Expo / 手机体验 demo”，Agent 立即检查、启动或复用本地 Expo 服务，让电脑和手机都能快速进入体验。

---

## 0. Skill 元信息

| 字段 | 内容 |
|---|---|
| Skill Name | Quick Local Expo Demo Startup Skill |
| Version | v1.2.0 |
| Level | L5：生产级快速启动执行 Skill |
| Primary Goal | 快速启动本地 Expo 服务，并支持手机体验 Demo |
| Scope | Expo 启动、Metro 启动、LAN 调试、手机扫码体验、本地服务复用 |
| Not Scope | UI 重构、业务功能开发、生产部署、接口开发、数据库配置 |
| Default Port | Expo / Metro：8081 |
| Default Phone Mode | LAN |
| Default Local Mode | localhost |
| Execution Type | 本地 Agent 可按规则检查、启动、复用 Expo 服务 |
| Safety Rule | 不静默 kill 进程，不随机换端口，不默认 tunnel |

---

## 1. Skill 定位

本 Skill 的定位不是“复杂工程治理”，而是“快速启动服务”。

用户只需要输入：

```txt
启动 app
```

或：

```txt
启动 Expo
```

或：

```txt
手机体验 demo
```

Agent 必须自动完成：

```txt
识别项目
→ 检查是否已有 Expo / Metro 服务
→ 有服务则复用
→ 无服务则启动
→ 默认 LAN 支持手机体验
→ 输出电脑本地地址和手机体验方式
```

---

## 2. 核心使用场景

| 用户目标 | Agent 应做什么 |
|---|---|
| 我想快速启动 App | 检查 8081，未启动则执行 Expo 启动命令 |
| 我电脑终端已经启动 Expo | 不重复启动，复用已有服务 |
| 我想手机体验 Demo | 使用 LAN 模式启动或提示扫描终端二维码 |
| 我想本机看服务 | 输出 localhost / Metro 地址 |
| 我想让别人远程体验 | 仅在用户明确要求时使用 tunnel |
| 端口被占用 | 判断是否为已有 Expo 服务，是则复用，不是则提示占用 |

---

## 3. 触发词

当用户输入以下任意描述时，必须调用本 Skill。

### 3.1 中文触发词

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

### 3.2 英文触发词

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

---

## 4. 默认启动策略

本 Skill 的默认策略是：

| 优先级 | 策略 | 说明 |
|---:|---|---|
| P0 | 复用已有 Expo 服务 | 如果 8081 已经是 Expo / Metro 服务，不重复启动 |
| P1 | 启动 LAN 模式 | 手机体验 Demo 默认使用 LAN |
| P2 | 输出本地访问方式 | 给电脑端 localhost / Metro 地址 |
| P3 | 必要时提醒 tunnel | 只有跨网络或远程预览才使用 tunnel |
| 禁止 | 随机换端口 | 8081 被占用时不能自动换 8082 |

---

## 5. 标准端口和模式

| 类型 | 标准端口 | 默认模式 | 用途 |
|---|---:|---|---|
| Expo / Metro | 8081 | LAN / localhost | App 本地开发服务 |
| 手机体验 | 8081 | LAN | 手机和电脑同 Wi-Fi 扫码体验 |
| Tunnel | 8081 | 手动触发 | 不同网络远程预览 |
| Web Preview | 5173 | localhost | 如果项目同时存在 Web 预览 |

---

## 6. package.json 标准脚本

Agent 必须检查 `package.json`。如果缺少以下脚本，应自动补齐。

```json
{
  "scripts": {
    "dev:app": "npx expo start --lan --port 8081",
    "dev:app:local": "npx expo start --localhost --port 8081",
    "start:lan": "npx expo start --lan --port 8081",
    "start:tunnel": "npx expo start --tunnel --port 8081",
    "start:clear": "npx expo start --lan --port 8081 --clear",
    "check:expo": "lsof -i :8081"
  }
}
```

### 6.1 脚本说明

| 脚本 | 场景 | 是否默认 |
|---|---|---|
| `npm run dev:app` | 默认启动 App，支持手机 LAN 体验 | 是 |
| `npm run dev:app:local` | 仅电脑本机调试 | 否 |
| `npm run start:lan` | 手机扫码体验 Demo | 是 |
| `npm run start:tunnel` | 远程体验 Demo | 否 |
| `npm run start:clear` | 缓存异常时清缓存启动 | 否 |
| `npm run check:expo` | 检查 8081 是否有服务 | 启动前使用 |

---

## 7. 快速启动执行流程

当用户说“启动 app / 启动 Expo / 手机体验 demo”时，Agent 必须按以下流程执行。

| 步骤 | 动作 | 判断 |
|---:|---|---|
| 1 | 确认当前目录 | 是否为项目根目录 |
| 2 | 检查 `package.json` | 是否为 Node / Expo 项目 |
| 3 | 检查 Expo 依赖 | 是否存在 `expo` |
| 4 | 检查 8081 端口 | 是否已有服务 |
| 5 | 判断已有服务类型 | 是 Expo 则复用，不是 Expo 则提示占用 |
| 6 | 检查启动脚本 | 缺失则补齐 |
| 7 | 启动服务 | 默认执行 `npm run dev:app` |
| 8 | 输出体验方式 | 电脑本地 + 手机 LAN |
| 9 | 给出下一步 | 扫码、打开 Expo Go、保持同 Wi-Fi |

---

## 8. 已有 Expo 服务复用规则

如果用户电脑终端已经启动 Expo 服务，Agent 不应重复启动。

### 8.1 检查方式

```bash
lsof -i :8081
```

如果检测到 8081 有服务，Agent 应进一步判断是否可能为 Expo / Metro。

可使用：

```bash
curl -I http://localhost:8081
```

或：

```bash
curl http://localhost:8081/status
```

### 8.2 复用输出

如果判断已有 Expo / Metro 服务，Agent 应输出：

```txt
检测到 Expo / Metro 服务已在运行，已复用当前服务。

本机 Metro 地址：
http://localhost:8081

手机体验：
请查看当前终端中的 Expo QR Code。
手机和电脑需要连接同一个 Wi-Fi。
使用 Expo Go 或对应开发构建扫描二维码即可体验。

当前未重新启动服务。
```

---

## 9. 无服务时自动启动规则

如果 8081 未被占用，Agent 应执行：

```bash
npm run dev:app
```

对应命令：

```bash
npx expo start --lan --port 8081
```

启动成功后应输出：

```txt
Expo 服务已启动。

本机 Metro：
http://localhost:8081

手机体验 Demo：
1. 确保手机和电脑连接同一个 Wi-Fi。
2. 打开 Expo Go 或开发构建。
3. 扫描终端中的二维码。
4. 如果无法连接，检查 Wi-Fi、VPN、防火墙或改用 tunnel。

当前模式：
LAN

当前端口：
8081
```

---

## 10. 手机体验 Demo 默认规则

手机体验 Demo 默认使用 LAN 模式。

```bash
npm run start:lan
```

### 10.1 手机体验前提

| 条件 | 要求 |
|---|---|
| 网络 | 手机和电脑连接同一个 Wi-Fi |
| 服务 | Expo / Metro 正常运行 |
| 端口 | 8081 未被其他服务占用 |
| 工具 | Expo Go 或对应 Dev Build |
| VPN | 如无法连接，优先关闭 VPN 或切换网络 |
| 防火墙 | 本机防火墙不得阻止局域网访问 |

### 10.2 手机体验输出

```txt
手机 Demo 已准备好。

请在手机上操作：
1. 连接与电脑相同的 Wi-Fi。
2. 打开 Expo Go 或当前项目的 Dev Build。
3. 扫描电脑终端中的二维码。
4. 如果无法打开，先检查网络和 VPN。

当前使用 LAN 模式，不是 tunnel。
```

---

## 11. Tunnel 使用规则

Tunnel 不是默认启动方式。

只有用户明确输入以下描述时，才允许使用：

- 使用 tunnel
- 手机和电脑不在同一个 Wi-Fi
- 给别人远程体验
- 外网访问 demo
- 远程预览
- LAN 连不上，改用 tunnel

执行命令：

```bash
npm run start:tunnel
```

输出必须提醒：

```txt
当前使用 tunnel 模式。

注意：
tunnel 链接通常是临时地址，每次启动可能变化。
如果只是本地和手机同 Wi-Fi 调试，建议优先使用 LAN。
```

---

## 12. 端口占用处理

### 12.1 端口被 Expo 占用

如果 8081 已被 Expo / Metro 使用：

```txt
复用已有 Expo 服务，不重新启动。
```

### 12.2 端口被其他程序占用

如果 8081 被非 Expo 服务占用：

```txt
启动失败。

原因：
端口 8081 已被其他程序占用。

处理方式：
请关闭占用 8081 的程序，或明确授权 Agent 释放端口。

检查命令：
lsof -i :8081

注意：
本 Skill 不允许自动切换到 8082。
```

### 12.3 禁止自动 kill

Agent 禁止在未确认情况下执行：

```bash
kill -9 <PID>
```

只有用户明确说“释放端口 / kill 掉占用进程 / 关闭旧服务”时才允许执行。

---

## 13. 缓存异常处理

如果 Expo 启动成功但手机打不开，或页面异常缓存，可执行：

```bash
npm run start:clear
```

对应命令：

```bash
npx expo start --lan --port 8081 --clear
```

但必须先说明：

```txt
将使用 --clear 清理 Metro 缓存后重新启动 Expo 服务。
这不会修改业务代码，只会清理本地构建缓存。
```

---

## 14. 本地电脑终端启动规则

本 Skill 支持用户在电脑终端启动 Expo 服务。

### 14.1 Agent 可执行

如果 Agent 运行在本地电脑，并具备终端权限，可以直接执行：

```bash
npm run dev:app
```

或：

```bash
npm run start:lan
```

### 14.2 用户可手动执行

如果 Agent 没有终端权限，必须给用户输出最短命令：

```bash
npm run dev:app
```

如果用户只想手机体验：

```bash
npm run start:lan
```

如果缓存异常：

```bash
npm run start:clear
```

---

## 15. 快速启动命令矩阵

| 需求 | 推荐命令 | 说明 |
|---|---|---|
| 快速启动 App + 手机体验 | `npm run dev:app` | 默认 LAN |
| 只在电脑本机调试 | `npm run dev:app:local` | localhost |
| 手机扫码体验 | `npm run start:lan` | 同 Wi-Fi |
| 清缓存后启动 | `npm run start:clear` | 解决缓存异常 |
| 远程体验 | `npm run start:tunnel` | 链接可能变化 |
| 检查是否已启动 | `npm run check:expo` | 查看 8081 |

---

## 16. 启动成功标准输出

### 16.1 快速启动 App

```txt
Expo 服务已启动。

本机 Metro：
http://localhost:8081

手机体验 Demo：
请确保手机和电脑连接同一个 Wi-Fi，然后使用 Expo Go 或 Dev Build 扫描终端二维码。

当前模式：
LAN

当前端口：
8081

当前未使用 tunnel。
```

### 16.2 已有服务复用

```txt
检测到 Expo / Metro 服务已在运行，已复用当前服务。

本机 Metro：
http://localhost:8081

手机体验 Demo：
请扫描当前终端中的 Expo QR Code。

当前没有重复启动服务。
```

### 16.3 需要用户手动执行

```txt
当前 Agent 无法直接控制本机终端。

请在项目根目录执行：

npm run dev:app

手机体验：
保持手机和电脑同 Wi-Fi，扫描终端中的 Expo QR Code。
```

---

## 17. 启动失败标准输出

### 17.1 非项目根目录

```txt
启动失败。

原因：
当前目录不是项目根目录，未找到 package.json。

请先进入项目根目录，再执行：

npm run dev:app
```

### 17.2 非 Expo 项目

```txt
启动失败。

原因：
当前项目未检测到 Expo 依赖。

请确认这是 Expo / React Native 项目，或检查 package.json 中是否存在 expo。
```

### 17.3 端口被非 Expo 服务占用

```txt
启动失败。

原因：
8081 被其他服务占用。

检查命令：
lsof -i :8081

请关闭占用进程后重新执行：

npm run dev:app

本 Skill 不会自动切换端口。
```

---

## 18. 禁止行为

Agent 禁止执行以下行为：

1. 禁止默认使用 tunnel。
2. 禁止端口 8081 被占用时自动换成 8082。
3. 禁止未确认就 kill 进程。
4. 禁止重复启动多个 Expo 服务。
5. 禁止已有 Expo 服务时强制重启。
6. 禁止启动失败后随机尝试命令。
7. 禁止把 tunnel 链接说成固定链接。
8. 禁止把 LAN IP 说成永久链接。
9. 禁止未检查项目类型就启动。
10. 禁止为了“能跑”破坏固定端口规则。

---

## 19. AGENTS.md 接入规则

建议在项目根目录 `AGENTS.md` 中写入：

```md
# Agent Execution Rules

## Quick Local Expo Demo Startup

当用户输入以下内容时：

- 启动 app
- 启动 Expo
- 启动本地服务
- 启动本地演示
- 手机体验 demo
- 手机扫码体验
- 跑一下 app
- 打开 app demo

必须优先调用：

`.codex/skills/quick-local-expo-demo-startup/SKILL.md`

执行规则：

1. 优先检查 8081 是否已有 Expo / Metro 服务。
2. 如果已有 Expo / Metro 服务，复用当前服务，不重复启动。
3. 如果没有服务，默认执行 `npm run dev:app`。
4. `npm run dev:app` 必须使用 LAN 模式，支持手机体验 Demo。
5. 手机体验默认要求手机和电脑连接同一个 Wi-Fi。
6. 不默认使用 tunnel。
7. 端口 8081 被非 Expo 服务占用时停止，不自动换端口。
8. 禁止未确认就 kill 进程。
9. 启动成功后必须输出本机 Metro 地址和手机体验方式。
```

---

## 20. Codex 接入话术

将本 Skill 给 Codex 时，使用以下话术：

```txt
请将 .codex/skills/quick-local-expo-demo-startup/SKILL.md 接入 AGENTS.md。

以后当我说：

- 启动 app
- 启动 Expo
- 手机体验 demo
- 启动本地服务
- 跑一下 app

你必须优先调用这个 Skill。

目标不是复杂治理，而是快速启动本地 Expo 服务并支持手机体验 Demo。

执行要求：
1. 先检查 8081 是否已有 Expo / Metro 服务。
2. 如果已有服务，直接复用，不重复启动。
3. 如果没有服务，执行 npm run dev:app。
4. npm run dev:app 默认使用 LAN 模式。
5. 手机体验时提醒同 Wi-Fi，并扫描终端 Expo QR Code。
6. 不默认使用 tunnel。
7. 不随机换端口。
8. 不静默 kill 进程。
9. 启动后输出 localhost:8081 和手机体验方式。
```

---

## 21. L5 验收标准

| 验收项 | 通过标准 |
|---|---|
| 一句话启动 | 用户说“启动 app”即可触发 |
| 快速启动 | 无服务时直接启动 Expo |
| 服务复用 | 已有 Expo 服务时不重复启动 |
| 手机体验 | 默认 LAN，支持手机扫码 Demo |
| 本地体验 | 输出 `http://localhost:8081` |
| 端口稳定 | Expo / Metro 固定 8081 |
| Tunnel 管理 | 不默认使用 tunnel |
| 失败明确 | 启动失败有原因和处理方式 |
| 终端兼容 | 支持 Agent 执行和用户手动执行 |
| 可维护 | 接入 AGENTS.md 后长期有效 |

---

## 22. 版本记录

| 版本 | 日期 | 内容 |
|---|---|---|
| v1.0.0 | 2026-05-24 | 建立本地启动端口治理规则 |
| v1.1.0 | 2026-05-24 | 新增本地终端执行权限和启动控制规则 |
| v1.2.0 | 2026-05-24 | 调整为快速启动 Expo / 手机 Demo 服务 Skill，默认复用服务或 LAN 启动 |
