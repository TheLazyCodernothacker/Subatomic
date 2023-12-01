export  function render() {
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