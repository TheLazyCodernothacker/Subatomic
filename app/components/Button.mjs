export default function Button(variables) {
  return `<button onclick="variables.cookies++;render()">Component from other folder</button><h1>${variables.cookies}</h1>`;
}
