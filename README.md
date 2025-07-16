
# Identity Reconciliation

## Hosted endpoint (DB will get deleted after 12 aug 2025)
```
https://identity-1-1ahk.onrender.com/identify

```

##  Dev setup

### clone the repository
```
git clone https://github.com/nabadeep25/identity.git

```

### go to the project folder
```
cd identity/

```
### create .env file from .env.example
```
cp .env.example .env

```
 
### for running server and the database container using docker and docker-compose
```
docker-compose up -d
```

## information
### PORT=8000
### API Endpoint :
```
POST localhost:8000/identify
```

