function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((c) => {
        const isTextNode = typeof c === "string" || typeof c === "number";
        return isTextNode ? createTextElement(c) : c;
      }),
    },
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
  wipRoot = {
    dom: container,
    props: { children: [vdom] },
  };
  nextWorkOfUnit = wipRoot;
}

// work in progress
let wipRoot = null;
// 更新使用，保存整个 fiber 结构
let currentRoot = null;
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(wipRoot.child);
  // dom 挂载完成后保存至 currentRoot
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.return;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.return;
  }
  // 通过 fiber 构建操作后每个 fiber 节点都会添加对应的 effectTag 属性表示该节点状态
  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) fiberParent.dom.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  // 新旧属性对比，进行更新、删除、添加 属性操作
  for (const key in prevProps) {
    if (key !== "children") {
      if (!nextProps.hasOwnProperty(key)) {
        dom.removeAttribute(key);
      }
    }
  }
  for (const key in nextProps) {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        // 考虑添加事件属性，以 on 开头提取 event name 进行添加
        if (key.startsWith("on")) {
          const event = key.slice(2).toLowerCase();
          // 由于组件更新会重新生成对应的 event handler，所以我们都需要把上一次的 handler 移除，再添加新 handler
          dom.removeEventListener(event, prevProps[key]);
          dom.addEventListener(event, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  }
}

function reconcileChildren(children, fiber) {
  // 借助父级的 fiber 结构，保存的 alternate 拿到旧 fiber
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  let newFiber = {};
  children.forEach((c, index) => {
    const isSameType = oldFiber && oldFiber.type === c.type;
    if (isSameType) {
      // update
      newFiber = {
        type: c.type,
        props: c.props,
        child: null,
        sibling: null,
        return: fiber,
        dom: oldFiber.dom,
        effectTag: "update", // fiber 结构新增 effectTag 用来表示该 fiber 节点的状态，后续在 commit 阶段根据 tag 进行不同操作
        alternate: oldFiber,
      };
    } else {
      // create
      newFiber = {
        type: c.type,
        props: c.props,
        child: null,
        sibling: null,
        return: fiber,
        dom: null,
        effectTag: "placement", // placement 放置，表示挂载创建
      };
    }

    // 如果有多个 child，第一个 child 可以通过 .child 访问，而后续几个 child 则是通过 sibling 连接
    if (oldFiber) oldFiber = oldFiber.sibling;

    if (index === 0) fiber.child = newFiber;
    else prevChild.sibling = newFiber;
    prevChild = newFiber;
  });
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(children, fiber);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  reconcileChildren(children, fiber);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) return fiber.child;

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.return;
  }
}

// 执行 update 操作，由于 workLoop 中属于一个无限递归循环，当更新了 nextWorkOfUnit 则会再次走一遍构建流程
function update() {
  // 根据首次挂载完成后保存的 fiber 结构，创建了新的 root
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot, // 新增 alternate 属性，用来保存 fiber 结构新旧 fiber 节点的互相引用值
  };
  nextWorkOfUnit = wipRoot;
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
  update,
};

export default React;
