const express = require("express");
const app = express();
const port = 3000;
app.use(express.static("public"));

app.get("/", (req, res) => {
  import("./pages/page.mjs").then((a) => {
    a.default.middleware.forEach((a) => {
      if (!a(req, res)) {
        res.send("Unauthorized");
      }
    });
    res.send(
      build(
        a.default.render,
        a.default.state,
        a.default.init,
        a.default.components
      )
    );
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function parseArray(arr) {
  return arr.join("");
}

function build(render, state, init, components) {
  if (init) {
    init();
  }
  if (state) {
    state();
  }
  console.log(state.toString());
  let content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  ${parseArray(render(true))}
  <script>
  function parseArray(arr) {
  return arr.join("");
}
function useEffect(func, deps) {
  if (typeof document !== "undefined") {
    let run = false;
    deps.forEach((a) => {
      if (effectVariables[a] !== variables[a]) {
        run = true;
      }
    });
    if (run) {
      func();
    }
  }
}
      ${state.toString()}
    ${render.toString()}
    ${init.toString()}
    ${components.map((a) => {
      return `${a.toString()}`;
    })}
  let start = false;
let variables = {};
let effectVariables = {};
    state();
    render();
    init();
  </script>
</body>
</html>`;
  return content;
}

app.get("/*", (req, res) => {
  const params = req.params[0].split("/");
  console.log(params);
  import(
    `./pages/${`./pages/${params
      .map((p) => {
        return `${p}/`;
      })
      .join("")}page.mjs`}page.mjs`
  )
    .then((a) => {
      a.default.middleware.forEach((a) => {
        if (!a(req, res)) {
          res.send("Unauthorized");
        }
      });
      res.send(
        build(
          a.default.render,
          a.default.state,
          a.default.init,
          a.default.components
        )
      );
    })
    .catch((e) => {
      res.send("Page not found");
    });
});
