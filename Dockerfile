FROM node:14

# Create app directory
RUN mkdir -p /usr/src/dc
WORKDIR /usr/src/dc

# Install app dependencies
COPY package.json package-lock.json /usr/src/dc/
RUN npm install

# Copy app source
COPY . /usr/src/dc

# Build app
RUN npm run build

EXPOSE 3000
EXPOSE 3001

CMD ["npm", "start"]
