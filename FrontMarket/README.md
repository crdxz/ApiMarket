# Frontend Marketplace - Sistema de Login

## 📋 Descripción

Este frontend incluye un sistema completo de login conectado a la API de Marketplace con las siguientes características:

- ✅ Formulario de login funcional
- ✅ Conexión con API REST
- ✅ Modal de errores
- ✅ Spinner de carga
- ✅ Redirección automática
- ✅ Persistencia de sesión

## 🚀 Cómo usar

### 1. Iniciar la API

```bash
# Navegar al directorio de la API
cd Market

# Activar el entorno virtual (si existe)
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar la API
python start_api.py
```

### 2. Probar la conexión

1. Abrir `test-api.html` en tu navegador
2. Hacer clic en "Probar Conexión" para verificar que la API esté funcionando
3. Usar el formulario de test para probar el login

### 3. Usar el sistema de login

1. Abrir `loginPage.html` en tu navegador
2. Ingresar credenciales válidas
3. En caso de éxito, serás redirigido a `mainPage.html`
4. En caso de error, aparecerá un modal con el mensaje de error

## 📁 Archivos principales

- `loginPage.html` - Página de login principal
- `mainPage.html` - Página principal después del login
- `test-api.html` - Página de prueba de la API
- `accountPage.html` - Página de cuenta de usuario
- `productPage.html` - Página de productos

## 🔧 Configuración

### URL de la API
La URL de la API está configurada en `loginPage.html`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Endpoints utilizados
- `POST /api/users/login` - Inicio de sesión
- `GET /api/users/health` - Verificación de estado de la API

## 🎨 Características del UI

- **Diseño responsive** con Tailwind CSS
- **Modal de errores** con animaciones
- **Spinner de carga** durante las peticiones
- **Validación de formularios** en tiempo real
- **Persistencia de sesión** con localStorage

## 🐛 Solución de problemas

### Error de conexión
1. Verificar que la API esté ejecutándose en `http://localhost:5000`
2. Verificar que CORS esté habilitado en la API
3. Usar `test-api.html` para diagnosticar problemas

### Error de login
1. Verificar que las credenciales sean correctas
2. Verificar que el usuario exista en la base de datos
3. Revisar la consola del navegador para errores detallados

### Problemas de redirección
1. Verificar que `mainPage.html` exista en el mismo directorio
2. Verificar que no haya errores de JavaScript en la consola

## 📝 Notas de desarrollo

- El sistema usa `localStorage` para persistir la sesión
- Los errores se muestran en un modal modal
- El formulario incluye validación básica
- La API debe estar ejecutándose para que funcione el login 