// Import necessary modules
require("module-alias/register");
const { exec } = require("child_process");
const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const React = require("./createElement.js");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Function to handle the import of a page
function handleImport(req, res, a, parameters) {
  try {
    // Initialize data object and get default data from imported module
    let data = {};
    let defaultData = a.default;
    let continueBuild = true;

    // Run all middleware functions
    defaultData.middleware.forEach((a) => {
      try {
        // If middleware function returns 'done', stop the build
        if (a(req, res) === "done") {
          continueBuild = false;
        }
      } catch (e) {
        console.log(e);
        continueBuild = false;
      }
    });

    // If build was stopped, return without sending a response
    if (!continueBuild) {
      return;
    }

    // Add parameters and other data to the data object
    data.parameters = parameters;
    data.js = defaultData.js;
    data.css = defaultData.css;

    // Send the built page to the client
    res.send(
      build(
        defaultData.render,
        defaultData.state,
        defaultData.init,
        defaultData.components,
        defaultData.functions,
        defaultData.title,
        defaultData.description,
        data
      )
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
    console.log(page);
    let routes = page.split("/");
    routes.pop();
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

      app.get(`/${getRoutes.join("/")}`, (req, res) => {
        let parameters = {};
        console.log(getRoutes);
        getRoutes.forEach((a, i) => {
          if (a[0] === ":") {
            parameters[a.replace(":", "")] = req.params[a.replace(":", "")];
          }
        });
        console.log(parameters);
        import(`./lib/${routes.join("/")}/page.mjs`).then((a) => {
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

  // Build the HTML content
  let content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/output.css">
  ${data.css
    .map((a) => {
      return `<link rel="stylesheet" href="${a}">`;
    })
    .join("")}
   ${data.js
     .map((a) => {
       return `<script defer src="${a}"></script>`;
     })
     .join("")}
  <title>${title}</title>
  <meta name="description" content="${description}">

</head>
<body>
  ${parseArray(ui, true)}
  <script>
  React = {};
  React.createElement = ${React.createElement.toString()};
  ${parseArray.toString()}
      ${state.toString()}
    ${render.toString()}
    ${init.toString()}
    ${components
      .map((a) => {
        return `${a.toString()}`;
      })
      // Join all function definitions into a single string separated by semicolons
      .join(";")}
  // Map over the functions array, convert each function to a string, and join them into a single string separated by semicolons
  ${functions
    .map((a) => {
      return `${a.toString()}`;
    })
    .join(";")}
  // Initialize the variables object with the current values of the variables
  let variables = {${Object.keys(variables).map((a) => {
    // If the variable is a function, convert it to a string
    // If the variable is not a function, convert it to a JSON string
    return `${a}: ${
      typeof variables[a] === "function"
        ? variables[a].toString()
        : JSON.stringify(variables[a])
    }`;
  })}};
  // Initialize an empty effectVariables object
  let effectVariables = {};
  // Call the render function
  render();
  // Call the init function
  init();
</script>
</body>
</html>`;
  // Return the HTML content
  return content;
}

// Set up a catch-all route for 404 errors
app.get("*", (req, res) => {
  res.status(404).send("404 Page not found!");
});
