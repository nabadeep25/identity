
FROM node:24-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm","start"]
EXPOSE 8000