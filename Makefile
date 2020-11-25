.PHONY: lint local test

lint:
	@npm run lint

# used for local development
local: node_modules
	@npm run watch

test:
	@npm run test

# non-phony targets
node_modules: package-lock.json package.json
	@npm install
