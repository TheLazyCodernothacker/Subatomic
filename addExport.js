module.exports = function ({ types }) {
  return {
    visitor: {
      FunctionDeclaration(path) {
        if (path.node.id) {
          const idIdentifier = types.identifier(path.node.id.name);
          const exportDeclaration = types.exportNamedDeclaration(
            types.functionDeclaration(
              idIdentifier,
              path.node.params,
              path.node.body
            ),
            [],
            null
          );
          path.replaceWith(exportDeclaration);
        }
      },
    },
  };
};
