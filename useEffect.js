function useEffect(func, deps) {
  // If the document object is defined (i.e., if this code is running in a browser environment)
  if (typeof document !== "undefined") {
    let run = false;
    // Check if any of the dependencies have changed
    if (deps.length === 0) {
      if (variables.emptyEffectRan === undefined) {
        variables.emptyEffectRan = false;
      }
      if (!variables.emptyEffectRan) {
        run = true;
        variables.emptyEffectRan = true;
      }
    } else {
      deps.forEach((a) => {
        if (
          effectVariables[a] !== variables[a] &&
          effectVariables[a] !== undefined
        ) {
          run = true;
        }
      });
    }
    // If any of the dependencies have changed, call the function
    if (run) {
      func();
    }
  }
}

module.exports = useEffect;
