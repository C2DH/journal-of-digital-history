BUILD_TAG ?= latest

run:
	docker-compose down --remove-orphans && \
	GIT_COMMIT_SHA=$(shell git rev-parse HEAD) \
	GIT_REMOTE_URL=$(shell git config --get remote.origin.url) \
	GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	BUILD_DATE=$(shell date -u +"%Y-%m-%dT%H:%M:%SZ") \
	docker-compose up --build .

run-dev: 
	VITE_APP_GIT_COMMIT_SHA=$(shell git rev-parse HEAD) \
	VITE_APP_GIT_REMOTE_URL=$(shell git config --get remote.origin.url) \
	VITE_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	VITE_APP_GIT_TAG=${BUILD_TAG} 
	VITE_APP_BUILD_DATE=$(shell date -u +"%Y-%m-%dT%H:%M:%SZ") \
	yarn start

run-build:
	VITE_APP_GIT_COMMIT_SHA=$(shell git rev-parse HEAD) \
	VITE_APP_GIT_REMOTE_URL=$(shell git config --get remote.origin.url) \
	VITE_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	VITE_APP_GIT_TAG=${BUILD_TAG} \
	VITE_APP_BUILD_DATE=$(shell date -u +"%Y-%m-%dT%H:%M:%SZ") \
	yarn build

run-build-netlify:
	VITE_APP_GIT_COMMIT_SHA=$(shell git rev-parse HEAD) \
	VITE_APP_GIT_REMOTE_URL=$(shell git config --get remote.origin.url) \
	VITE_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	VITE_APP_GIT_TAG=${BUILD_TAG} \
	VITE_APP_BUILD_DATE=$(shell date -u +"%Y-%m-%dT%H:%M:%SZ") \
	yarn build && \
	cp _redirects build/ && \
	netlify deploy --alias=${BUILD_TAG} --dir=build

run-deploy-netlify:
	cp _redirects build/ && \
	netlify deploy --alias=${BUILD_TAG} --dir=build

build-docker-image:
	docker build -t c2dhunilu/journal-of-digital-history:${BUILD_TAG} \
	--build-arg GIT_COMMIT_SHA=$(shell git rev-parse HEAD) \
	--build-arg GIT_REMOTE_URL=$(shell git config --get remote.origin.url) \
	--build-arg GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	--build-arg BUILD_DATE=$(shell date -u +"%Y-%m-%dT%H:%M:%SZ") .