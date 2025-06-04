# HetDronePortProjectTeam05

## Env variables that need to be changed
### backend/dockerfile
- spring.mail.password=SuperSecretPassword
- spring.datasource.password=SuperSecretPassword
- token.secret.key=SuperSecretPassword
- endpoints.cors.allowed-origins=http://localhost:3000
### frontend/dockerfile
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SuperSecretPassword
- NEXT_PUBLIC_DRONEPORT_EMAIL=droneportgroep5@gmail.com
- NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
- NEXT_PUBLIC_RECAPTCHA_SITE_KEY=SuperSecretPassword
- RECAPTCHA_SECRET_KEY=SuperSecretPassword
### docker-compose.yml
- POSTGRES_PASSWORD: SuperSecretPassword
