FROM oven/bun:alpine

WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile
COPY . .
CMD ["bun", "start"]