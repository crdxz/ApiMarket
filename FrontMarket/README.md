# FrontMarket - Frontend del Marketplace

Este es el frontend de la aplicación Marketplace, construido con HTML, CSS (Tailwind) y JavaScript vanilla.

## 🚀 Funcionalidades Implementadas

### ✅ Autenticación y Redirección por Tipo de Usuario
- **Login inteligente**: El sistema redirige automáticamente según el tipo de usuario
  - **Vendedores** → `dashboardSellerPahe.html` (Dashboard de vendedor)
  - **Compradores** → `mainPage.html` (Página principal de compras)

### ✅ Dashboard de Vendedor
- **Productos dinámicos**: Muestra todos los productos publicados por el vendedor logueado
- **Gestión de productos**: Funcionalidad para editar y eliminar productos
- **Estados de productos**: Visualización del estado activo/inactivo
- **Información detallada**: Precios, fechas de publicación, stock

### ✅ Página Principal (Compradores)
- **Filtrado por categorías**: Navegación por categorías de productos
- **Búsqueda en tiempo real**: Filtrado de productos por nombre
- **Interfaz responsiva**: Diseño adaptativo para diferentes dispositivos

## 📁 Estructura de Archivos

```
FrontMarket/
├── loginPage.html              # Página de login con redirección inteligente
├── mainPage.html               # Página principal para compradores
├── dashboardSellerPahe.html    # Dashboard para vendedores
├── productPage.html            # Página de detalle de producto
├── accountPage.html            # Página de cuenta de usuario
├── test-redirect.html          # Página de prueba para verificar redirecciones
└── README.md                   # Este archivo
```

## 🛠️ Configuración y Uso

### 1. Preparar la Base de Datos
```bash
# Navegar al directorio de la API
cd Market

# Activar el entorno virtual (si existe)
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Insertar datos de prueba
python insert_test_data.py
```

### 2. Iniciar la API
```bash
# En el directorio Market/
python start_api.py
```

### 3. Probar las Funcionalidades

#### Opción A: Usar la página de prueba
1. Abrir `test-redirect.html` en el navegador
2. Usar las credenciales de prueba:
   - **Vendedor**: `vendedor@test.com` / `password123`
   - **Comprador**: `comprador@test.com` / `password123`

#### Opción B: Usar el flujo normal
1. Abrir `loginPage.html`
2. Iniciar sesión con las credenciales de prueba
3. Ser redirigido automáticamente según el tipo de usuario

## 🔧 API Endpoints Utilizados

### Autenticación
- `POST /api/users/login` - Login de usuario

### Productos
- `GET /api/products/` - Obtener todos los productos
- `GET /api/products/seller/{seller_id}` - Obtener productos por vendedor
- `DELETE /api/products/{product_id}` - Eliminar producto

### Categorías
- `GET /api/categories/` - Obtener todas las categorías

## 🎯 Flujo de Usuario

### Para Vendedores:
1. Login con credenciales de vendedor
2. Redirección automática al dashboard
3. Visualización de productos publicados
4. Gestión de productos (editar/eliminar)

### Para Compradores:
1. Login con credenciales de comprador
2. Redirección automática a la página principal
3. Navegación por categorías
4. Búsqueda de productos

## 🐛 Solución de Problemas

### Error de Conexión a la API
- Verificar que la API esté ejecutándose en `http://localhost:5000`
- Revisar la consola del navegador para errores de CORS

### Problemas de Redirección
- Limpiar el localStorage del navegador
- Verificar que los datos de usuario incluyan `user_type`

### Productos No Aparecen
- Verificar que existan productos en la base de datos
- Comprobar que el usuario tenga el tipo correcto (`seller` o `buyer`)

## 📝 Notas de Desarrollo

- **CORS**: La API tiene CORS habilitado para desarrollo
- **LocalStorage**: Se usa para persistir la sesión del usuario
- **Responsive**: Todas las páginas son responsivas usando Tailwind CSS
- **Error Handling**: Manejo de errores en todas las operaciones de red

## 🔮 Próximas Mejoras

- [ ] Implementar registro de usuarios
- [ ] Añadir funcionalidad de crear productos
- [ ] Implementar sistema de mensajes
- [ ] Añadir filtros avanzados
- [ ] Implementar paginación
- [ ] Añadir sistema de valoraciones 