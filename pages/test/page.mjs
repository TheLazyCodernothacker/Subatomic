import Button from "../../components/Button.mjs";

let variables = {};

function render(build, data) {
  console.log(variables);
  if (build) {
    state();
    variables.Test = function (req) {
      if (req) {
        variables.Test = function () {
          return `<h1>You are logged in!</h1>`;
        };
      } else {
        variables.Test = function () {
          return `<h1>You are not logged in!</h1>`;
        };
      }
    };
    variables.Test(data.req);
  }
  let ui = [
    `<h1>Easy state management across components</h1>`,
    `<button onclick="variables.cookies++;render();">Component found in current page</button>`,
    Button(variables),
    Cookies(variables.cookies),
    `<h1>Create conditional server components</h1>`,
    variables.Test(),
    `<input id="asdf"/><button onclick="variables.todos.push(asdf.value);render()">State management witih arrays with simple .push() syntax</button><button onclick="variables.todos.pop();render()">State management witih arrays with simple .pop() syntax</button>`,
    ...variables.todos.map((a) => {
      return `<h1>${a}</h1>`;
    }),
  ];
  if (typeof document !== "undefined") {
    useEffect(() => {
      console.log("use effect to run side effects");
    }, ["cookies"]);
    document.body.innerHTML = `<body>${parseArray(ui)}</body>`;
    asdf.value = variables.input;
    asdf.onchange = () => {
      variables.input = asdf.value;
    };
    Object.keys(variables).forEach((a) => {
      effectVariables[a] = variables[a];
    });
  }
  if (build) {
    console.log("returning", variables);
    return [ui, variables];
  }
}

state();

function Cookies() {
  return `<h1>${variables.cookies}</h1>`;
}

function state() {
  variables.cookies = 0;
  variables.todos = [];
  variables.input = "";
}

async function init() {
  try {
    console.log("Run code after first render with init");
    const test = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const json = await test.json();
    console.log(json);
    variables.todos.push(json.title);
    render();
  } catch (e) {}
}

const page = {
  render: render,
  state: state,
  init: init,
  components: [Cookies, Button],
  middleware: [],
  functions: [useEffect],
  title: "App created with Subatomic.js",
  description:
    "Subatomic.js is a minimalistic JS framework with PSR and SSR for creating dyanmic web apps.",
};

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

//function auth(req, res) {
//if (req.cookies.auth === "true") {
//return true;
//} else {
//res.send("Unauthorized");
//return false;
//}
//return true;
//}

export default page;
