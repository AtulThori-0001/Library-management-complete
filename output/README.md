# 📚 Library Management System - Setup Guide

## Project Structure
```
librarymanagement/   → Spring Boot Backend (Java)
frontend/
  └── index.html     → Frontend (HTML + JS)
database_setup.sql   → MySQL setup script
```

---

## ✅ Step 1: MySQL Database Setup

MySQL open kar aur yeh run kar:

```sql
CREATE DATABASE IF NOT EXISTS library_db;
```

Ya seedha `database_setup.sql` file run kar:
```
mysql -u root -p < database_setup.sql
```

Password: `harsh123` (tera current password)

---

## ✅ Step 2: Backend Run Karo

`librarymanagement/` folder mein jao aur run karo:

```bash
cd librarymanagement
mvn spring-boot:run
```

Ya Eclipse/IntelliJ mein:
- `LibrarymanagementApplication.java` → Right click → Run as Spring Boot App

**Server starts on:** `http://localhost:9093`

---

## ✅ Step 3: Frontend Open Karo

`frontend/index.html` ko browser mein directly open karo:
- Double click karo index.html
- Ya VS Code mein Open with Live Server

---

## 🔗 API Endpoints

| Method | URL | Kya karta hai |
|--------|-----|----------------|
| GET    | `/` | Server check |
| GET    | `/books` | Saari books fetch |
| POST   | `/books` | Nayi book add |
| PUT    | `/books/{id}` | Book update |
| DELETE | `/books/{id}` | Book delete |
| POST   | `/auth/register` | User register |
| POST   | `/auth/login` | Login → JWT token milta hai |

---

## 🧪 Test with Postman

### Register User:
```
POST http://localhost:9093/auth/register
Body (JSON):
{
  "username": "admin",
  "password": "admin123",
  "role": "ADMIN"
}
```

### Login:
```
POST http://localhost:9093/auth/login
Body (JSON):
{
  "username": "admin",
  "password": "admin123"
}
```
→ JWT token milega response mein

### Add Book:
```
POST http://localhost:9093/books
Body (JSON):
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 499
}
```

---

## ⚠️ Common Errors & Fix

| Error | Fix |
|-------|-----|
| `Communications link failure` | MySQL chal raha hai? Port 3306? |
| `Access denied for user 'root'` | application.properties mein password check karo |
| `Unknown database 'library_db'` | database_setup.sql run karo |
| Port 9093 already in use | `application.properties` mein port change karo |

---

## 📝 application.properties Location

```
librarymanagement/src/main/resources/application.properties
```

Agar password different hai toh wahan change karo.
