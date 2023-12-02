let variables = {};

function render(build) {
  if (build) {
    state();
    console.log(variables);
  }
  let ui = [
    `<button onclick="variables.cookies++;render();">Press me</button><input id="asdf"/><button onclick="variables.todos.push(asdf.value);render()">add todo</button>`,
    Cookies(variables.cookies),
    ...variables.todos.map((a) => {
      return `<h1>${a}</h1>`;
    }),
  ];
  if (typeof document !== "undefined") {
    document.body.innerHTML = `<body>${parseArray(ui)}</body>`;
    asdf.value = variables.input;
    asdf.onchange = () => {
      variables.input = asdf.value;
    };
  }
  if (build) {
    return ui;
  }
}

state();

function Cookies(cookies) {
  return `<h1>${cookies}</h1>`;
}

function state() {
  variables.cookies = 0;
  variables.todos = [];
  variables.input = "";
}

async function init() {
  try {
    alert("App created with Subatomic.js");
    const test = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const json = await test.json();
    console.log(json);
  } catch (e) {}
}

function auth(req, res) {
  // if (req.cookies.auth === "true") {
  //   return true;
  // } else {
  //   res.send("Unauthorized");
  //   return false;
  // }
  return true;
}

const page = {
  render: render,
  state: state,
  init: init,
  components: [Cookies],
  middleware: [auth],
  sideEffects: [],
};

export default page;
