import { parse } from "dotenv";
import React from "../../createElement.js";

let variables = {};

function handleChange(event) {
  event.preventDefault();
  console.log("change");
  variables.input = event.target.value;
}

function render(build, data) {
  if (build) {
    state();
  }

  let ui = (
    <div>
      <h1 class="text-4xl bg-red-400">Test</h1>
      <button
        onclick={() => {
          variables.cookies++;
          render();
        }}
      >
        press me
      </button>

      <h1>You have {variables.cookies} cookies</h1>
      <input
        type="text"
        value={variables.input}
        oninput={() => {
          handleChange(event);
        }}
      />
      <button
        onclick={() => {
          variables.todos.push(variables.input);

          render();
        }}
      >
        Add todo
      </button>
      {variables.todos.map((a) => {
        return <h1>{a}</h1>;
      })}
    </div>
  );
  if (typeof document !== "undefined") {
    useEffect(() => {
      console.log("use effect to run side effects");
    }, ["cookies"]);
    document.body.innerHTML = parseArray(ui);
    Object.keys(variables).forEach((a) => {
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
  variables.todos = [1, 2, 3, 4, 5];
  variables.input = "";
  variables.tset = "test";
}

async function init() {
  try {
  } catch (e) {}
}

const page = {
  render: render,
  state: state,
  init: init,
  components: [Cookies],
  middleware: [],
  functions: [useEffect, handleChange],
  title: "App created with Subatomic.js",
  description:
    "Subatomic.js is a minimalistic JS framework with PSR and SSR for creating dyanmic web apps.",
  css: [],
  js: [],
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
