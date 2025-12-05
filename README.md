# SafeSwap - Pagos Crypto Presenciales

SafeSwap es una aplicación web diseñada para facilitar pagos presenciales (cara a cara) utilizando criptomonedas (USDC) de manera segura y rápida.

## 🚀 Funcionalidades

*   **Vendedor**: Genera un código QR con el monto y referencia del producto.
*   **Comprador**: Escanea el QR, conecta su billetera y realiza el pago en dos pasos (Aprobar USDC -> Pagar).
*   **Soporte de Billeteras**: Compatible con **Core Wallet**, MetaMask, Rainbow, Coinbase Wallet y cualquier billetera inyectada en el navegador.
*   **Red**: Configurado para Avalanche Fuji (Testnet).

## 🛠️ Tecnologías

*   **Frontend**: Next.js 14, Tailwind CSS, RainbowKit, Wagmi, Viem.
*   **Smart Contracts**: Solidity, Hardhat.
*   **Infraestructura**: Docker & Docker Compose.

## 📋 Requisitos Previos

*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo.

## 🏃‍♂️ Cómo Ejecutar el Proyecto

La forma más sencilla de correr el proyecto es utilizando Docker, ya que maneja todas las dependencias automáticamente.

### 1. Iniciar la Aplicación

Abre una terminal en la carpeta raíz del proyecto y ejecuta:

```bash
docker-compose up --build
```

Esto levantará dos servicios:
*   **Frontend**: Disponible en `http://localhost:3000`
*   **Contracts**: Nodo local o scripts de despliegue (si aplica).

### 2. Detener la Aplicación

Para detener los contenedores, presiona `Ctrl + C` o ejecuta:

```bash
docker-compose down
```

## 🐛 Solución de Problemas Comunes

### Error: `SyntaxError: Named export 'useCallback' not found`
Este error ocurre por incompatibilidad entre versiones de librerías en Docker.
**Solución**: Ya está aplicada en la configuración (`next.config.js`), pero si persiste, asegúrate de reconstruir el contenedor con `docker-compose up --build`.

### La Billetera Core no aparece
Asegúrate de tener la extensión de Core Wallet instalada en tu navegador. Si no aparece en la lista "Recommended", busca la opción "Browser Wallet" o "Injected Wallet".

## 📁 Estructura del Proyecto

*   `/contracts`: Código de los contratos inteligentes (Solidity).
*   `/frontend`: Código de la aplicación web (Next.js).
    *   `/pages`: Rutas de la aplicación (`pay.tsx`, `sell.tsx`).
    *   `/components`: Componentes reutilizables.
