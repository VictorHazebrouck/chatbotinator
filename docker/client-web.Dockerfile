FROM oven/bun:1.3 as base

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN mkdir -p /usr/src/app/apps/client-web/.next/dev/cache \
    && chmod -R 777 /usr/src/app/apps/client-web/.next

RUN bun install

WORKDIR /usr/src/app/apps/client-web

EXPOSE 3001
CMD ["bun", "dev" ]
