# Apartment Assist — Spring Boot & MySQL Full-Stack Architecture Guide

Welcome to **Apartment Assist**! This guide is written specifically for college students learning web development, Java Spring Boot, and MySQL database management.

---

## 1. Project Technology Stack

- **Frontend:** Semantic HTML5, CSS3, JavaScript (using modern component principles, responsive layout).
- **Backend:** Java 17+ with Spring Boot 3.3.4.
- **Database:** MySQL 8.0+ / MariaDB (XAMPP or MySQL Workbench).
- **Database Connectivity:** Spring Data JPA + Hibernate ORM.
- **Security:** Spring Security with BCrypt password hashing and session-based authentication.
- **Build Tool:** Maven (`pom.xml`).

---

## 2. Setting Up the Database in MySQL

### Option A: Using XAMPP
1. Open the XAMPP Control Panel and start the **Apache** and **MySQL** modules.
2. Click **Admin** next to MySQL or open your browser at `http://localhost/phpmyadmin`.
3. Click the **SQL** tab.
4. Copy the entire contents of `database/schema.sql` and click **Go**.

### Option B: Using MySQL Workbench
1. Open MySQL Workbench and connect to your local MySQL instance (port `3306`).
2. Go to `File` -> `Open SQL Script...` and select `database/schema.sql`.
3. Click the lightning bolt icon (⚡) to execute the script.
4. Refresh your schemas list; you will see `apartment_assist_db` with all 6 normalized tables.

---

## 3. Configuring `application.properties`

In your Spring Boot project, navigate to `src/main/resources/application.properties` and verify your credentials:

```properties
server.port=8080

# Database credentials
spring.datasource.url=jdbc:mysql://localhost:3306/apartment_assist_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

---

## 4. Running the Spring Boot Application

### In VS Code:
1. Install the **Extension Pack for Java** and **Spring Boot Extension Pack**.
2. Open the project root.
3. Open a new terminal in VS Code:
   ```bash
   mvn clean spring-boot:run
   ```
4. Look for the console message:
   `Tomcat started on port 8080 (http) with context path '/'`

### In IntelliJ IDEA:
1. Go to `File` -> `Open...` and select the `pom.xml` file.
2. Choose **Open as Project**.
3. Allow IntelliJ to download the Maven dependencies.
4. Navigate to `src/main/java/com/apartmentassist/ApartmentAssistApplication.java`.
5. Click the green **Run** arrow next to the `main` method.

---

## 5. How Frontend Communicates with Spring Boot

The frontend uses standard asynchronous `fetch()` API calls to interact with Spring Boot REST controllers:

### Example: Booking a Service
```javascript
async function submitServiceBooking(bookingData) {
  try {
    const response = await fetch('http://localhost:8080/api/bookings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // sends JSESSIONID cookie for session authentication
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }

    const createdBooking = await response.json();
    alert('Booking confirmed! Reference: ' + createdBooking.bookingReference);
  } catch (err) {
    console.error('Failed to book:', err);
  }
}
```

---

## 6. Seed Credentials for Testing

- **Resident:**
  - Email: `resident@apartmentassist.com`
  - Password: `ApartmentPass2026!`
- **Service Provider (Electrician):**
  - Email: `provider.electrician@apartmentassist.com`
  - Password: `ApartmentPass2026!`
- **Administrator:**
  - Email: `admin@apartmentassist.com`
  - Password: `ApartmentPass2026!`
