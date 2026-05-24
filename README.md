# Dupoin MVP

Production-oriented Expo SDK 54 app scaffold for a simulated FX/CFD broker experience.

## Runtime

| Area | Version |
|---|---|
| Expo SDK | 54 |
| Expo Router | 6 |
| React | 19.1 |
| React Native | 0.81 |
| React Native Web | 0.21 |

Expo SDK 54 requires Node.js 20.19.x or newer in the SDK reference.

## Directory Map

| Path | Purpose |
|---|---|
| `app/` | Expo Router screens and route groups |
| `src/` | Production app source: components, domain, state, i18n, theme, feedback |
| `assets/` | Runtime app assets referenced by Expo config |
| `docs/` | Product delivery model, roles, rules, state, routing, risk, release notes |
| `design-system/` | Token, component, business component, pattern, platform, and quality governance |
| `api-contracts/` | OpenAPI scaffold, JSON schemas, error codes, mocks, API mapping |
| `handoff/` | Page delivery templates and future page-specific handoff packages |
| `qa/` | QA gate metadata and visual verification artifacts |
| `scripts/dev/` | Local development utilities |
| `scripts/qa/` | Executable production delivery checks |
| `tests/` | Test strategy and future automated tests |
| `archive/` | Deprecated or legacy assets excluded from runtime builds |

## Commands

```sh
npm run start
npm run start:expo
npm run dev:app
npm run dev:app:local
npm run start:lan
npm run start:tunnel
npm run start:clear
npm run check:expo
npm run check:ports
npm run quote-proxy
npm run qa:all
npm exec tsc --noEmit
```

## 本地启动说明

### Expo / App 本地启动

```bash
npm run dev:app
```

默认使用 LAN 模式，支持手机体验 Demo。

默认 Metro 端口：

```txt
8081
```

默认访问：

```txt
http://localhost:8081
```

### 已有服务复用

启动前先检查：

```bash
npm run check:expo
```

如果 `8081` 已经是 Expo / Metro 服务，直接复用当前服务，不重复启动。

### 仅电脑本机调试

```bash
npm run dev:app:local
```

用于不需要手机扫码体验的 localhost 模式。

### 手机 LAN 调试

```bash
npm run start:lan
```

要求：

- 手机和电脑连接同一个 Wi-Fi。
- 不默认使用 tunnel。
- 如果切换 Wi-Fi、VPN、热点，LAN IP 可能变化。
- 使用 Expo Go 或当前项目的 Dev Build 扫描终端中的 Expo QR Code。

### 清缓存启动

```bash
npm run start:clear
```

仅在 Expo 启动成功但手机打不开或页面缓存异常时使用。

### Tunnel 调试

```bash
npm run start:tunnel
```

仅在以下场景使用：

- 远程演示。
- 手机和电脑不在同一个网络。
- LAN 无法访问。

### localhost / LAN / tunnel 区别

| 类型 | 示例 | 使用场景 | 是否稳定 |
|---|---|---|---|
| localhost | http://localhost:8081 | 电脑本机访问 Metro | 稳定 |
| LAN | exp://192.168.x.x:8081 | 手机同 Wi-Fi 调试 | IP 可能变化 |
| tunnel | https://xxx.ngrok.app | 外网访问 | 通常不稳定 |

### 固定端口规则

| 类型 | 固定端口 |
|---|---:|
| Expo / Metro | 8081 |

如果端口被占用，启动命令必须直接报错，不允许自动切换端口。

## Production Delivery Rule

Before adding a new production page, create a handoff package from `handoff/templates/`, map it to `docs/`, `design-system/`, and `api-contracts/`, then run `npm run qa:all`.
