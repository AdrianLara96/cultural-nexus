# Cultural Nexus

Una plataforma frontend moderna para explorar y descubrir recursos culturales digitales (galerías, bibliotecas, archivos y museos) a través de la API GLAM.

# 🚀 Características

- **Interfaz Responsiva**: Diseño adaptable a dispositivos móviles y escritorio
- **Integración GLAM API**: Conexión directa con la API de GLAM para acceder a colecciones culturales
- **Vistas Detalladas**: Navegación a vistas de detalle para registros y colecciones individuales
- **Búsqueda y Filtrado**: Sistema avanzado de búsqueda y filtrado de recursos
- **Paginación**: Gestión eficiente de grandes volúmenes de datos
- **Navegación Intuitiva**: Menús y rutas claras para una experiencia de usuario fluida

# 🛠️ Tecnologías Utilizadas

- [Vue 3](https://vuejs.org/) - Framework progresivo de JavaScript
- [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript con tipado estático
- [Vuetify 3](https://vuetifyjs.com/) - Biblioteca de componentes Material Design
- [Vue Router](https://router.vuejs.org/) - Sistema de enrutamiento
- [Vite](https://vitejs.dev/) - Herramienta de construcción rápida
- [GLAM API](https://libnamic.eu/) - API para acceso a recursos culturales digitales

# 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

# 📦 Instalación

1. Clona el repositorio
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd cultural-nexus

2. Instala las dependencias
    ```bash
    npm install
    # o
    yarn install

3. Inicia el servidor de desarrollo
    ```bash
    npm run dev
    # o
    yarn dev

4. Abre tu navegador en http://localhost:5173

# 🧪 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:
- npm run dev - Inicia el servidor de desarrollo
- npm run build - Crea una versión optimizada para producción
- npm run preview - Previsualiza la versión de producción localmente
- npm run lint - Ejecuta el linter (si está configurado)

# 🗂️ Estructura del Proyecto

src/
├── components/     # Componentes reutilizables
│   └── glam/       # Componentes específicos de GLAM
├── composables/    # Funciones reutilizables de Vue
├── views/          # Vistas de página
├── router/         # Configuración de rutas
├── services/       # Lógica de conexión con APIs
├── types/          # Definiciones de tipos TypeScript
└── config/         # Configuraciones del proyecto

# 🌐 Despliegue

Para desplegar esta aplicación:
1. Genera la versión de producción:
´´´bash
  npm run build

2. Los archivos compilados estarán en la carpeta dist/
3. Sirve los contenidos de dist/ con un servidor web estático

# 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores, por favor abre un issue primero para discutir qué te gustaría cambiar.


# 📞 Contacto

Adrián Lara Moncayo - adrianlaram@gmail.com - www.linkedin.com/in/adrianlaramoncayo

Enlace del proyecto: https://github.com/AdrianLara96/cultural-nexus