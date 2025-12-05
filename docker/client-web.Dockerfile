FROM oven/bun:1.3 as base

WORKDIR /usr/src/app

COPY . .
RUN bun install --production --filter "client-web"
WORKDIR /usr/src/app/apps/client-web

USER bun
EXPOSE 3001
CMD [ "bun", "dev" ]
