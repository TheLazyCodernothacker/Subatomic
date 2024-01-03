// Import necessary modules
const { exec } = require("child_process");
const express = require("express");
const app = express();
const port = 3001;
const fs = require("fs");
const path = require("path");
const React = require("./createElement.js");
const ejs = require("ejs");
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Function to handle the import of a page
async function handleImport(req, res, a, parameters) {
  try {
    // Initialize data object and get default data from imported module
    let data = {};
    let defaultData = a.default;
    let continueBuild = true;

    // Run all middleware functions
    var variables = {};
    async function runMiddleware() {
      for (const a of defaultData.middleware) {
        try {
          // Wait for the middleware function to complete before moving on
          const newVariables = await a(req, res, variables);
          Object.assign(variables, newVariables);

          // If middleware function returns 'done', stop the build
          if (newVariables === "done") {
            continueBuild = false;
            break;
          }
        } catch (e) {
          console.log(e);
          continueBuild = false;
          break;
        }
      }
    }
    await runMiddleware();

    // If build was stopped, return without sending a response
    if (!continueBuild) {
      return;
    }

    // Add parameters and other data to the data object
    data.props = variables;
    data.parameters = parameters;
    data.js = defaultData.js;
    data.css = defaultData.css;
    data.res = res;

    // Send the built page to the client
    build(
      defaultData.render,
      defaultData.state,
      defaultData.init,
      defaultData.components,
      defaultData.functions,
      defaultData.title,
      defaultData.description,
      data
    );
  } catch (e) {
    console.log(e);
    res.send("Something went wrong :(");
  }
}

// Function to initialize pages
function initPages() {
  const directoryPath = "app/pages";
  let pages = [];

  // Function to read a directory and its subdirectories
  function readDirectory(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      if (fs.statSync(filePath).isDirectory()) {
        readDirectory(filePath);
      } else if (filePath.includes("page.js")) {
        pages.push(filePath);
      }
    });
  }

  // Read the directory
  readDirectory(directoryPath);

  // Check for duplicate pages
  let setPages = new Set(pages);
  if (setPages.size !== pages.length) {
    console.log("Duplicate pages found");
    process.exit(1);
  }

  // For each page, set up the routes
  pages.forEach((page) => {
    let routes = page.split(path.sep);
    routes.pop();
    routes.shift();
    routes.shift();
    // Check for duplicate routes
    let setRoutes = new Set(routes);
    if (setRoutes.size !== routes.length) {
      console.log("Duplicate routes found");
      process.exit(1);
    }

    // If there are routes, set up the route for the page
    if (routes.length !== 0) {
      let getRoutes = routes.map((route) => {
        if (route[0] === "[" && route[route.length - 1] === "]") {
          route = route.replace("[", ":").replace("]", "");
        }
        return route;
      });
      console.log(getRoutes.join("/"));
      app.get(`/${getRoutes.join("/")}`, (req, res) => {
        let parameters = {};
        getRoutes.forEach((a, i) => {
          if (a[0] === ":") {
            parameters[a.replace(":", "")] = req.params[a.replace(":", "")];
          }
        });
        import(`./lib/pages/${routes.join("/")}/page.mjs`).then((a) => {
          handleImport(req, res, a, parameters);
        });
      });
    }
  });
}

// Initialize pages
initPages();

// Set up the route for the robots.txt file
app.get("/robots.txt", (req, res) => {
  const robotsContent = `
    User-agent: *
    Allow: /
    `;

  res.header("Content-Type", "text/plain");
  res.status(200).send(robotsContent);
});

// Set up the route for the home page
app.get("/", (req, res) => {
  import("./lib/pages/page.mjs").then((a) => {
    handleImport(req, res, a, {}, "/output.css");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Function to parse an array
function parseArray(root, build) {
  return root;
}

// Function to build a page
function build(
  render,
  state,
  init,
  components,
  functions,
  title,
  description,
  data
) {
  // Render the page and get the variables
  let [ui, variables] = render(true, data, React);
  let newData = {
    variables: variables,
    render: render,
    state: state,
    init: init,
    components: components,
    functions: functions,
    title: title,
    components: components,
    description: description,
    js: data.js,
    css: data.css,
    ui: ui,
    createElement: React.createElement,
    finalUI: parseArray(ui, true),
    parseArray: parseArray,
  };
  data.res.render("main", newData);
  // Build the HTML content
}

// Set up a catch-all route for 404 errors
app.get("*", (req, res) => {
  res.status(404).send("404 Page not found!");
});
