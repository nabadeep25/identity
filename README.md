
# Identity Reconciliation

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
 
### for running server (Assuming postgres database is running locally)

 
```
npm i
npm run build
npm run start

```
 ### for creating table
 ```
 npm run migrate

 ```
### for inserting sample row
 ```
  npm run seed

 ```

## information
### PORT=8000
### API Endpoint :
```
POST localhost:8000/identify
```

