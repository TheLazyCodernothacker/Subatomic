// babel-plugin-add-lines.js
module.exports = function () {
  return {
    visitor: {
      Program(path) {
        // Add code at the top of the file
        path.node.body.unshift(
          t.expressionStatement(
            t.stringLiteral(`import React from "@/createElement.js";`)
          )
        );
      },
    },
  };
};
