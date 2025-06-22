# Dockerfile para NestJS Realworld Example App
FROM node:18-alpine

# Instalar dependências do sistema incluindo OpenSSL
RUN apk add --no-cache bash openssl

# Criar diretório da aplicação
WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./
COPY yarn.lock ./

# Instalar todas as dependências (incluindo devDependencies para testes)
RUN npm ci

# Copiar código fonte
COPY . .

# Instalar Prisma CLI globalmente
RUN npm install -g prisma

# Gerar cliente Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação em produção
CMD [ "npm", "run", "start:prod" ] 