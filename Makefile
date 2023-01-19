BUILD_TAG ?= latest

run:
	docker-compose down --remove-orphans && \
	GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	GIT_REVISION=$(shell git rev-parse --short HEAD) \
	docker-compose up --build

run-dev:
	REACT_APP_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	REACT_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	REACT_APP_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	yarn start

run-build:
	REACT_APP_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	REACT_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	REACT_APP_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	yarn build

run-build-netlify:
	REACT_APP_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	REACT_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	REACT_APP_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	yarn build && \
	cp _redirects build/ && \
	netlify deploy --alias=${BUILD_TAG} --dir=build

run-deploy-netlify:
	cp _redirects build/ && \
	netlify deploy --alias=${BUILD_TAG} --dir=build

build-docker-image:
	docker build -t c2dhunilu/journal-of-digital-history:${BUILD_TAG} \
	--build-arg GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	--build-arg GIT_REVISION=$(shell git rev-parse --short HEAD) .
