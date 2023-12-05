const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");

app.use(express.static("public"));

function handleImport(req, res, a, parameters) {
  try {
    a.default.middleware.forEach((a) => {
      if (!a(req, res)) {
        res.send("Unauthorized");
      }
    });
    let data = {};
    data.parameters = parameters;
    res.send(
      build(
        a.default.render,
        a.default.state,
        a.default.init,
        a.default.components,
        a.default.functions,
        a.default.title,
        a.default.description,
        data
      )
    );
  } catch (e) {
    console.log(e);
    res.send("Something went wrong :(");
  }
}

function test() {
  const directoryPath = "pages";
  let pages = [];
  function readDirectory(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      if (fs.statSync(filePath).isDirectory()) {
        readDirectory(filePath);
      } else if (filePath.includes("page.mjs")) {
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
      app.get(`/${getRoutes.join("/")}`, (req, res) => {
        let parameters = {};
        let route = req.path.split("/");
        route.shift();
        route.forEach((a, i) => {
          if (a[0] === ":") {
            parameters[a.replace(":", "")] = route[i];
          }
        });

        import(`./pages/${routes.join("/")}/page.mjs`).then((a) => {
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
  import("./pages/page.mjs").then((a) => {
    handleImport(req, res, a);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function parseArray(arr) {
  return arr.join("");
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
  let [ui, variables] = render(true, data);
  let content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="css/pico.min.css">
  <title>${title}</title>
  <meta name="description" content="${description}">

</head>
<body>
  ${parseArray(ui)}
  <script>
  function parseArray(arr) {
  return arr.join("");
}
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
