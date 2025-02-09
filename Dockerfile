# Etapa 1: Construcción
FROM node:22.13-slim AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json package-lock.json ./

# Instala las dependencias de producción
RUN npm install --only=production

# Copia el resto de la aplicación
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# Construye la aplicación Remix
RUN npm run build

# Etapa 2: Producción
FROM node:22.13-slim AS production

# Establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias de producción desde la etapa de construcción
COPY --from=build /app/node_modules ./node_modules

# Copia el cliente de Prisma generado
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Copia los archivos de construcción y otros necesarios
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# Establece las variables de entorno
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/prisma/dev.db"
ENV PORT=3000

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación en modo producción
CMD ["npm", "run", "start"]

