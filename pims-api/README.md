# Backend API Setup

This is the backend API for the Special Project 3002 application, built with Laravel 12, PHP 8.2+, and various packages for authentication, permissions, and API management.

## Prerequisites

-   PHP 8.2 or higher
-   Composer
-   A database server (MySQL, PostgreSQL, or SQLite)

## Installation

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install PHP dependencies:

    ```bash
    composer install
    ```

3. Copy the environment file and configure it:

    ```bash
    cp .env.example .env
    ```

    Edit `.env` to set your database connection, app key, and other settings.

4. Generate application key:

    ```bash
    php artisan key:generate
    ```

5. Run database migrations:

    ```bash
    php artisan migrate
    ```

6. (Optional) Seed the database with sample data:
    ```bash
    php artisan db:seed
    ```

## Development

-   Start the development server:

    ```bash
    php artisan serve
    ```

    The API will be available at `http://localhost:8000/api`.

## Key Features

-   Laravel Sanctum for API authentication
-   Spatie Laravel Permission for role-based access control
-   API Platform for API resource management
-   Excel import/export with Maatwebsite Excel
-   AWS S3 integration for file storage

## Environment Variables

Key `.env` variables to configure:

-   `APP_NAME` - Application name
-   `APP_ENV` - Environment (local, production)
-   `APP_KEY` - Application key (generated)
-   `DB_CONNECTION` - Database driver (mysql, pgsql, sqlite)
-   `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` - Database credentials
-   `SANCTUM_STATEFUL_DOMAINS` - Domains for Sanctum (include localhost for development)
