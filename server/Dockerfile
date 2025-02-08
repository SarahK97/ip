FROM node:19-alpine
# Inside the server image we have defined the working directory as /app
# When the image is created this dir will also be created inside Docker
WORKDIR /app
COPY ./ ./
RUN npm i
EXPOSE 3001
CMD ["npm", "run", "start"]
