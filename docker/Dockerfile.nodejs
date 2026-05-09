# --- Build Stage ---
FROM ubuntu:22.04 AS builder

# Prevent interactive prompts during build
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
# (Assumes package.json exists in service directory)
COPY package*.json ./
RUN npm install --production

# Copy application source
COPY . .

# --- Final Runtime Stage ---
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production

# Install minimal runtime dependencies: Node.js and Vault (for secret fetching)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    jq \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com jammy main" | tee /etc/apt/sources.list.d/hashicorp.list \
    && apt-get update && apt-get install -y vault \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy from builder
COPY --from=builder /app /app

# Expose the application port
EXPOSE 8080

# Command to run the application
# Note: In production, the entrypoint might be a script that handles 
# the Vault authentication flow described in README.md
CMD ["node", "index.js"]
