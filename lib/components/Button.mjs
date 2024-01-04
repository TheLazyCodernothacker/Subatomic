import React from "../../createElement.js";
export default function Button({
  variables
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      variables.cookies++;
      render();
    }
  }, "Component found in different folder ", variables.cookies);
}