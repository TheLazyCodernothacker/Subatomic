# Subatomic 

Subatomic is the world's minimalistic JS framework

 - **No unnecessary features**: Subatomic does not contain nor never will contain bloatware or any non-necessary features. 
 -  **Small and Features-Rich**: Subatomic is very small and versatile while having important features like Server Side Rendering
 - **Component-Based**:  Subatomic allows you to write once and use that component anywhere without copy & pasting or creating messy code.

## Getting Started

You can create a new subatomic app by running:

    npx create-subatomic-app@latest
    # or
    yarn create subatomic-app
    # or
    pnpm create subatomic-app
    # or
    bunx create-subatomic-app

After run subatomic by running:

    npm run start
    # or
    bun run start
Please consider using bun as it will make subatomic run even faster than npm

## Documentation

### About index.js

index.js is where all of your code starts. index.js handles the backend of subatomic.js and uses express out of the box. It also comes with dotenv configured and is ready for more packages to be installed. You can write all of the routes you want like normal, but you wil need your "/" route.

```
app.get("/", (req, res) => {
  //import the corresponding code
  import("./pages/page.mjs").then((a) => {
    //handle possible middleware and server code
    a.default.middleware.forEach((a) => {
      if (!a(req, res)) {
        res.send("Unauthorized");
      }
    });
    //send the final build
    res.send(
      build(
        a.default.render,
        a.default.state,
        a.default.init,
        a.default.components,
        req,
        res,
        a.default.title,
        a.default.description
      )
    );
  });
});
```
There is a lot going on here, so let's break it down.
The route will fetch the code for /pages/page.mjs, which is always used for the "/" route. If you want a custom route like "/home", create a folder in pages called home and create a page.mjs in there (mjs for module exports.) Afterwards we handle the exports from the file and check for all of the middleware found in the file. This code shows an example of how an auth might work, but middleware is still under more development to create a better dev experience and more sophisticated features. Once the middleware is finished and the server hasn't returned with an exit, the build happens using the code from the imported file.

### The Build

Subatomic.js uses pre-rendering and sends over the initial ui. This is why the build is returned from the render function. The code executed in the build is different from the rendering on the client, but still returns an initial ui for bots and crawlers. The first difference is this: 

```
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
    variables.Test(req);
  }
```
