#There can only be one CMD instruction in a Dockerfile. If you list more than one CMD then only the last CMD will take effect.

FROM node:18.18.2-alpine

WORKDIR /work/

COPY ./src/package.json /work/package.json
RUN npm install && apk add --no-cache curl jq

COPY ./src/ /work/

RUN touch ./console.txt

CMD ./commands.sh