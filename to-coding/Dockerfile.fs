FROM coding-public-docker.pkg.coding.net/public/docker/nodejs:12

RUN apt update

COPY . .

RUN yarn

ENTRYPOINT ["node", "index.fs.js"]

