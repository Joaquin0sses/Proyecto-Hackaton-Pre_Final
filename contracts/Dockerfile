FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

# Default command to compile contracts, can be overridden to deploy
CMD ["npx", "hardhat", "compile"]
