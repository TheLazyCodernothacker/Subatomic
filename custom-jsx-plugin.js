module.exports = function (babel) {
  var t = babel.types;
  return {
    name: "custom-jsx-plugin",
    visitor: {
      JSXExpressionContainer(path) {
        path.replaceWith(path.node.expression);
      },
      JSXText(path) {
        var stringChild = t.stringLiteral(path.node.value);
        path.replaceWith(stringChild, path.node);
      },
      JSXElement(path) {
        var openingElement = path.node.openingElement;
        var tagName = openingElement.name.name;
        var args = [];
        args.push(t.stringLiteral(tagName));

        var attribs = t.objectExpression(
          openingElement.attributes.map((attr) =>
            t.objectProperty(
              t.identifier(attr.name.name),
              attr.value.type === "JSXExpressionContainer"
                ? attr.value.expression
                : attr.value
            )
          )
        );
        args.push(attribs);

        var reactIdentifier = t.identifier("Subatomic");
        var createElementIdentifier = t.identifier("createElement");
        var callee = t.memberExpression(
          reactIdentifier,
          createElementIdentifier
        );
        var callExpression = t.callExpression(callee, args);
        callExpression.arguments = callExpression.arguments.concat(
          path.node.children
        );
        path.replaceWith(callExpression, path.node);
      },
    },
  };
};
