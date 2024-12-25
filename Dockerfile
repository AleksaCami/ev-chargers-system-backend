# Base image
FROM node:18

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Install dependencies (production only)
RUN pnpm install --frozen-lockfile --prod

# Copy the source code
COPY . .

# Build the application
RUN pnpm run build

# Set the environment to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the application using the production build
CMD ["node", "dist/main"]
