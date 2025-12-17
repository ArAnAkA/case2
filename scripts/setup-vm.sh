#!/bin/bash

# Yandex Cloud VM Initial Setup Script
# Run this script on your Yandex Cloud VM to install Docker and Docker Compose

set -e

echo "=== Updating system packages ==="
sudo apt-get update
sudo apt-get upgrade -y

echo "=== Installing Docker ==="
# Install prerequisites
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add current user to docker group
sudo usermod -aG docker $USER

echo "=== Installing Docker Compose ==="
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "=== Creating project directory ==="
mkdir -p ~/cs2-casebattle
cd ~/cs2-casebattle

echo "=== Creating .env file template ==="
cat > .env << 'EOF'
# Database Configuration
DB_USER=postgres
DB_PASSWORD=CHANGE_THIS_TO_SECURE_PASSWORD
DB_NAME=cs2cases
DB_PORT=5432

# JWT Secret (generate a strong random string)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING

# Node Environment
NODE_ENV=production

# Docker Images (will be set by GitHub Actions)
BACKEND_IMAGE=ghcr.io/YOUR_GITHUB_USERNAME/cs2-casebattle/backend:latest
FRONTEND_IMAGE=ghcr.io/YOUR_GITHUB_USERNAME/cs2-casebattle/frontend:latest
EOF

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "1. Log out and log back in (or run 'newgrp docker') to use Docker without sudo"
echo "2. Edit ~/cs2-casebattle/.env with your actual values:"
echo "   - Change DB_PASSWORD to a secure password"
echo "   - Change JWT_SECRET to a random string"
echo "   - Replace YOUR_GITHUB_USERNAME with your GitHub username"
echo ""
echo "3. Copy docker-compose.prod.yml and init.sql to ~/cs2-casebattle/"
echo ""
echo "4. Add GitHub Secrets in your repository settings:"
echo "   - YC_HOST: Your VM's public IP address"
echo "   - YC_USER: Your SSH username (usually 'ubuntu' or your custom user)"
echo "   - YC_SSH_KEY: Your private SSH key content"
echo ""
echo "5. Push to main/master branch to trigger deployment"
