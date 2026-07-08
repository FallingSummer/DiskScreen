# DataScreenPractice

Vue 3 数据大屏项目，基于 TypeScript + Vite 构建，用于展示数据可视化大屏。

## 技术栈

- Vue 3.5
- TypeScript 5.6
- Vite 5.4
- ECharts 5
- Pinia 2.3
- Vue Router 4.4
- Sass

## 项目结构

```
src/
├── api/          # 接口定义
├── assets/       # 静态资源
├── components/   # 公共组件
│   ├── decorations/
│   ├── TrendChart.vue
│   ├── RealtimeLineChart.vue
│   ├── ProportionPieChart.vue
│   ├── DataTable.vue
│   ├── DataOverview.vue
│   └── ...
├── config/       # 全局配置
├── constants/    # 常量定义
├── layouts/      # 布局组件
├── mock/         # Mock 数据
├── modules/      # 业务模块
│   ├── DataModule/
│   ├── LogModule/
│   └── TestModule/
├── router/       # 路由配置
├── services/     # 数据服务层
├── stores/       # Pinia 状态管理
├── styles/       # 全局样式
├── types/        # TypeScript 类型定义
├── utils/        # 工具函数
├── views/        # 页面视图
├── App.vue
└── main.ts
```
![图片](image-1.png)


## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 其他命令

```bash
# 代码检查
npm run lint

# 格式化代码
npm run format

# 类型检查
npm run typecheck

# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage
```

## 开发约定

- 代码风格：ESLint + Prettier
- 提交规范：Conventional Commits（commitlint）
- 模块按业务领域拆分在 `src/modules/` 下
- 数据请求统一通过 `src/services/` 层
