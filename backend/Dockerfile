FROM node:22-alpine

# Prisma's engine needs OpenSSL on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy ONLY dependency files first (layer caching trick)
COPY package.json package-lock.json ./
RUN npm ci

# Now copy the rest of the source
COPY . .

# Generate the Prisma client (reads prisma/schema.prisma)
RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "run", "dev"]