import { parse } from "dotenv";
import React from "../../createElement.js";
let variables = {};
function render(build, data) {
  console.log(variables);
  if (build) {
    state();
    variables.Test = function (req) {
      if (req) {
        variables.Test = function () {
          return `<h1 class="text-3xl font-bold underline">You are logged in!</h1>`;
        };
      } else {
        variables.Test = function () {
          return `<h1>You are not logged in!</h1>`;
        };
      }
    };
    variables.Test(data.req);
  }
  let ui = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    class: "text-4xl bg-red-400"
  }, "Test"), /*#__PURE__*/React.createElement("button", {
    onclick: () => {
      variables.cookies++;
      render();
    }
  }, "press me"), /*#__PURE__*/React.createElement("h1", null, "You have ", variables.cookies, " cookies"));
  if (typeof document !== "undefined") {
    useEffect(() => {
      console.log("use effect to run side effects");
    }, ["cookies"]);
    console.log("parsing");
    document.body.innerHTML = parseArray(ui);
    Object.keys(variables).forEach(a => {
      effectVariables[a] = variables[a];
    });
  }
  if (build) {
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
  variables.tset = "test";
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
  components: [Cookies],
  middleware: [],
  functions: [useEffect],
  title: "App created with Subatomic.js",
  description: "Subatomic.js is a minimalistic JS framework with PSR and SSR for creating dyanmic web apps.",
  css: [],
  js: []
};
function useEffect(func, deps) {
  if (typeof document !== "undefined") {
    let run = false;
    deps.forEach(a => {
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