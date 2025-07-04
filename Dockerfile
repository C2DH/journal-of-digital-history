FROM node:23-alpine as builder

ARG GIT_COMMIT_SHA
ARG GIT_REMOTE_URL
ARG GIT_BRANCH
ARG GIT_TAG
ARG BUILD_DATE

WORKDIR /jdh

RUN corepack enable && corepack prepare yarn@4.9.1 --activate

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .

COPY eslint.config.js .
COPY vite.config.js .

RUN yarn install

COPY public ./public
COPY .storybook ./.storybook
COPY src ./src
COPY .env .
COPY src/schemas ./public/schemas
COPY src/data/mock-api ./public/mock-api
COPY index.html .
COPY dashboard.html .

ENV NODE_ENV=production
ENV NODE_OPTIONS --max_old_space_size=4096

ENV VITE_GIT_COMMIT_SHA=${GIT_COMMIT_SHA}
ENV VITE_GIT_REMOTE_URL=${GIT_REMOTE_URL}
ENV VITE_GIT_BRANCH=${GIT_BRANCH}
ENV VITE_GIT_TAG=${GIT_TAG}
ENV VITE_BUILD_DATE=${BUILD_DATE}

RUN yarn build 
RUN yarn build-storybook 

FROM busybox

WORKDIR /jdh
COPY --from=builder /jdh/build ./
COPY --from=builder /jdh/storybook-static ./storybook