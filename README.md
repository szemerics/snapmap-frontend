# SnapMap - Frontend

This is the React-based frontend application for the SnapMap project. It provides an interactive, map-centric interface for users to share and discover geotagged photography.

> [!IMPORTANT]
> This repository is a Git Submodule. It is part of the larger SnapMap project.
> To run the complete application (Backend + Frontend + Database) with a single command, please refer to the [SnapMap](https://github.com/szemerics/snapmap) Parent Repository.

## Installation

Run this command to copy .env and set the API url (if ran locally, it can remain as it is)

```bash
cp .env.example .env
```

### With Docker

Build and start containers

```bash
docker compose up --build
```

Then open: http://localhost:5173

Stop containers:

```bash
docker compose down
```

To wipe the database volume and start clean:

```bash
docker compose down -v
```

### Without Docker (Local Development)

#### Prerequisites

- Node.js (v20 or higher recommended)
- npm

Install depedencies

```
npm install
```

Start server

```
npm run dev
```
