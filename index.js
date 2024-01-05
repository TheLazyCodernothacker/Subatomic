// Import necessary modules
const { exec } = require("child_process");
const express = require("express");
const app = express();
const port = 3001;
const fs = require("fs");
const path = require("path");
const React = require("./createElement.js");
const minify = require("html-minifier").minify;
const compression = require("compression");

// Serve static files from the 'public' directory
app.use(compression());

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
      } else if (
        filePath.includes("page.js") ||
        filePath.includes("page.tsx") ||
        filePath.includes("page.ts") ||
        filePath.includes("page.jsx")
      ) {
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
  ${ui}
  <script>
  React = {createElement: ${React.createElement.toString()}}
      ${state.toString()}
    ${render.toString()}
    ${init.toString()}
    ${components
      .map((a) => {
        return `${a.toString()}`;
      })
      .join(";")}
      ${functions
        .map((a) => {
          return `${a.toString()}`;
        })
        .join(";")}
let variables = {${Object.keys(variables).map((a) => {
    return `${a}: ${
      typeof variables[a] === "function"
        ? variables[a].toString()
        : JSON.stringify(variables[a])
    }`;
  })}};
let effectVariables = {};
    render();
    init();
  </script>
</body>
</html>`;
  let contentBuild = minify(content, {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyJS: { inline: true }, // Modify this line
    minifyCSS: { inline: true }, // Modify this line
    minifyURLs: true,
  });

  data.res.send(contentBuild);
  // Build the HTML content
}

// Set up a catch-all route for 404 errors
app.get("*", (req, res) => {
  res.status(404).send("404 Page not found!");
});
