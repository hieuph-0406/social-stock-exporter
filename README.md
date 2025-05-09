# API

## Prerequisites

- Node version >= `20.9.0`. [Install Node.js](https://nodejs.org/en)
- Yarn version >= `4.1.1`. [Install Yarn](https://yarnpkg.com/getting-started/install)

## Preparation steps

You need to run the following step by step.

1. Install dependencies:

    ```bash
    yarn install
    ```

2. Generate a dot environment file and fill in your environment information

   ```bash
   # for local development mode
   cp .env.example .env.development

   # for local production mode
   # cp .env.example .env.local
   ```

## Start the application

### In your local development mode

Note: you must complete the steps in the [Preparation steps](#preparation-steps) section first.

Use `./.env.development` to load environment variables

```bash
yarn start:dev
```

Open [http://localhost:4001/api](http://localhost:4001/api) with your browser to see the result.

### In your local production mode

Note: you must complete the steps in the [Preparation steps](#preparation-steps) section first.

Use `./.env.local` to load environment variables

```bash
docker-compose up -d --build
```

Open [http://localhost:4001/api](http://localhost:4001/api) with your browser to see the result.

**Notes:** For the API service to successfully connect to the database,
the environment variables for `DB_HOST` and `DB_PORT` need to be configured as follows:

```bash
...
DB_HOST=db
DB_PORT=5432
```

## Database

### Start Postgres Server on local

```bash
# start the database server and init database
$ docker compose up db -d
```

### Migration

```bash
# create file migration empty
$ migration_file_name=example yarn migration:create

# create file migration follow entities
$ NODE_ENV=development migration_file_name=example yarn migration:generate

# build
$ yarn build

# migration to database
$ NODE_ENV=development yarn migration:up

# revert migration
$ NODE_ENV=development yarn migration:down
```

## Development

```bash
$ export NODE_ENV=development

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

Generate swagger yaml for FE:

```bash
yarn build:swagger
# or run: `yarn start:dev`
```

## Testing

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

> Detail document: [docs/testing.md](docs/testing.md)

## Project structure

Updating...

## Conventional Commits

<https://www.conventionalcommits.org/en/v1.0.0/>
