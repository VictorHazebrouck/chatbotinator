# Dockerfile
FROM oven/bun:1.3

WORKDIR /usr/src/app

# Copy everything
COPY . .

# Make sure .next is owned by root (or current user) and writable:
RUN mkdir -p /usr/src/app/apps/client-web/.next \
    && chmod -R 777 /usr/src/app/apps/client-web/.next

# Install deps & migrate as root
RUN bun install
RUN bun migrate

# Expose ports
EXPOSE 3000 3001

# Start as root
CMD ["bun", "dev"]
