import React from "@/createElement.js";

export default function Button({ variables }) {
  return (
    <button
      onClick={() => {
        variables.cookies++;
        render();
      }}
    >
      Component found in different folder {variables.cookies}
    </button>
  );
}
