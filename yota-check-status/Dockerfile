FROM node:12

# Setup Oracle Instant Client
WORKDIR /usr/src
RUN wget https://download.oracle.com/otn_software/linux/instantclient/19600/instantclient-basic-linux.x64-19.6.0.0.0dbru.zip
RUN apt-get update
RUN apt-get install libaio1
RUN apt-get install unzip
RUN unzip instantclient-basic-linux.x64-19.6.0.0.0dbru.zip

ENV PATH "$PATH:/usr/src/instantclient_19_6"
ENV LD_LIBRARY_PATH "/usr/src/instantclient_19_6"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]