# Combined Vault Policy for All Platform Services
# Grants scoped read access to each service's respective secret path

# Service A
path "secret/data/service-a/*" { capabilities = ["read"] }

# Service B
path "secret/data/service-b/*" { capabilities = ["read"] }

# Service C
path "secret/data/service-c/*" { capabilities = ["read"] }

# Service D
path "secret/data/service-d/*" { capabilities = ["read"] }

# Service E
path "secret/data/service-e/*" { capabilities = ["read"] }

# Shared permissions for all tokens
path "auth/token/renew-self" { capabilities = ["update"] }
path "auth/token/lookup-self" { capabilities = ["read"] }
