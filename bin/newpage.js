#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const pageName = process.argv[2];

if (!pageName) {
  console.log("Please enter a page name");
  return;
}

let boilerplate = `
// Import necessary modules
import React from "@/createElement.js";

// Initialize an empty variables object
let variables = {};

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
  middleware: [],
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
`;


let pagePath = "../app/pages/" + pageName;
pagePath += pageName.includes("/page.js") ? "" : "/page.js";
if(pageName === "./"){
  pagePath = "/app/pages/page.js";
}

// Convert pagePath to an absolute path
let absolutePagePath = path.resolve(__dirname, pagePath);

// Check if page already exists
if (fs.existsSync(absolutePagePath)) {
  console.log("Page already exists");
  return;
}

// Ensure the directory exists
let dirPath = path.dirname(absolutePagePath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(absolutePagePath, boilerplate);