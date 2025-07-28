# Marketplace API

## Características

- **Gestión de Usuarios**: Registro, login y perfiles de usuarios
- **Categorías**: Organización de productos por categorías
- **Productos**: CRUD completo de productos con imágenes
- **Solicitudes de Compra**: Sistema de solicitudes entre compradores y vendedores
- **Mensajería**: Comunicación entre usuarios
- **Transacciones**: Seguimiento de transacciones completadas

## Tecnologías

- **Backend**: Flask (Python)
- **Base de Datos**: PostgreSQL
- **ORM**: SQLAlchemy
- **Autenticación**: JWT
- **CORS**: Flask-CORS

## Requisitos

- Python 3.8+
- PostgreSQL
- pip

## Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd Market
```

### 2. Crear entorno virtual
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar base de datos

#### Crear usuario y base de datos PostgreSQL:
```bash
sudo -i -u postgres
psql
```

```sql
CREATE USER market_user WITH PASSWORD 'market123';
CREATE DATABASE mymarketdb;
GRANT ALL PRIVILEGES ON DATABASE mymarketdb TO market_user;
GRANT ALL ON SCHEMA public TO market_user;
GRANT CREATE ON SCHEMA public TO market_user;
\q
exit
```

#### Crear tablas:
```bash
psql -U market_user -d mymarketdb
```

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  user_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  seller_id INT REFERENCES users(id),
  title VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  stock INT,
  category_id INT REFERENCES categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  image_url VARCHAR(1024)
);

CREATE TABLE purchase_requests (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  buyer_id INT REFERENCES users(id),
  quantity INT,
  note TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  purchase_request_id INT REFERENCES purchase_requests(id),
  sender_id INT REFERENCES users(id),
  receiver_id INT REFERENCES users(id),
  message TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  purchase_request_id INT REFERENCES purchase_requests(id),
  status VARCHAR(50),
  confirmation_date TIMESTAMP
);
```

### 5. Configurar variables de entorno

Editar `config.py` con tus credenciales de base de datos:
```python
SQLALCHEMY_DATABASE_URI = 'postgresql://market_user:market123@localhost:5432/mymarketdb'
```

### 6. Ejecutar la aplicación
```bash
python run.py
```

La API estará disponible en: `http://127.0.0.1:5000`

## Documentación de la API

### **Base URL:** `http://127.0.0.1:5000`

---

## 1. **USERS** - `/api/users/`

### **1.1 Registrar Usuario**
- **Method:** `POST`
- **URL:** `/api/users/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "user_type": "buyer",
  "phone": "123456789",
  "address": "Calle Principal 123"
}
```
- **Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "user_type": "buyer"
  }
}
```

### **1.2 Login Usuario**
- **Method:** `POST`
- **URL:** `/api/users/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```
- **Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "user_type": "buyer"
  }
}
```

### **1.3 Ver Todos los Usuarios**
- **Method:** `GET`
- **URL:** `/api/users/`
- **Response:** `200 OK`
```json
{
  "users": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "user_type": "buyer"
    }
  ]
}
```

### **1.4 Test Endpoint**
- **Method:** `GET`
- **URL:** `/api/users/test`
- **Response:** `200 OK`
```json
{
  "message": "Users API is working!"
}
```

---

## 2. **CATEGORIES** - `/api/categories/`

