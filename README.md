## Visión General

Esta plataforma Web3 permite a los usuarios crear, gestionar y compartir logros y certificados verificables en la blockchain. Desarrollada con tecnologías modernas de la web descentralizada, ofrece una solución segura y transparente para la gestión de logros profesionales y académicos.

## Características Principales

- 🏆 Creación y gestión de logros verificables
- 🔗 Integración con billeteras digitales
- 🌐 Interfaz de usuario intuitiva y responsiva
- 🔒 Seguridad mejorada con tecnología blockchain
- 📱 Diseño compatible con dispositivos móviles
- 🎨 Temas claros y oscuros

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, TypeScript
- **Ethereum**: ethers.js, wagmi, ConnectKit
- **UI/UX**: Radix UI, Tailwind CSS
- **Despliegue**: Vercel

## Requisitos Previos

- Node.js (versión 16.8 o superior)
- npm o pnpm
- Una billetera Web3 como MetaMask
- Variables de entorno configuradas (ver `.env.example`)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd cv-test
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   pnpm install
   ```

3. Configura las variables de entorno:
   - Copia `.env.example` a `.env.local`
   - Configura las variables necesarias

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
.
├── app/                 # Rutas de la aplicación
├── components/          # Componentes reutilizables
├── contracts/           # Contratos inteligentes
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades y configuraciones
├── public/              # Archivos estáticos
└── styles/              # Estilos globales
```

## Despliegue

El proyecto está configurado para desplegarse automáticamente en Vercel cuando se suben cambios a la rama principal.

### Despliegue Manual

1. Construye la aplicación para producción:
   ```bash
   npm run build
   ```

2. Inicia el servidor de producción:
   ```bash
   npm start
   ```

## Contribución

Las contribuciones son bienvenidas. Por favor, crea un "fork" del repositorio y envía un "pull request" con tus cambios.

## Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).

## Contacto

Para consultas o soporte, por favor abre un "issue" en el repositorio.

---

*Este proyecto se sincroniza automáticamente con los despliegues de [v0.dev](https://v0.dev). Cualquier cambio que realices en tu aplicación desplegada se enviará automáticamente a este repositorio desde [v0.dev](https://v0.dev).*
