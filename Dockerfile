#base
FROM node:18-alpine As base

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

# to run tests
FROM base As test

WORKDIR /app

COPY test ./test

CMD [ "npm", "run", "test" ]

# to run in production
FROM base As prod

WORKDIR /app

RUN npm run build

CMD [ "npm", "run", "start:prod" ]
