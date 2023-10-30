# Backend project using Nest.js

- [1. Prerequisites](#1-prerequisites)
- [2. Installation ](#2-installation)
- [3. Running the Application](#3-running-the-application)
- [4. Environment Configuration](#4-environment-configuration)
- [5. Prerequisites to run the Application in Docker](#5-prerequisites-to-run-the-application-in-docker)
- [6. Build the Docker image using the provided Dockerfile](#6-build-the-docker-image-using-the-provided-dockerfile)
- [7. Run the Application](#7-run-the-application)
- [8. Accessing the Application](#8-accessing-the-application)
- [9. Stopping and Cleaning Up](#9-stopping-and-cleaning-up)
- [10. Generating Migration](#10-generating-migration)
- [11. Run Migration](#11-run-migration)
- [12. Revert Migration](#12-revert-migration)

## 1. Prerequisites:

Before running the application, make sure you have the following dependencies installed:

- Node.js: Download and Install Node.js
- npm (Node Package Manager): It comes with Node.js, so no need to install separately.

## 2. Installation:

Clone the repository and install project dependencies.

```
git clone https://github.com/katelovestocode/backend-internship.git
cd your-project-directory
npm install
```

## 3. Running the Application:

Start your Nest.js application on port **3001** using the following command:

```
npm run start:dev
```

## 4. Environment Configuration:

To configure your Nest.js application, you will need an environment (`.env`) file. This file is used to store sensitive data and configuration settings. Here's how you can set up your `.env` file:

1. Create an `.env` file in the root of your project directory.

2. Define your environment variables in the `.env` file. You need to specify values for variables like PORT, database connection URLs, API keys, and other configuration settings. For example:

   ```env
   PORT=3001
   ```

## 5.Prerequisites to run the Application in Docker

Before you can run the application in Docker, make sure you have the following dependencies installed on your machine:

- Docker: Download and install Docker from [https://www.docker.com/get-started](https://www.docker.com/get-started).

## 6. Build the Docker image using the provided Dockerfile:

### FOR Tests:

```
docker build -t docker-image-test --progress=plain --no-cache --target test .
```

### FOR Production:

```
docker build -t docker-image-prod --progress=plain --no-cache --target prod .
```

## 7. Run the Application

Now that you have built the Docker image, you can run the application within a Docker container. Use the following command:

### FOR Tests:

```
docker run -d -p 3001:3001 --name docker-container-test docker-image-test
```

### FOR Production:

```
docker run -d -p 3001:3001 --name docker-container-prod docker-image-prod
```

## 8. Accessing the Application

Once the container is up and running, you can access the application in your web browser by navigating to:

```
http://localhost:3001
```

## 9. Stopping and Cleaning Up

To stop the Docker container, use the following command:

```
docker stop docker-container-prod
docker stop docker-container-test
```

To remove the Docker container and image when you're done, run:

```
docker rm docker-container-prod
docker rmi docker-container-prod

docker rm docker-container-test
docker rmi docker-container-test
```

## 10. Generating Migration

To create a new database migration, use the following command:

```
npm run migration:generate -- db/migrations/<migration-name>
```

Replace <migration-name> with a descriptive name for your migration. This will generate the necessary files for applying changes to the database schema.

## 11. Run Migration

Once you've generated a migration, you can apply the changes to your database by running the migration:

```
npm run migration:run
```

## 12. Revert Migration

If you need to revert a migration (roll back changes to the previous state), you can use the following command:

```
npm run migration:revert
```

This will undo the most recent migration and revert your database schema to the previous state.
