FROM oven/bun:1.3 as base

WORKDIR /usr/src/app

COPY . .
RUN bun install --production --filter "backend"
WORKDIR /usr/src/app/apps/backend

USER bun
EXPOSE 3000
CMD [ "bun", "start" ]
