# c8yhub
Pronounced "cityhub". A platform for HOA administration.

## Project Setup

### 1. **Install dependencies**
```sh
npm install
```

### 2. **Setup database**
```sh
npx prisma migrate dev
```

### 3. **Run application**
For quick auto-deploy using nodemon, simply run the following:
```sh
npm run dev
```

This will automatically run unit tests, compile typescript source files, build the `dist` folder, and run the application every time there are saved changes to the source files

Or, if you prefer to deploy manually:

```sh
# Run tests
npm test

# Rebuild dist folder
rm -rf dist
npx tsc # compiles typescript source files into dist folder
cp -R public dist
cp -R views dist
cp app.js dist/app.js

# Run application
node dist/app.js
```

The app will be available at http://localhost:9000

## Deployment
1. Run `deploy.sh`