### **2.1 Ver Todas las Categorías**
- **Method:** `GET`
- **URL:** `/api/categories/`
- **Response:** `200 OK`
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Electrónicos",
      "description": "Productos electrónicos y tecnología"
    }
  ]
}
```

### **2.2 Crear Categoría**
- **Method:** `POST`
- **URL:** `/api/categories/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Electrónicos",
  "description": "Productos electrónicos y tecnología"
}
```
- **Response:** `201 Created`
```json
{
  "message": "Category created successfully",
  "category": {
    "id": 1,
    "name": "Electrónicos",
    "description": "Productos electrónicos y tecnología"
  }
}
```

---

## 3. **PRODUCTS** - `/api/products/`

### **3.1 Ver Todos los Productos**
- **Method:** `GET`
- **URL:** `/api/products/`
- **Response:** `200 OK`
```json
{
  "products": [
    {
      "id": 1,
      "title": "iPhone 15 Pro",
      "description": "Último modelo de iPhone",
      "price": 1299.99,
      "stock": 5,
      "category_id": 1,
      "seller_id": 2
    }
  ]
}
```

### **3.2 Crear Producto**
- **Method:** `POST`
- **URL:** `/api/products/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "title": "iPhone 15 Pro",
  "description": "Último modelo de iPhone",
  "price": 1299.99,
  "stock": 5,
  "seller_id": 2,
  "category_id": 1
}
```
- **Response:** `201 Created`
```json
{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "title": "iPhone 15 Pro",
    "price": 1299.99,
    "stock": 5
  }
}
```

### **3.3 Ver Producto Específico**
- **Method:** `GET`
- **URL:** `/api/products/{id}`
- **Response:** `200 OK`
```json
{
  "id": 1,
  "title": "iPhone 15 Pro",
  "description": "Último modelo de iPhone",
  "price": 1299.99,
  "stock": 5,
  "category_id": 1,
  "seller_id": 2,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00"
}
```

### **3.4 Actualizar Producto**
- **Method:** `PUT`
- **URL:** `/api/products/{id}`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "title": "iPhone 15 Pro Max",
  "price": 1399.99,
  "stock": 3
}
```
- **Response:** `200 OK`
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "title": "iPhone 15 Pro Max",
    "price": 1399.99,
    "stock": 3
  }
}
```

### **3.5 Eliminar Producto**
- **Method:** `DELETE`
- **URL:** `/api/products/{id}`
- **Response:** `200 OK`
```json
{
  "message": "Product deleted successfully"
}
```

---

## 4. **PURCHASE REQUESTS** - `/api/purchase-requests/`

### **4.1 Ver Todas las Solicitudes**
- **Method:** `GET`
- **URL:** `/api/purchase-requests/`
- **Response:** `200 OK`
```json
{
  "purchase_requests": [
    {
      "id": 1,
      "product_id": 1,
      "buyer_id": 1,
      "quantity": 2,
      "note": "¿Tienes en color negro?",
      "status": "pending",
      "created_at": "2024-01-15T10:30:00",
      "updated_at": "2024-01-15T10:30:00"
    }
  ]
}
```

### **4.2 Crear Solicitud de Compra**
- **Method:** `POST`
- **URL:** `/api/purchase-requests/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "product_id": 1,
  "buyer_id": 1,
  "quantity": 2,
  "note": "¿Tienes en color negro?"
}
```
- **Response:** `201 Created`
```json
{
  "message": "Purchase request created successfully",
  "purchase_request": {
    "id": 1,
    "product_id": 1,
    "buyer_id": 1,
    "quantity": 2,
    "status": "pending"
  }
}
```

### **4.3 Ver Solicitud Específica**
- **Method:** `GET`
- **URL:** `/api/purchase-requests/{id}`
- **Response:** `200 OK`
```json
{
  "id": 1,
  "product_id": 1,
  "buyer_id": 1,
  "quantity": 2,
  "note": "¿Tienes en color negro?",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### **4.4 Actualizar Solicitud**
- **Method:** `PUT`
- **URL:** `/api/purchase-requests/{id}`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "status": "accepted",
  "note": "Sí, tengo en negro. Envío mañana."
}
```
- **Response:** `200 OK`
```json
{
  "message": "Purchase request updated successfully",
  "purchase_request": {
    "id": 1,
    "status": "accepted",
    "note": "Sí, tengo en negro. Envío mañana."
  }
}
```

---

## 5. **MESSAGES** - `/api/messages/`

### **5.1 Ver Mensajes de una Solicitud**
- **Method:** `GET`
- **URL:** `/api/messages/{request_id}`
- **Response:** `200 OK`
```json
{
  "messages": [
    {
      "id": 1,
      "purchase_request_id": 1,
      "sender_id": 1,
      "receiver_id": 2,
      "message": "¿Tienes el producto disponible?",
      "timestamp": "2024-01-15T10:30:00"
    }
  ]
}
```

### **5.2 Enviar Mensaje**
- **Method:** `POST`
- **URL:** `/api/messages/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "purchase_request_id": 1,
  "sender_id": 1,
  "receiver_id": 2,
  "message": "¿Tienes el producto disponible para envío inmediato?"
}
```
- **Response:** `201 Created`
```json
{
  "message": "Message sent successfully",
  "message_data": {
    "id": 1,
    "purchase_request_id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "message": "¿Tienes el producto disponible para envío inmediato?",
    "timestamp": "2024-01-15T10:30:00"
  }
}
```

### **5.3 Ver Mensaje Específico**
- **Method:** `GET`
- **URL:** `/api/messages/{message_id}`
- **Response:** `200 OK`
```json
{
  "id": 1,
  "purchase_request_id": 1,
  "sender_id": 1,
  "receiver_id": 2,
  "message": "¿Tienes el producto disponible?",
  "timestamp": "2024-01-15T10:30:00"
}
```

---

## 6. **TRANSACTIONS** - `/api/transactions/`

### **6.1 Ver Todas las Transacciones**
- **Method:** `GET`
- **URL:** `/api/transactions/`
- **Response:** `200 OK`
```json
{
  "transactions": [
    {
      "id": 1,
      "purchase_request_id": 1,
      "status": "in_progress",
      "confirmation_date": null
    }
  ]
}
```

### **6.2 Crear Transacción**
- **Method:** `POST`
- **URL:** `/api/transactions/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "purchase_request_id": 1,
  "status": "in_progress"
}
```
- **Response:** `201 Created`
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": 1,
    "purchase_request_id": 1,
    "status": "in_progress",
    "confirmation_date": null
  }
}
```

