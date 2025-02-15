FROM node:23-alpine as builder

ARG GIT_COMMIT_SHA
ARG GIT_REMOTE_URL
ARG GIT_BRANCH
ARG GIT_TAG
ARG BUILD_DATE

WORKDIR /jdh

COPY package.json .
COPY yarn.lock .
COPY .eslintrc.json .

RUN yarn install

COPY public ./public
COPY .storybook ./.storybook
COPY src ./src
COPY .env .
COPY src/schemas ./public/schemas
COPY src/data/mock-api ./public/mock-api

ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096

ENV REACT_APP_GIT_COMMIT_SHA=${GIT_COMMIT_SHA}
ENV REACT_APP_GIT_REMOTE_URL=${GIT_REMOTE_URL}
ENV REACT_APP_GIT_BRANCH=${GIT_BRANCH}
ENV REACT_APP_GIT_TAG=${GIT_TAG}
ENV REACT_APP_BUILD_DATE=${BUILD_DATE}

RUN yarn build
RUN yarn build-storybook 

FROM busybox
WORKDIR /jdh
COPY --from=builder /jdh/build ./
COPY --from=builder /jdh/storybook-static ./storybook
