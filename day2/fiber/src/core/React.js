function createElement(type, props, ...children) {
  return {
    type,
    props: { ...props, children: children.map((c) => (typeof c === "string" ? createTextElement(c) : c)) },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      textContent: text,
      children: [],
    },
  };
}

function render(vdom, container) {
  // render 操作即创建一个根 fiber 节点，延续后面 fiber 构建
  nextWorkOfUnit = {
    dom: container,
    props: { children: [vdom] },
  };
}

// 当前工作的 fiber 节点
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  // 在空闲时间内循环构造 fiber 结构以及渲染视图
  while (!shouldYield && nextWorkOfUnit) {
    // 根据其 fiber 链表结构：父 -> 子 -> 兄弟 -> 叔... 顺序处理
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    // 判断是否还有空闲时间
    shouldYield = deadline.timeRemaining() < 1;
  }
}

function createDom(type) {
  return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type);
}

function updateProps(dom, props) {
  for (const key in props) {
    if (key !== "children") {
      dom[key] = props[key];
    }
  }
}

function initChildren(fiber) {
  // fiber.props.children 上保存的孩子节点属于虚拟 DOM
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((c, index) => {
    // 针对于每一个虚拟 DOM，创建对应的 fiber 节点
    const newFiber = {
      type: c.type,
      props: c.props,
      child: null,
      sibling: null,
      return: fiber,
      dom: null,
    };
    // 创建 fiber 节点的同时构建其链表结构，即 child -> 子节点，sibling -> 兄弟节点 return -> 父节点
    if (index === 0) fiber.child = newFiber;
    else prevChild.sibling = newFiber;
    prevChild = newFiber;
  });
}

function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    // 在 fiber 节点上创建并真实 DOM
    const dom = (fiber.dom = createDom(fiber.type));
    // 执行 DOM 操作，添加节点
    fiber.return.dom.append(dom);
    // 将 fiber 上的 props 更新到真实 DOM 上
    updateProps(dom, fiber.props);
  }
  // 处理孩子 fiber 节点
  initChildren(fiber);

  // 当前 fiber 节点处理完成，开始按照: 子 -> 兄弟 -> 叔... 顺序处理
  if (fiber.child) return fiber.child;

  if (fiber.sibling) return fiber.sibling;

  return fiber.return?.sibling;
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};

export default React;
