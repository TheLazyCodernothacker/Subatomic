require("module-alias/register");
const { exec } = require("child_process");
const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const React = require("./createElement.js");

app.use(express.static("public"));
// compile("./pages/page.js", "./pages");

function handleImport(req, res, a, parameters) {
  try {
    let data = {};
    let defaultData = a.default;
    let continueBuild = true;
    console.log(defaultData.middleware);
    defaultData.middleware.forEach((a) => {
      try {
        if (a(req, res) === "done") {
          continueBuild = false;
        }
      } catch (e) {
        console.log(e);
        continueBuild = false;
      }
    });

    if (!continueBuild) {
      return;
    }
    data.parameters = parameters;
    data.js = defaultData.js;
    data.css = defaultData.css;
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

function test() {
  const directoryPath = "app/pages";
  let pages = [];
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

  readDirectory(directoryPath);
  let setPages = new Set(pages);
  if (setPages.size !== pages.length) {
    console.log("Duplicate pages found");
    process.exit(1);
  }
  pages.forEach((page) => {
    console.log(page);
    let routes = page.split("/");
    routes.pop();
    routes.shift();
    let setRoutes = new Set(routes);
    if (setRoutes.size !== routes.length) {
      console.log("Duplicate routes found");
      process.exit(1);
    }
    if (routes.length !== 0) {
      let getRoutes = routes.map((route) => {
        if (route[0] === "[" && route[route.length - 1] === "]") {
          route = route.replace("[", ":").replace("]", "");
        }
        return route;
      });
      // compile(page, `./pages/${routes.join("/")}`);
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

test();

app.get("/robots.txt", (req, res) => {
  const robotsContent = `
    User-agent: *
    Allow: /
    `;

  res.header("Content-Type", "text/plain");
  res.status(200).send(robotsContent);
});

app.get("/", (req, res) => {
  import("./lib/pages/page.mjs").then((a) => {
    handleImport(req, res, a, {}, "/output.css");
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function parseArray(root, build) {
  return root;
}

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
  return content;
}

app.get("*", (req, res) => {
  res.status(404).send("404 Page not found!");
});
