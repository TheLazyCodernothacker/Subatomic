// Define a mock React object
let React = {
  // Define a createElement function that takes a type, props, and children
  createElement: (type, props = {}, ...children) => {
    // Define a helper function to get the body of a function
    function getFunctionBody(func) {
      // Convert the function to a string
      let str = func.toString();
      // Extract the part of the string between the first { and the last }
      let body = str.slice(str.indexOf("{") + 1, str.lastIndexOf("}"));
      // Return the body, trimmed of leading and trailing white space
      return body.trim();
    }

    // If props is null, set it to an empty object
    if (props === null) props = {};
    try {
      if (typeof type === "function") {
        return type(props);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    // Generate the HTML string for the element
    let returnval = `<${type} ${Object.keys(props)
      .map((a) => {
        // If the prop is a function, get its body and include it in the HTML string
        if (typeof props[a] === "function") {
          let func = getFunctionBody(props[a].toString());
          let str = func.toString();
          // Replace all double quotes with &quot; to prevent issues with the HTML string
          str = str.replaceAll('"', "&quot;");
          return `${a}="${str}"`;
        }
        // If the prop is not a function, include it in the HTML string as is
        return `${a}="${props[a]}"`;
      })
      .join(" ")}>${[]
      .concat(...children)
      .map((a) => {
        // If the child is an object, include its first item in the HTML string
        return typeof a === "object" ? a[0] : a;
      })
      .join("")}</${type}>`;

    // Return the generated HTML string
    return returnval;
  },
};

// Export the mock React object
module.exports = React;
