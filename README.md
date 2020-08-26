# journal of digital history
Frontend app (React) for the JDH journal: journal issues, write and read scholar publication on digital history

## installation

    yarn install
    make run-dev

Makefile contains a couple of useful commands that inject local environmental variable:

    run-dev:
	     REACT_APP_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	     REACT_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	     REACT_APP_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	     yarn start
       
## Production environment
We use docker [c2dhunilu/journal-of-digital-history](https://hub.docker.com/repository/docker/c2dhunilu/journal-of-digital-history)
The repo contains the built files and it is shipped automatically to docker hub with the github actions

## Theme
The frontend app uses bootstrap with [Reactbootstrap](https://react-bootstrap.github.io/getting-started/introduction). The main stylesheet is at `./src/styles/index.scss` and import all variables defined in the `./src/styles/_variables.scss` as [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).
Then every component has its own module.scss (read the [documentation on react scss module](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)) that has access to the css variables e.g. `var(--gray-100)`;
Fonts are loaded with WebFontLoader in ./src/index.js: Fira sans and Fira Mono

