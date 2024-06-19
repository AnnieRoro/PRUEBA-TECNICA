install:
	@npm install

dev:
	@npx ts-node-dev src/index.ts

start:
	@npm run build && npm start
    