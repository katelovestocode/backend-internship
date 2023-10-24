# Backend project using Nest.js

- [1. Prerequisites](#1-prerequisites)
- [2. Installation ](#2-installation)
- [3. Running the Application](#3-running-the-application)
- [4. Environment Configuration](#4-environment-configuration)

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
