FROM node:20-alpine
WORKDIR /app

# Copy package files first for dependency install
COPY package*.json ./
RUN npm ci --omit=dev

# Copy your app files
COPY . .

EXPOSE 3000

# Run your .mjs file directly
CMD ["node", "index.mjs"]