#!/bin/bash

# Simple deployment script for the k8s-microservices-platform

echo "🚀 Starting Deployment..."

# 1. Apply Namespaces
echo "📁 Applying Namespaces..."
kubectl apply -f k8s/namespaces/

# 2. Apply Storage
echo "💾 Applying Storage..."
kubectl apply -f k8s/storage/

# 3. Apply Deployments
echo "🚢 Applying Deployments..."
kubectl apply -f k8s/deployments/

# 4. Apply Services (if any)
if [ -d "k8s/services" ]; then
    echo "🌐 Applying Services..."
    kubectl apply -f k8s/services/
fi

# 5. Apply Ingress (if any)
if [ -d "k8s/ingress" ]; then
    echo "🛣️  Applying Ingress..."
    kubectl apply -f k8s/ingress/
fi

echo "✅ Deployment manifests applied successfully."
