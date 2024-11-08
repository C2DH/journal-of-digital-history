# journal of digital history

Frontend app (React) for the JDH journal: journal issues, write and read scholar publication on digital history

## run via docker in development mode

```
   docker-compose up
```

and laucnh via the browser http://localhost:3000/

## installation

    yarn install
    make run-dev

Makefile contains a couple of useful commands that inject local environmental variable:

    run-dev:
         REACT_APP_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
         REACT_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
         REACT_APP_GIT_COMMIT_SHA=$(shell git rev-parse --short HEAD) \
         yarn start

In development environment, to add a PROXY api different than `http://localhost` add the REACT_APP_PROXY as env variable (it can be stored in a local `.env.development` file)

## Branch test on netlify

This mimic a production ready _frontend_ app. The data comes from the production website as the api is proxied by netlify.
It requries a netlify identifier stored locally in the `.netlify` git-ignored folder and a `_redirects` file that is used by netlify to redirect the api calls to the production website. Check the netlify documentation for more details.

```bash
BUILD_TAG=your-branch-name make run-build-netlify
```

## Production environment

We use docker [c2dhunilu/journal-of-digital-history](https://hub.docker.com/repository/docker/c2dhunilu/journal-of-digital-history)
The repo contains the built files and it is shipped automatically to docker hub with the github actions.
See the docker-stack repo on how we do use the frontend app in production:
[docker-compose.yml#L83](https://github.com/C2DH/journal-digital-history-docker-stack/blob/master/docker-compose.yml#L83)

To build a preview docker image, you can use make `build-docker-image` with a custom `BUILD_TAG`

```
BUILD_TAG=latest-preview make build-docker-image
```

## Theme

The frontend app uses bootstrap with [Reactbootstrap](https://react-bootstrap.github.io/getting-started/introduction). The main stylesheet is at `./src/styles/index.scss` and import all variables defined in the `./src/styles/_variables.scss` as [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).
Then every component has its own module.scss (read the [documentation on react scss module](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)) that has access to the css variables e.g. `var(--gray-100)`;
Fonts are loaded with WebFontLoader in ./src/index.js: Fira sans and Fira Mono

## Release procedure

1. Pull `develop` branch, increment version in `package.json` using [semver format](https://semver.org/)
2. Perform `yarn install`, commit and push to `develop` branch.
3. Create a pull request `develop -> master`. Name it with the new version in the semver format prefixed by `v`, e.g; `v2.1.0`.
4. Merge it **without squashing**
5. Check out and pull master, tag it with new version, e.g. git tag `v2.1.0`
6. Push tags to GitHub: `git push origin --tags`
7. Github Actions will build and push new images to docker hub. It may take up to 10 minutes.
