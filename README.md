# Diplo !

A pipeline tool for generating assets.

Can be used to create board games, computer games, or other data driven statically rendered projects.

![Say hi to Diplo](./assets/diplo-icon.png)

For more context, please read [this presentation](https://goo.gl/KukCHv) to learn more.

## Using Diplo

Diplo is currently in development, and isn't packaged up in a way that is easy to use yet.

The end goal is to have a command line interface, and run local to a new project.

Hopefully, by the end of development, using diplo will be as simple as:

```
npm i -g diplo
diplo
```

And this will open a web browser, and let you start working.

## Development

To actively work on and improve this project...

Clone this, repo, then from within the checkout folder run:
```
npm install
```

In a new tab, run:
```
npm start
```

This should open `http://localhost:3000/diplo/` in a web browser; this can be debugged using react tools.

Concurrently, a server will start up on http://localhost:49625/api/global in order to serve dynamic data to the react application.

You can then use a text editor or IDE to work on the project.

## Production

To build a production version of the latest code, run:
```
npm run build
```

This build can then be tested by opening `http://localhost:49625/diplo/` in a web browser.
