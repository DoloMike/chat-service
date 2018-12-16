# Use docker official image that comes with Node 10.14.2 & Yarn 1.12.3, running on alpine
FROM node:10.14.2-alpine

# Create directory for app
WORKDIR /app

# Install node package depedencies
COPY package.json /app
RUN yarn install

# Copy src to workdir
COPY . /app

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run app when the container launches
CMD [ "node", "index.js" ]