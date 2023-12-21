let React = {
  createElement: (type, props = {}, ...children) => {
    function getFunctionBody(func) {
      let str = func.toString();
      let body = str.slice(str.indexOf("{") + 1, str.lastIndexOf("}"));
      return body.trim();
    }
    if (props === null) props = {};
    let returnval = `<${type} ${Object.keys(props)
      .map((a) => {
        if (typeof props[a] === "function") {
          let func = getFunctionBody(props[a].toString());
          let str = func.toString();
          str = str.replaceAll('"', "&quot;");
          return `${a}="${str}"`;
        }
        return `${a}="${props[a]}"`;
      })
      .join(" ")}>${[]
      .concat(...children)
      .map((a) => {
        return typeof a === "object" ? a[0] : a;
      })
      .join("")}</${type}>`;

    return returnval;
  },
};

module.exports = React;
