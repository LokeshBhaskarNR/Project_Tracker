

# Project Tracker API

A RESTful API built with **NestJS** and **PostgreSQL** that allows users to manage projects and tasks.
It implements **authentication, authorization, validation, error handling, and clean architecture**.

---

## Features

###  Authentication & Authorization

* User **registration** (`POST /auth/register`)
* User **login** (`POST /auth/login`) with **JWT-based authentication**
* Only authenticated users can access **Projects** and **Tasks**
* Users can manage **only their own** projects and tasks

---

###  Users

* Register with **username, email, and password** (passwords stored securely as hashes)

---

###  Projects

* **Create Project** (`POST /projects`)
* **List Projects** (`GET /projects`) – only projects owned by the logged-in user
* **Get Project by ID** (`GET /projects/:id`)
* **Update Project** (`PATCH /projects/:id`)
* **Delete Project** (`DELETE /projects/:id`)

---

###  Tasks

* Tasks are always tied to a **Project** (`/projects/:projectId/tasks`)
* **Create Task** (`POST /projects/:projectId/tasks`)
* **List Tasks** (`GET /projects/:projectId/tasks`)
* **Get Task by ID** (`GET /projects/:projectId/tasks/:taskId`)
* **Update Task** (`PATCH /projects/:projectId/tasks/:taskId`)
* **Delete Task** (`DELETE /projects/:projectId/tasks/:taskId`)

---

###  Architecture & Best Practices

* **Modules**: `AuthModule`, `UsersModule`, `ProjectsModule`, `TasksModule`
* **DTOs** for validation with `class-validator`
* **Exception Filters** for clean error messages
* **Proper HTTP status codes** (`201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`)
* **Logger** for debugging and monitoring
* **Environment Variables** with `@nestjs/config`

---

## Tech Stack

* **NestJS** (framework)
* **PostgreSQL** (database)
* **TypeORM** (ORM)
* **Passport + JWT** (authentication)
* **class-validator** (input validation)
* **Jest** (testing)

---

