# Microservices Platform on On-Premise Kubernetes

A production-grade microservices architecture deployed on bare-metal Kubernetes with HashiCorp Vault for secrets management, CNI-based service networking, and a hybrid cloud-functions integration.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     On-Premise Infrastructure               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Kubernetes Cluster (Single)              │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │  namespace  │  │  namespace  │  │  namespace  │  │  │
│  │  │  frontend   │  │  backend    │  │   workers   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │                                                       │  │
│  │              CNI (Pod-to-Pod Networking)              │  │
│  │              Nginx Ingress Controller                 │  │
│  │              PersistentVolumes (Local Storage)        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            HashiCorp Vault (Separate Server)          │  │
│  │            AppRole Auth + Per-Service Policies        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                    Secured HTTP Endpoints
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Cloud (Hybrid)                          │
│                                                             │
│         Cloud Function A          Cloud Function B          │
│         (IAM Role Scoped)         (IAM Role Scoped)         │
└─────────────────────────────────────────────────────────────┘
```

---

## Services

| Service | Type | Deployment | Description |
|---|---|---|---|
| service-a | Container | Kubernetes | Core API service |
| service-b | Container | Kubernetes | Auth service |
| service-c | Container | Kubernetes | Data processing |
| service-d | Container | Kubernetes | Notification service |
| service-e | Container | Kubernetes | Worker/job processor |
| function-a | Serverless | Cloud Function | Event-driven task |
| function-b | Serverless | Cloud Function | Scheduled task |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Container Orchestration | Kubernetes (kubeadm, on-premise) |
| Container Runtime | Docker |
| Ingress Controller | Nginx Ingress |
| CNI Plugin | Flannel / Calico |
| Secrets Management | HashiCorp Vault (AppRole Auth) |
| Storage | Kubernetes PersistentVolumes (Local Storage) |
| Serverless | Cloud Functions (IAM scoped) |
| Hybrid Connectivity | Secured HTTP endpoints |

---

## Repository Structure

```
k8s-microservices-platform/
├── README.md
├── k8s/
│   ├── namespaces/          # Namespace definitions
│   ├── deployments/         # Service deployments per namespace
│   ├── services/            # ClusterIP / NodePort service definitions
│   ├── ingress/             # Nginx Ingress routing rules
│   ├── storage/             # PersistentVolume and PVC definitions
│   └── secrets/             # Secret templates (no real values)
├── docker/
│   └── */Dockerfile         # Dockerfile per service
├── vault/
│   ├── policies/            # Vault ACL policies per service
│   └── approle/             # AppRole setup scripts
├── diagrams/
│   └── architecture.md      # Architecture diagrams (Mermaid)
└── scripts/
    └── deploy.sh            # Deployment helper script
```

---

## Secrets Management

Secrets are managed via **HashiCorp Vault** using the **AppRole** authentication method.

### Flow

```
Pod Starts
  → Reads Role ID (from env or mounted config)
  → Reads Secret ID (injected via init container)
  → Authenticates to Vault → receives token
  → Pulls 12+ secrets from Vault KV store
  → Application starts with secrets in memory
```

### Vault Path Structure

```
secret/
├── service-a/
│   ├── db-password
│   ├── api-key
│   └── jwt-secret
├── service-b/
│   └── ...
└── shared/
    └── ...
```

Each service has a **dedicated Vault policy** — it can only read its own secret path.

> **Note:** No real secrets, tokens, Role IDs, or Secret IDs are stored in this repository. All values in config files are placeholders.

---

## Networking

### Pod-to-Pod (CNI)

Services communicate internally via CNI overlay network using Kubernetes DNS:

```
service-a → http://service-b.backend.svc.cluster.local:8080
```

### External Traffic (Nginx Ingress)

```
Internet → Nginx Ingress Controller → Service (ClusterIP) → Pod
```

### Cloud Functions → On-Premise

Cloud functions call on-premise services via secured HTTP endpoints exposed through Nginx Ingress. All requests are authenticated via shared secrets passed in request headers.

---

## Storage

Stateful services use **PersistentVolumes** backed by local node storage.

```
Pod → PVC → PV → /data/<service-name> on node
```

PVs use `nodeAffinity` to ensure pods always schedule on the correct node where their data resides.

---

## Getting Started

### Prerequisites

- Kubernetes cluster (kubeadm)
- `kubectl` configured
- HashiCorp Vault instance running and unsealed
- Docker registry accessible from cluster nodes

### Deploy Namespaces

```bash
kubectl apply -f k8s/namespaces/
```

### Deploy Storage

```bash
kubectl apply -f k8s/storage/
```

### Deploy Services

```bash
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress/
```

### Setup Vault

```bash
# Enable AppRole auth
vault auth enable approle

# Apply policies
vault policy write service-a vault/policies/service-a.hcl

# Create AppRole per service
vault write auth/approle/role/service-a \
  token_policies="service-a" \
  token_ttl=1h \
  token_max_ttl=4h
```

---

## Security Notes

- All secrets sourced from HashiCorp Vault — never hardcoded or in environment variables
- Each service uses a scoped Vault policy (least privilege)
- Cloud function endpoints protected with header-based auth
- Secret IDs use Vault Response Wrapping (one-time use)
- IAM roles on cloud functions scoped to minimum required permissions
- Nginx Ingress configured with TLS

---

## License

MIT
