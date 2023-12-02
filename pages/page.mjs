let start = false;
let variables = {};

function render(build) {
  if (build) {
    state();
    console.log(variables);
  }
  if (!start) {
    init();
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
  variables.start = false;
}

function init() {
  console.log("success");
}

const page = {
  render: render,
  state: state,
  init: init,
  components: [Cookies],
};

export default page;
