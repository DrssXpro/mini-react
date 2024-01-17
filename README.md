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

  1. 创建真实 DOM 保存至 fiber 上，更新真实 DOM props，挂载至视图 ✅
  2. 处理当前 fiber 的 children: 虚拟 DOM -> fiber 节点 并构建链表结构：return -> 父节点 child -> 子节点 sibling -> 兄弟节点 ✅
  3. 根据其链表特性处理后续的 fiber： 子 -> 兄弟 -> 叔... 顺序处理 ✅

- task4: 重构 render 方法实现: 建立根节点 fiber, 保证初始任务顺利执行 ✅

## Day3

目标 1：实现统一提交操作

目标 2：实现 function component

- task1: 考虑空闲时间受限导致界面不完全渲染问题，区分 DOM 创建和 DOM 添加操作，等 DOM 全部创建完成之后统一进行添加操作 ✅

- task2: 区分函数组件与普通节点的处理，函数组件的返回值拿到其 child 节点，将其作为 children 进行处理 ✅

- task3: 函数组件本身也会创建 fiber 节点，但不会创建 DOM，因此针对于函数组件跳过 DOM 添加操作 ✅

- task4: 函数组件的 child 与函数组件的父 fiber 进行连接 ✅

- task5: 考虑组件传值问题，子组件接收的 props 存放在 fiber.props 上，最终 props 属性会作用到 JSX 里作为文本的 fiber 节点 ✅

- task6: createElement 区分出传值处理，先考虑 number 类型传值 ✅

- task7: 考虑平行函数组件, 函数组件之间的 fiber 建立联系，其子 fiber 节点需要通过 parent 向上查找到 sibling 函数组件 fiber ✅


## Day5

目标：实现属性更新

- task1: 针对于属性更新增加事件属性处理，针对于事件属性添加对应的 DOM 事件 ✅

- task2: 实现 update 方法，增加 currentRoot 来保存上一次的整个 fiber 结构，针对于 fiber 结构增加 alternate 属性表示旧 fiber 的引用 ✅

- task3: 重构 initChildren 方法，额外补充更新操作，fiber 结构增加 effectTag 标记该节点状态（update or placement），并建立 alternate 关系 ✅

- task4: 重构 updateProps 方法，考虑新旧属性的更新、删除、添加 ✅