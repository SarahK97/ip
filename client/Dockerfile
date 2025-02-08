FROM node:alpine
# Inside the client image we have defined the working directory as /app
# When the image is created this dir will also be created inside Docker
WORKDIR /app
# copy the files from the computer to /app
COPY ./ ./
RUN npm i
EXPOSE 3000
CMD ["npm", "run", "start"]