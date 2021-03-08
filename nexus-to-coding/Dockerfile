FROM node

RUN apt update

RUN apt install default-jdk -y

COPY . .

RUN yarn

RUN curl -L "https://coding-public-generic.pkg.coding.net/registry/disk/migrate/maven/migrate-local-repo-tool.jar?version=1.0.0" -o migrate-local-repo-tool.jar

ENTRYPOINT ["node", "index.js"]