### **6.3 Ver Transacción Específica**
- **Method:** `GET`
- **URL:** `/api/transactions/{id}`
- **Response:** `200 OK`
```json
{
  "id": 1,
  "purchase_request_id": 1,
  "status": "in_progress",
  "confirmation_date": null
}
```

### **6.4 Actualizar Transacción**
- **Method:** `PUT`
- **URL:** `/api/transactions/{id}`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "status": "completed"
}
```
- **Response:** `200 OK`
```json
{
  "message": "Transaction updated successfully",
  "transaction": {
    "id": 1,
    "status": "completed",
    "confirmation_date": "2024-01-15T10:30:00"
  }
}
```

---

## Códigos de Estado HTTP

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos de entrada inválidos
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: email duplicado)
- `500 Internal Server Error` - Error del servidor

---

## Tipos y Estados

### **Tipos de Usuario**
- `buyer` - Comprador
- `seller` - Vendedor
- `both` - Ambos

### **Estados de Solicitud de Compra**
- `pending` - Pendiente
- `accepted` - Aceptada
- `rejected` - Rechazada
- `canceled` - Cancelada

### **Estados de Transacción**
- `in_progress` - En progreso
- `completed` - Completada
- `canceled` - Cancelada

---

## Pruebas

### Ejemplo de flujo completo:

1. **Crear usuario comprador:**
```bash
curl -X POST http://127.0.0.1:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "user_type": "buyer"
  }'
```

2. **Crear usuario vendedor:**
```bash
curl -X POST http://127.0.0.1:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria@example.com",
    "password": "password123",
    "user_type": "seller"
  }'
```

3. **Crear categoría:**
```bash
curl -X POST http://127.0.0.1:5000/api/categories/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electrónicos",
    "description": "Productos electrónicos"
  }'
```

4. **Crear producto:**
```bash
curl -X POST http://127.0.0.1:5000/api/products/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15 Pro",
    "description": "Último modelo",
    "price": 1299.99,
    "stock": 5,
    "seller_id": 2,
    "category_id": 1
  }'
```

