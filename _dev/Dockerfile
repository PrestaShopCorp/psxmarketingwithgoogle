# Build package
FROM node:20-alpine as package

WORKDIR /app

RUN npm install -g pnpm@8

## Build vuejs
FROM package as builder

WORKDIR /app
ADD . .
RUN pnpm install
RUN pnpm -r test:generate-output || true
RUN pnpm -r build-storybook


### Build clean docker image with only needed files
FROM nginx:stable-alpine as production

COPY --from=builder /app/apps/ui/storybook-static /usr/share/nginx/html
ADD ./.docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
