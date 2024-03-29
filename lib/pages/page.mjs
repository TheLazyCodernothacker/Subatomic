// Import necessary modules
import React from "../../createElement.js";
import Button from "../../lib/components/Button.mjs";
import useEffect from "../../useEffect.js";
export { Button, useEffect };

// Initialize an empty variables object
let variables = {};
export const page = {
  title: "App created with Subatomic.js",
  description: "Subatomic.js is a minimalistic JS framework with PSR and SSR for creating dyanmic web apps.",
  css: [],
  js: []
};

// Define a function to handle changes in the input field
export function handleChange(event) {
  event.preventDefault();
  console.log("change");
  // Update the input variable with the new value from the input field
  variables.input = event.target.value;
}
export function Cookies() {
  return /*#__PURE__*/React.createElement("h1", null, variables.cookies);
}

// Define a state function to initialize the variables
export function state() {
  variables.cookies = 0;
  variables.todos = [1, 2, 3, 4, 5];
  variables.input = "";
  variables.tset = "test";
}

// Define an init function
export async function init() {
  try {} catch (e) {}
}
export async function asdf(req, res, variables) {
  "use middleware";

  const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const json = await data.json();
  variables.json = json;
}

// Define the render function
export function render(build, data) {
  // If the build argument is true, call the state function to initialize the variables
  if (build) {
    variables = {
      ...variables,
      ...data.props
    };
    variables.jsLoaded = false;
    state();
  }

  // Define the UI using JSX-like syntax
  let ui = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    class: "text-4xl bg-red-400"
  }, "Test"), /*#__PURE__*/React.createElement("a", {
    href: "/auth/github"
  }, "Login with GitHub"), /*#__PURE__*/React.createElement("a", {
    href: "/protected"
  }, "View protected route"), /*#__PURE__*/React.createElement("h1", null, JSON.stringify(variables.json)), /*#__PURE__*/React.createElement("button", {
    onclick: () => {
      // Increase the number of cookies and re-render the UI when the button is clicked
      variables.cookies++;
      render();
    }
  }, "press me ", variables.cookies), /*#__PURE__*/React.createElement(Button, {
    variables: variables
  }), /*#__PURE__*/React.createElement("h1", null, "You have ", variables.cookies, " cookies"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: variables.input,
    oninput: () => {
      // Call the handleChange function when the input field value changes
      handleChange(event);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onclick: () => {
      // Add the current input value to the todos array and re-render the UI when the button is clicked
      variables.todos.push(variables.input);
      render();
    }
  }, "Add todo"), variables.todos.map(a => {
    // Map over the todos array and return an h1 element for each todo
    return /*#__PURE__*/React.createElement("h1", null, a);
  }));
  // If the document object is defined (i.e., if this code is running in a browser environment)
  if (typeof document !== "undefined") {
    // Call the useEffect function with a function to log a message to the console and a dependencies array
    useEffect(() => {
      console.log("use effect to run side effects");
    }, ["cookies"]);
    // Set the innerHTML of the body element to the UI string
    document.body.innerHTML = ui;
    // Update the effectVariables object with the current values of the variables
    Object.keys(variables).forEach(a => {
      effectVariables[a] = variables[a];
    });
  }
  // If the build argument is true, return the UI string and the variables object
  if (build) {
    return [ui, variables];
  }
}

// Define the page object with the render function, state function, init function, and other properties