FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock* package-lock.json* ./

USER node

RUN npm ci --only=production

COPY --chown=node:node . .

# Build TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
