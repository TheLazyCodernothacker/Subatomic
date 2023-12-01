const express = require("express");
const app = express();
const port = 3000;
app.use(express.static("public"));

app.get("/", (req, res) => {
  ui = [
    `<button onclick="cookies++;render();">Press me</button><input id="asdf"/><button onclick="todos.push(asdf.value);render()">add todo</button>`,
    Cookies({ cookies }),
    ...todos.map((a) => {
      return `<h1>${a}</h1>`;
    }),
  ];
  res.send(
    build(
      ui,
      () => {
        let cookies = 0;
        let todos = [];
        let start = false;
      },
      () => {
        console.log("success");
      }
    )
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

let cookies = 0;
let todos = [];
let start = false;

function render() {
  if (!start) {
    init();
  }
  ui = [
    `<button onclick="cookies++;render();">Press me</button><input id="asdf"/><button onclick="todos.push(asdf.value);render()">add todo</button>`,
    Cookies({ cookies }),
    ...todos.map((a) => {
      return `<h1>${a}</h1>`;
    }),
  ];
  document.body.innerHTML = "";
  document.write(`<body>${parseArray(ui)}</body>`);
}

function Cookies({ cookies }) {
  return `<h1>${cookies}</h1>`;
}

function parseArray(arr) {
  return arr.join("");
}

function build(ui, state, init) {
  if (init) {
    init();
  }
  if (state) {
    state();
  }
  let content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  ${parseArray(ui)}
</body>
</html>`;
  return content;
}
