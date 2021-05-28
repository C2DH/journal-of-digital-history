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

In development environment, to add a PROXY api different than `http://localhost` add the REACT_APP_PROXY as env variable (it can be stored in a local `.env.development` file)

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


## Visualisation with custom iyython cell textMetadata

"jdh": {
  "module": "text_object",
  "text": {
    "color": "var(--accent)",
    "bootstrapColumLayout": {
      "md": {
        "offset":0,
        "span": 3,
        "order": 12
      }
    }
  },
  "object": {
    "type": "vega",
    "source": [
      "## 140.000 tweets",
      "> A quiet explanation"
    ],
    "component": "TrendLine",
    "spec": {
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
      "data": {
        "values": [
          { "t": "2014-01-01", "layer": "v0", "c": 20 },
          { "t": "2014-01-08", "layer": "v0", "c": 10 },
          { "t": "2014-01-15", "layer": "v0", "c": 40 },
          { "t": "2014-01-22", "layer": "v0", "c": 50 },
          { "t": "2014-01-28", "layer": "v0", "c": 70 },
          { "t": "2014-04-02", "layer": "v0", "c": 9 }
        ]
      },
      "transform": [{"filter": "datum.symbol==='GOOG'"}],
      "mark": {
        "type": "line",
        "interpolate": "monotone"
      },
      "encoding": {
        "x": {"field": "t", "type": "temporal"},
        "y": {"field": "c", "type": "quantitative"}
      }
    },
    "bootstrapColumLayout": {
      "md": {
        "offset":0,
        "span": 8,
        "order": 1
      }
    },
    "cssClassName": ["bg-white"]
  }
}



for images:
```
"object": {
  "type": "image",
  "ratio": 0.6,
  "position": "sticky",
  "offsetTop": 50,
  "background": {
    "color": "var(--primary)"
  },
  "border": "1px solid transparent",
  "source": [
    "figure caption."
  ],
  "data": {
    "copyright": "CC 2020"
  },
  "bootstrapColumLayout": {
    "md": {
      "offset":0,
      "span": 8,
      "order": 1
    }
  }
}
```
