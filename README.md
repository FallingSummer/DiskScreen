# DataScreenPractice

服务器监控数据可视化大屏，前后端分离架构，提供实时服务器状态、性能趋势、网络流量、磁盘利用率及告警分布等可视化能力。

![alt text](/screen-main/project/image-1.png)
## 系统架构

```
screen-main/
├── project/          # 前端：Vue 3 + TypeScript + Vite
│   ├── src/
│   │   ├── api/          # API 定义
│   │   ├── components/   # 公共组件
│   │   ├── config/       # 全局配置
│   │   ├── mock/         # 模拟数据
│   │   ├── modules/      # 业务模块
│   │   ├── router/       # 路由
│   │   ├── services/     # 数据服务层
│   │   ├── stores/       # Pinia 状态管理
│   │   ├── types/        # TS 类型定义
│   │   └── views/        # 页面视图
│   └── package.json
│
├── backend/           # 后端：Express.js + TypeScript
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── services/     # 业务逻辑
│   │   ├── routes/       # 路由
│   │   ├── config/       # 配置
│   │   └── app.ts        # 入口
│   ├── scripts/
│   │   └── EtlScript.py  # ETL 数据加工脚本
│   └── package.json
│
└── database/
    └── DdlScript.sql     # MySQL 建表脚本
```

## 技术栈

### 前端

- Vue 3.5 + TypeScript 5.6 + Vite 5.4
- ECharts 5 / Pinia 2.3 / Vue Router 4.4
- Sass / Axios 1.7
- ESLint + Prettier + Husky
- Vitest（单元测试）

### 后端

- Express.js 4.x + TypeScript 5.6
- mysql2（纯 promise 模式，无连接池）
- dotenv / cors
- ts-node-dev（开发热更新）

### 数据层

- MySQL（InnoDB / utf8mb4）
- 4 张结果表：主机性能小时聚合、磁盘性能小时聚合、网络流量小时聚合、服务器实时状态快照
- ETL 由 Python（pandas + pymysql）独立脚本执行

## 数据流

```
外部监控系统（PrefTsar / DiskTsar / HostDetail）
        │
        ▼  .dat 原始文件（.uploads/）
ETL 脚本（EtlScript.py）
        │
        ▼  TRUNCATE + REPLACE INTO
MySQL · DataScreenDB（4 张结果表）
        │
        ▼  SELECT（mysql2）
Express API 服务（/api/v1）
        │
        ▼  HTTP GET（JSON）
Vue 前端（Axios → Repository → Pinia → 可视化组件）
```

### API 端点

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /api/v1/status-snapshot | 服务器实时状态快照 |
| GET | /api/v1/performance-hourly | 主机性能指标小时聚合 |
| GET | /api/v1/disk-hourly | 磁盘性能指标小时聚合 |
| GET | /api/v1/network-hourly | 网络流量小时聚合 |
| GET | /health | 健康检查 |

前端通过 `VITE_DATA_SOURCE` 环境变量切换数据源：`mock`（前端模拟数据）或 `api`（真实后端接口）。

## 前置要求

- Node.js >= 18
- MySQL >= 8.0
- Python 3（ETL 用）

## 快速开始

### 1. 克隆与依赖

```bash
cd screen-main

# 前端依赖
cd project && npm install

# 后端依赖
cd ../backend && npm install
```

### 2. 初始化数据库

在 MySQL 中执行建表脚本：

```bash
mysql -u root -p < screen-main/backend/database/DdlScript.sql
```

或手动导入。

### 3. 配置后端环境变量

复制 `screen-main/backend/.env`（已存在默认值），按需修改：

| 变量 | 默认值 | 说明 |
|---|---|---|
| PORT | 3000 | 后端服务端口 |
| DB_HOST | localhost | MySQL 地址 |
| DB_PORT | 3306 | MySQL 端口 |
| DB_USER | root | 用户名 |
| DB_PASS | password | 密码 |
| DB_NAME | DataScreenDB | 数据库名 |
| MOCK_MODE | false | true 时返回模拟数据，不查库 |

### 4. 启动后端

```bash
cd screen-main/backend

# 开发模式（热更新）
npm run dev

# 生产模式
npm run build && npm run start
```

### 5. 导入数据（ETL）

将监控系统产出的 4 个 `.dat` 文件放入 `.uploads/` 目录，然后执行：

```bash
cd screen-main/backend
npm run etl
```

每次执行会 **清空并重建** 4 张结果表的所有数据。

### 6. 启动前端

```bash
cd screen-main/project

# 默认使用 mock 数据（无需后端）
npm run dev

# 修改 .env 为 VITE_DATA_SOURCE=api 以连接真实后端
npm run dev
```

前端默认运行在 `http://localhost:5173`。

## 其他命令

```bash
# 代码检查
cd screen-main/project && npm run lint
cd screen-main/backend && npm run lint   # 如有配置

# 格式化代码
cd screen-main/project && npm run format

# 类型检查
cd screen-main/project && npm run typecheck

# 构建生产版本
cd screen-main/project && npm run build

# 运行测试
cd screen-main/project && npm run test

# 测试覆盖率
cd screen-main/project && npm run test:coverage
```

## 项目约定

- 代码风格：ESLint + Prettier
- 提交规范：Conventional Commits（commitlint）
- 数据库命名：表名与字段名使用**大驼峰**（PascalCase）
- 前端默认数据源为 `mock`，连接真实后端需设置 `VITE_DATA_SOURCE=api`
- 后端无连接池，每次请求新建连接并在 `finally` 中关闭
- ETL 为全量刷新（`TRUNCATE + REPLACE`），非增量写入
