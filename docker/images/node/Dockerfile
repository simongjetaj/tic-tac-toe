FROM node:16-alpine

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY ./socketio-server/package*.json ./
COPY ./socketio-server/tsconfig.json ./
# copy source code to /app/src folder
COPY ./socketio-server/src /app/src

# check files list
RUN ls -a

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "node", "./dist/server.js" ]
