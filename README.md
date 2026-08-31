Ledger — Personal Asset & Warranty Tracker

A full-stack, individual-centric web application designed to catalog high-value belongings, track dynamic warranty timelines, and centralize proof-of-purchase documents. Built with Angular, Spring Boot (Java), and MySQL.

---

## 📌 Features

- Summary Dashboard: High-level metrics showing total inventory valuation, active warranty counts, and expiration warnings.
- Dynamic Warranty Tracking: Custom business logic supporting Manufacturer, Extended/Third-Party, and Lifetime warranties with active day countdowns.
- Manual Activation Alerts: Flags products requiring registration actions within specific deadlines (e.g., within 14 days of purchase).
- Document Vault: Centralized storage for receipts, invoices, and product manuals.
- Search & Category Filtering: Instant filtering across multiple item categories (Electronics, Appliances, Tools, Fitness, etc.).

---

## 🛠️ Tech Stack

Frontend (Client)
- Framework: Angular 18+ (Standalone Components, Signals, Reactive Forms)
- Styling: Tailwind CSS
- HTTP Client: Angular `HttpClient`
- Design & Wireframes: Figma

Backend (Server)
- Language: Java 17 / 21
- Framework: Spring Boot 3.x
- Data Access: Spring Data JPA / Hibernate
- Security: Spring Security + JWT Authentication
- Build Tool: Maven

Database & Storage
- Database: MySQL 8.0+
- File Storage (Planned): AWS S3

---

## 📂 Repository Structure

```text
asset-tracker/
├── client/                 # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Guards, interceptors, auth services
│   │   │   ├── features/   # Dashboard, Assets, Vault components
│   │   │   └── shared/     # Reusable UI widgets & models
│   └── package.json
│
├── server/                 # Spring Boot backend application
│   ├── src/main/java/com/ledger/
│   │   ├── controller/     # REST API Controllers
│   │   ├── dto/            # Request/Response DTOs
│   │   ├── model/          # JPA Entities (User, Asset, Warranty)
│   │   ├── repository/     # Spring Data Repositories
│   │   └── service/        # Business logic & expiration calculations
│   └── pom.xml
│
└── docs/                   # UI Wireframes, Schema diagrams, API documentation
