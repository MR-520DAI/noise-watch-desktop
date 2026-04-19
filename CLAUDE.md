# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**项目名称**: Noise Watch Desktop（正反馈楼上楼下好邻居）

**项目类型**: 跨平台桌面应用程序，用于监听麦克风输入并在噪音超过设定阈值时触发本地提醒。

**技术栈**:
- Electron v41.1.0 - 桌面应用框架
- React v19.2.4 - 前端UI框架
- TypeScript ~5.9.3 - 类型安全的JavaScript超集
- Vite v8.0.1 - 前端构建工具
- Web Audio API - 音频处理

**Node版本要求**: Node.js 20.19+ 或 22.12+，推荐Node 22 LTS

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动开发模式（Vite + Electron） |
| `npm run dev:vite` | 只启动Vite开发服务器 |
| `npm run build` | 构建前端产物（TypeScript检查 + Vite构建） |
| `npm run lint` | 代码检查（ESLint） |
| `npm run preview` | 预览构建产物 |
| `npm run pack` | 打包成未压缩目录（用于测试） |
| `npm run dist` | 生成生产安装包，需要管理员权限 |

## 代码架构

### 目录结构
```
noise-watch-desktop/
├── electron/                 # Electron 主进程代码
│   ├── main.cjs             # 主入口，创建窗口，处理IPC通信
│   └── preload.cjs          # Preload脚本，暴露API给渲染进程
├── src/                      # React 前端代码（渲染进程）
│   ├── components/          # UI组件
│   ├── App.tsx              # 主应用组件，核心逻辑
│   ├── appLogic.ts          # 业务逻辑工具函数
│   ├── i18n.ts              # 国际化（中英文）
│   ├── persistence.ts       # 持久化层
│   └── types.ts             # TypeScript类型定义
├── scripts/                  # 开发辅助脚本
├── build/                    # 构建资源（NSIS脚本）
└── public/                   # Vite静态资源
```

### 架构概览
采用经典的Electron分层架构：
- **渲染进程**: React UI（App.tsx、组件、业务逻辑）
- **主进程**: Electron（窗口管理、文件I/O、IPC处理）
- **通信**: 经由 preload.cjs 的 contextBridge 暴露安全API

### 核心模块

| 文件 | 职责 |
|------|------|
| `src/App.tsx` | 主应用组件，包含噪音监测的核心逻辑、音频处理、状态管理 |
| `src/appLogic.ts` | 业务逻辑工具：频段计算、设备枚举、日志创建等 |
| `src/types.ts` | TypeScript类型定义（配置、统计、日志等） |
| `electron/main.cjs` | 主进程：窗口创建、IPC处理、文件系统操作 |
| `electron/preload.cjs` | 暴露安全API给渲染进程 |

### 核心判定逻辑
在 `App.tsx` 的 `tick()` 方法中（requestAnimationFrame 循环）：
1. 获取选中频段的当前dB值
2. 如果dB >= 阈值，记录一次冲击
3. 如果在时间窗口内冲击次数 >= 触发次数且不在冷却期：
   - 触发提醒，播放提醒音
   - 重置冲击次数，设置冷却时间
4. 更新UI状态，写入持久化数据

### 频段定义
- **低频 (low)**: 20-200Hz - 脚步声、跺脚等
- **中频 (mid)**: 200-2000Hz - 说话、日常活动
- **高频 (high)**: 2000-8000Hz - 拖动家具、尖锐声音

### 数据输出位置
- **实时JSON**: `userData/events/latest-events.json` - 持续覆盖写入
- **周期CSV**: `userData/exports/latest-events.csv` - 每5分钟自动覆盖导出

## 开发注意事项

1. **开发模式端口**: 默认使用5174（可通过 `VITE_PORT` 环境变量修改）
2. **音频权限**: macOS/Windows 需要麦克风权限才能正常使用
3. **dBFS单位**: 显示的是 dBFS（数字满刻度分贝），0为最大值，负数越小表示输入越弱
4. **持久化**: 每秒写入一次JSON快照，每5分钟导出一次CSV
5. **国际化**: 所有界面文本在 `src/i18n.ts` 中定义，支持中英文切换
