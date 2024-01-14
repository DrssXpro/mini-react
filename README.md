# mini-react

## Day1

目标：仿照 React 最基本语法实现 API 将组件渲染至视图上

- task1: 将 app 内容展示到 root 容器里 ✅

- task2: 引入虚拟 DOM，用 JS 对象描述 DOM 节点 ✅

- task3: 动态创建虚拟 DOM 方法 ✅

- task4: 根据虚拟 DOM 动态创建真实 DOM ✅

- task5: 类比 React 使用方法实现 API 渲染 DOM ✅
 
- task6: 借助 Vite 编译 jsx 文件 ✅


## Day2

目标：实现 fiber 架构

- task1: 熟悉 requestIdleCallback API 基本概念 ✅

- task2: 利用 requestIdleCallback API 在空闲时间段执行任务（构建 fiber 以及处理真实 DOM） ✅

- task3: 学习 fiber 构建过程：

  1. 创建真实 DOM保存至 fiber 上，更新真实 DOM props，挂载至视图 ✅
  2. 处理当前 fiber 的 children: 虚拟 DOM -> fiber 节点 并构建链表结构：return -> 父节点 child -> 子节点 sibling -> 兄弟节点 ✅
  3. 根据其链表特性处理后续的 fiber： 子 -> 兄弟 -> 叔... 顺序处理 ✅

- task4: 重构 render 方法实现: 建立根节点 fiber, 保证初始任务顺利执行 ✅