# --- Build com Maven ---
# Imagem oficial do Maven com Java 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia o arquivo de configuração do Maven primeiro para aproveitar o cache do Docker.
COPY pom.xml .

# Baixa todas as dependências do projeto.
RUN mvn dependency:go-offline

# Copia todo o resto do código-fonte do backend.
COPY src ./src

# MUDANÇA: Compila a aplicação, mas pula a execução dos testes.
RUN mvn clean install -DskipTests

# --- Estágio 2: Imagem Final de Execução ---
# Usamos uma imagem oficial e leve da Eclipse Temurin com Java 21 (JRE).
FROM eclipse-temurin:21-jre-alpine

# Define o diretório de trabalho.
WORKDIR /app

# Copia apenas o arquivo .jar compilado do estágio de build para a nossa imagem final.
# Verifique o nome exato do seu JAR na pasta 'target'.
COPY --from=build /app/target/vozes-api-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta que a aplicação vai usar (o Render usará isso).
EXPOSE 8080

# O comando que será executado quando o contêiner iniciar.
ENTRYPOINT ["java", "-jar", "app.jar"]
