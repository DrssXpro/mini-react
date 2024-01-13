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
  const el = vdom.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(vdom.type);

  for (const key in vdom.props) {
    if (key !== "children") {
      el[key] = vdom.props[key];
    } else {
      const children = vdom.props.children;
      children.forEach((c) => {
        render(c, el);
      });
    }
  }

  container.append(el);
}

const React = {
  createElement,
  render,
};

export default React;
