# --- Estágio 1: Build com Node.js ---
# Usamos uma imagem oficial do Node.js para construir nosso projeto React.
FROM node:18 AS build

# Define o diretório de trabalho.
WORKDIR /app

# Copia os arquivos de configuração de dependências.
COPY package.json package-lock.json ./

# Instala todas as dependências do projeto.
RUN npm install

# Copia todo o resto do código-fonte do frontend.
COPY . .

# Executa o script de build do React, que cria a pasta 'dist' com os arquivos otimizados.
RUN npm run build

# --- Estágio 2: Imagem Final com Nginx ---
# Usamos uma imagem oficial e super leve do Nginx para servir nossos arquivos.
FROM nginx:stable-alpine

# Copia os arquivos estáticos da pasta 'dist' (gerada no estágio anterior)
# para a pasta padrão do Nginx que serve conteúdo web.
COPY --from=build /app/dist /usr/share/nginx/html

# Copia nosso arquivo de configuração customizado do Nginx.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80, que é a porta padrão para HTTP.
EXPOSE 80

# O comando para iniciar o servidor Nginx.
CMD ["nginx", "-g", "daemon off;"]