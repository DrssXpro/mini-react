// task5: 类比 React 使用方法渲染 DOM
function createElement(type, props, ...children) {
  return {
    type,
    props: { ...props, children: children.map((c) => (typeof c === "string" ? createTextElement(c) : c)) },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: { textContent: text, children: [] },
  };
}

const box = createElement("div", { id: "app" }, "app", " hi mini-reacts");

function render(vdom, container) {
  const el = vdom.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(vdom.type);
  for (const key in vdom.props) {
    if (key !== "children") {
      el[key] = vdom.props[key];
    } else {
      const children = vdom.props[key];
      children.forEach((c) => {
        render(c, el);
      });
    }
  }

  container.append(el);
}

const ReactDOM = {
  createRoot(container) {
    return {
      render(app) {
        render(app, container);
      },
    };
  },
};

ReactDOM.createRoot(document.querySelector("#root")).render(box); // ✔
