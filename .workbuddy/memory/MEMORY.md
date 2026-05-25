# MEMORY.md - 长期记忆

## 项目约定

### 设计系统
- 表单组件（TextField、SelectField）默认文字不加粗，字重遵循设计令牌 `typography.bodySm` 的 `fontWeight: '400'`
- 所有 UI 样式优先绑定设计令牌（`typography`、`spacing`、`radius` 等），避免硬编码

### 技术栈
- 项目基于 Expo (React Native) + TypeScript
- 使用 pnpm 作为包管理器
- 启动命令：`npm run dev:app`，端口 `8081`，LAN 模式

### 用户偏好
- 简洁克制、高信息密度的产品设计风格
- 静默成功的交付体验（报错外无冗余输出）
- 优先构建通用组件库
