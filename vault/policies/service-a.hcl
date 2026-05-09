# Vault Policy: service-a
# This policy grants service-a read-only access to its own secret path only
# Principle of least privilege — no access to other services' secrets

path "secret/data/service-a/*" {
  capabilities = ["read"]
}

# Allow token renewal
path "auth/token/renew-self" {
  capabilities = ["update"]
}

# Allow token lookup (for health checks)
path "auth/token/lookup-self" {
  capabilities = ["read"]
}
