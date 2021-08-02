FROM node:14-alpine as builder

ARG GIT_TAG
ARG GIT_BRANCH
ARG GIT_REVISION

WORKDIR /jdh

COPY package.json .
COPY yarn.lock .
COPY .eslintrc.json .

RUN yarn install

COPY public ./public
COPY src ./src
COPY .env .
COPY src/schemas ./public/schemas
COPY src/data/mock-api ./public/mock-api

ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096

ENV REACT_APP_GIT_TAG=${GIT_TAG}
ENV REACT_APP_GIT_BRANCH=${GIT_BRANCH}
ENV REACT_APP_GIT_REVISION=${GIT_REVISION}

RUN yarn build

FROM busybox
WORKDIR /jdh
COPY --from=builder /jdh/build ./
