FROM node:24.14.0-alpine AS development

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start:dev"]

FROM node:24.14.0-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main.js"]
