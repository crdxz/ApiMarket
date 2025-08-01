# Funcionalidad de Subida de Imágenes - Marketplace

## Descripción

Se ha implementado la funcionalidad completa de subida de imágenes para productos en el dashboard del vendedor. Los usuarios pueden ahora subir imágenes de sus productos que se almacenan en el servidor y se asocian con los productos en la base de datos.

## Características Implementadas

### Backend
- **Nueva ruta de API**: `/api/product-images/upload` para subir imágenes
- **Validación de archivos**: Solo permite formatos JPG, PNG, GIF, WEBP
- **Límite de tamaño**: Máximo 5MB por imagen
- **Almacenamiento seguro**: Los archivos se guardan con nombres únicos en `Market/static/product_images/`
- **Base de datos**: Las rutas de las imágenes se almacenan en la tabla `product_images`

### Frontend
- **Interfaz intuitiva**: Área de arrastrar y soltar para seleccionar imágenes
- **Preview en tiempo real**: Muestra la imagen seleccionada antes de subir
- **Validación del lado cliente**: Verifica tipo y tamaño de archivo
- **Integración completa**: Funciona con el formulario de creación de productos

## Estructura de Archivos

```
Market/
├── app/routes/product_images.py    # API para manejo de imágenes
├── static/product_images/          # Carpeta donde se almacenan las imágenes
└── ...

FrontMarket/
├── dashboardSellerPage.html        # Dashboard con funcionalidad de imágenes
├── css/dashboardSellerPage.css     # Estilos para subida de imágenes
├── js/dashboardSellerPage.js       # JavaScript para manejo de imágenes
└── test-image-upload.html          # Página de prueba
```

## Cómo Probar

### 1. Iniciar el Servidor Backend
```bash
cd Market
python start_api.py
```

### 2. Probar la Funcionalidad

#### Opción A: Usar la página de prueba
1. Abrir `FrontMarket/test-image-upload.html` en el navegador
2. Llenar el formulario con datos de prueba
3. Seleccionar una imagen
4. Hacer clic en "Crear Producto"

#### Opción B: Usar el dashboard del vendedor
1. Abrir `FrontMarket/dashboardSellerPage.html`
2. Iniciar sesión como vendedor
3. Hacer clic en "Crear Nuevo Producto"
4. Llenar el formulario y seleccionar una imagen
5. Hacer clic en "Crear Producto"

## API Endpoints

### Subir Imagen
- **URL**: `POST /api/product-images/upload`
- **Content-Type**: `multipart/form-data`
- **Parámetros**:
  - `image`: Archivo de imagen
  - `product_id`: ID del producto

### Obtener Imágenes de un Producto
- **URL**: `GET /api/product-images/product/{product_id}`
- **Respuesta**: Lista de imágenes del producto

## Validaciones

### Backend
- ✅ Tipo de archivo permitido (JPG, PNG, GIF, WEBP)
- ✅ Tamaño máximo 5MB
- ✅ Producto existe antes de subir imagen
- ✅ Manejo de errores robusto

### Frontend
- ✅ Preview de imagen antes de subir
- ✅ Validación de tipo de archivo
- ✅ Validación de tamaño
- ✅ Interfaz intuitiva con drag & drop
- ✅ Botón para remover imagen

## Base de Datos

La tabla `product_images` almacena:
- `id`: Identificador único
- `product_id`: ID del producto (foreign key)
- `image_url`: Ruta relativa de la imagen en el servidor

## Consideraciones de Seguridad

1. **Nombres únicos**: Los archivos se renombran con UUID para evitar conflictos
2. **Validación de tipos**: Solo se permiten formatos de imagen seguros
3. **Límite de tamaño**: Previene ataques de DoS
4. **Rutas relativas**: Las URLs se almacenan como rutas relativas para portabilidad

## Próximos Pasos Sugeridos

1. **Múltiples imágenes**: Permitir subir varias imágenes por producto
2. **Redimensionamiento**: Automatizar el redimensionamiento de imágenes
3. **CDN**: Implementar un CDN para mejor rendimiento
4. **Compresión**: Comprimir imágenes automáticamente
5. **Eliminación**: Permitir eliminar imágenes de productos

## Solución de Problemas

### Error "No file part"
- Verificar que el formulario use `multipart/form-data`
- Asegurar que el campo se llame `image`

### Error "File type not allowed"
- Verificar que la imagen sea JPG, PNG, GIF o WEBP
- Comprobar la extensión del archivo

### Error "Product not found"
- Verificar que el `product_id` sea válido
- Asegurar que el producto exista en la base de datos

### Imagen no se muestra
- Verificar que la ruta en la base de datos sea correcta
- Comprobar que el archivo existe en `Market/static/product_images/`
- Verificar permisos de lectura del archivo 