// Import necessary modules
import React from "@/createElement.js";
import passport from "passport";

// Initialize an empty variables object
let variables = {};

function authenticate(req, res, variables) {
  passport.authenticate("github");
  if (!req.user) {
    res.redirect("/login");
    return "done";
  }
}

// Define the render function
function render(build, data) {
  // If the build argument is true, call the state function to initialize the variables
  if (build) {
    variables = { ...variables, ...data.props };
    variables.jsLoaded = false;
    state();
  }

  // Define the UI using JSX-like syntax
  let ui = (
    <div>
      <h1>Hello World</h1>
    </div>
  );
  // If the document object is defined (i.e., if this code is running in a browser environment)
  if (typeof document !== "undefined") {
    // Call the useEffect function with a function to log a message to the console and a dependencies array
    // Set the innerHTML of the body element to the UI string
    document.body.innerHTML = parseArray(ui);
    // Update the effectVariables object with the current values of the variables
    Object.keys(variables).forEach((a) => {
      effectVariables[a] = variables[a];
    });
  }
  // If the build argument is true, return the UI string and the variables object
  if (build) {
    return [ui, variables];
  }
}

// Define a state function to initialize the variables
function state() {}

// Define an init function
async function init() {
  try {
  } catch (e) {}
}

// Define the page object with the render function, state function, init function, and other properties
const page = {
  render: render,
  state: state,
  init: init,
  components: [],
  middleware: [authenticate],
  functions: [useEffect],
  title: "App created with Subatomic.js",
  description:
    "Subatomic.js is a minimalistic JS framework with PSR and SSR for creating dyanmic web apps.",
  css: [],
  js: [],
};

// Define a useEffect function
function useEffect(func, deps) {
  // If the document object is defined (i.e., if this code is running in a browser environment)
  if (typeof document !== "undefined") {
    let run = false;
    // Check if any of the dependencies have changed
    deps.forEach((a) => {
      if (effectVariables[a] !== variables[a]) {
        run = true;
      }
    });
    // If any of the dependencies have changed, call the function
    if (run) {
      func();
    }
  }
}

// Export the page object
export default page;
