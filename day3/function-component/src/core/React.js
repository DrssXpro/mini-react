function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((c) => {
        // 父组件给子组件传递的 props 在子组件中会被当做 children 传递，因此区分判断进行处理
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
  nextWorkOfUnit = {
    dom: container,
    props: { children: [vdom] },
  };
  fiberRoot = nextWorkOfUnit;
}

let fiberRoot = null;
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // 考虑到如果空闲时间过少导致 DOM 不完全渲染问题（渲染一半，另一半由于没有空闲时间被无限滞后）
  // 因此将 dom 的创建 和 dom 添加区分，等创建所有节点并建立联系后统一提交添加
  if (!nextWorkOfUnit && fiberRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(fiberRoot.child);
  fiberRoot = null;
}

// 递归进行添加操作：当前 fiber 节点 -> 子节点 -> 兄弟节点
function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.return;
  // 考虑到函数组件也会为其创建 fiber 对象，但是该对象上不会创建 dom
  // 因此不需要进行 DOM 添加操作而是找到其 parent 节点，然后与其 child 节点进行连接添加
  // 使用 while 循环考虑到了函数组件嵌套问题，必须要找到一个有 dom 节点的 fiber 节点
  while (!fiberParent.dom) {
    fiberParent = fiberParent.return;
  }
  // 跳过函数组件的 fiber
  if (fiber.dom) fiberParent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
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

function initChildren(children, fiber) {
  let prevChild = null;
  children.forEach((c, index) => {
    const newFiber = {
      type: c.type,
      props: c.props,
      child: null,
      sibling: null,
      return: fiber,
      dom: null,
    };
    if (index === 0) fiber.child = newFiber;
    else prevChild.sibling = newFiber;
    prevChild = newFiber;
  });
}

function updateFunctionComponent(fiber) {
  // 针对于函数组件，通过 type 属性拿到该函数内容进行执行，即获得对应的 children 虚拟 DOM，再进行 children 节点处理
  // props 属性可以拿到给函数组件传入的值，相当于父组件给子组件传递 value
  const children = [fiber.type(fiber.props)];
  initChildren(children, fiber);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  initChildren(children, fiber);
}

function performWorkOfUnit(fiber) {
  // 函数组件本身也是一个虚拟 DOM，为其创建 fiber 对象，只不过该对象的 type 为该函数内容
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) return fiber.child;

  // 考虑平行函数组件的情况：函数组件的 fiber 建立了 sibling 联系，但是其对应的子节点 fiber 没有，因此需要不断向上查找对应的 sibling
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.return;
  }
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};

export default React;
