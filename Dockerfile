FROM node:8.9.4

COPY package.json package.json
RUN npm install

# Add your source files
COPY . .

ENV NODE_ENV production
ENV PORT 3001

EXPOSE 3001

CMD ["node", "server", "--use-strict"]