# Calvillo Experience 🌄

## 📖 Descripción del Proyecto

**Calvillo Experience** es una plataforma integral orientada a potenciar y facilitar el turismo en el Pueblo Mágico de Calvillo, Aguascalientes. Desarrollado como un proyecto universitario por un equipo de seis personas, este sistema busca conectar de manera eficiente a los turistas con la riqueza cultural, gastronómica y de alojamiento que ofrece la región. 

La aplicación permite a los usuarios explorar puntos de interés, consultar negocios locales, gestionar reservas y compartir sus experiencias a través de reseñas, todo respaldado por un panel de administración robusto para la toma de decisiones.

---

## 🚀 Características Principales

* **Exploración y Geolocalización:** Integración de mapas interactivos para localizar negocios y atractivos turísticos en tiempo real utilizando la API de Google Maps.
* **Gestión de Negocios y Reservas:** Plataforma para que los establecimientos publiquen sus servicios y los turistas puedan agendar reservas de manera estructurada.
* **Muro Social y Reseñas:** Espacio para que los usuarios califiquen sus experiencias y dejen comentarios sobre los lugares visitados.
* **Generación de Reportes:** Creación dinámica de reportes en formato PDF e inclusión de gráficos estadísticos en el panel de control.
* **Soporte Multi-idioma:** Interfaz adaptable a diferentes idiomas para atender a turistas nacionales e internacionales.

---

## 🛠 Arquitectura y Stack Tecnológico

El proyecto está construido bajo una arquitectura cliente-servidor, dividida en dos capas principales:

### Frontend (Aplicación Móvil / Web)
Desarrollado con un enfoque multiplataforma para garantizar compatibilidad nativa y web.
* **Framework Core:** Angular y el ecosistema de Ionic Framework.
* **Integración Nativa:** Capacitor (`@capacitor/core`, `@capacitor/geolocation`, `@capacitor/camera`) para acceder a las funciones del hardware del dispositivo.
* **Mapas:** `@angular/google-maps` para la representación cartográfica y rutas.
* **Visualización de Datos:** Implementación de `Chart.js` y `ng2-charts` para métricas, además de `jsPDF` y `html2canvas` para la exportación de documentos.
* **Internacionalización:** Módulo `@ngx-translate/core` para la gestión de traducciones dinámicas.

### Backend (API RESTful)
Construido de forma modular para asegurar escalabilidad y un mantenimiento ágil.
* **Entorno:** Node.js utilizando Express.js como framework minimalista y flexible para el enrutamiento.
* **Base de Datos:** Relacional, utilizando MySQL. La conexión se gestiona a través de la librería `mysql2/promise` implementando un *Pool de conexiones* (hasta 10 simultáneas) que optimiza el rendimiento y evita cuellos de botella mediante asincronía (async/await).
* **Seguridad:** * Manejo de CORS para la restricción de orígenes.
    * Autenticación protegida mediante JSON Web Tokens (`jsonwebtoken`).
    * Encriptación de datos sensibles y contraseñas con `bcrypt`.
* **Almacenamiento Multimedia:** Carga de archivos a la nube mediante la integración de `multer` y la API de Cloudinary (`multer-storage-cloudinary`).

---

## 📂 Estructura de Endpoints (Rutas)

La API sigue principios REST y expone sus servicios estandarizados bajo el prefijo `/api`. Los módulos se dividen de la siguiente manera:

* `/api/usuarios` y endpoints de `login`: Creación de cuentas, validación de credenciales y generación de tokens de acceso.
* `/api/negocios`: CRUD y administración del directorio de empresas turísticas.
* `/api/reservas`: Gestión de fechas, horarios y disponibilidad de los servicios.
* `/api/publicaciones` y `/api/resenas`: Manejo del contenido generado por el usuario, publicaciones en el muro social y sistemas de calificación.
* `/api/dashboard` y `/api/logs`: Módulos exclusivos de administración para visualizar el estado general de la plataforma y el registro de actividades.

---

## ⚙️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado en tu entorno de desarrollo:
1.  **Node.js** (Gestor de paquetes NPM).
2.  **Angular CLI** y **Ionic CLI**.
3.  Servidor de Base de Datos **MySQL** en ejecución.

---

## 💻 Instrucciones de Instalación y Despliegue Local

### 1. Clonar el repositorio y configurar variables de entorno
Descarga el proyecto e ingresa a la raíz de la carpeta. Es estrictamente necesario crear/verificar el archivo de configuración de entornos ubicado en `src/env/env.ts` con las credenciales de tu base de datos local:
```typescript
// Ejemplo de estructura esperada en src/env/env.ts
export const environment = {
  database: {
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_password',
    database: 'calvillo_experience_db'
  }
};
```

### 2. Instalación de dependencias
Descarga todos los módulos necesarios tanto para Ionic/Angular como para Express instalando desde la raíz del proyecto:
``` bash
npm install
```

### 3. Levantar el servidor backend
Inicia la API utilizando el script preconfigurado que emplea nodemon. Esto inicializará el servidor en el puerto 3000 y detectará cambios en tiempo real dentro del directorio src/API:
``` bash
npm run demon
```


### 4. Compilar y ejecutar al frontend
Abre una nueva pestaña en tu terminal (manteniendo el backend corriendo) y lanza la aplicación del cliente:
``` bash
npm start
```
