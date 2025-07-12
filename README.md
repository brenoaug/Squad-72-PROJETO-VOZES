Squad 72 - Projeto Vozes

## Integrantes Ativos

* **Adrielle Hanna** (Líder)
* **Luke Roger** (Vice-Líder)
* **Rogério Batista**
* **Breno Augusto**

## Desafio Escolhido e Visão do Projeto

O projeto está alinhado com o **ODS 16 da ONU**, que trata da Paz, Justiça e Instituições Eficazes. O objetivo é fortalecer os direitos humanos, combater a violência e promover uma sociedade mais justa e igualitária.

## Problema Identificado

A subnotificação da violência contra a comunidade **LGBTQIAPN+** é um problema grave. Muitas vítimas não denunciam por medo de represálias, falta de apoio institucional ou descrença na efetividade das denúncias formais. Isso perpetua a impunidade e dificulta a implementação de políticas públicas eficazes.

O **Projeto Vozes** busca solucionar esse problema ao oferecer um canal seguro, anônimo e acessível para relatar casos de agressão, discriminação e violência. A plataforma visa dar visibilidade a esses casos e gerar dados que possam pressionar autoridades e contribuir para estratégias de segurança, respeito e inclusão.

## Público-Alvo

O público-alvo são pessoas LGBTQIAPN+ expostas a situações de violência, independentemente da idade, grau de escolaridade ou condição socioeconômica. Além das vítimas, o projeto também pode ser utilizado por testemunhas, aliados, organizações e instituições que desejam apoiar a causa e fortalecer a luta contra a violência e discriminação.

## Justificativa e Dados Oficiais

A escolha do problema foi baseada em fontes oficiais:

* **Associação Nacional de Travestis e Transexuais (ANTRA)** - Brasil lidera o ranking mundial de assassinatos de pessoas trans e travestis.
* **Instituto DataFolha (2023)** - Grande parte da população LGBTQIAPN+ já sofreu algum tipo de violência ou discriminação.
* **Secretaria de Direitos Humanos** - Muitos casos não são denunciados por medo de represálias ou falta de confiança nas autoridades.

A ausência de denúncias impede a criação de políticas eficazes e reforça a impunidade. O Projeto Vozes propõe uma solução para facilitar denúncias anônimas e fortalecer políticas públicas de proteção.

## Impacto no Público-Alvo

A violência contra LGBTQIAPN+ causa:

* Medo e insegurança, levando ao ocultamento da identidade.
* Problemas de saúde mental, como ansiedade e depressão.
* Dificuldade de acesso à justiça, devido ao medo de represálias.
* Exclusão social e econômica, dificultando acesso a trabalho, educação e moradia.
* Ciclo de impunidade, perpetuando a violência.

O Projeto Vozes busca minimizar esses impactos ao criar um espaço seguro e anônimo para denúncias e acolhimento.

## Arquitetura e Tecnologias Utilizadas

A aplicação é uma solução fullstack modularizada, desenvolvida com as seguintes tecnologias e organizada com Docker:

### Backend (API RESTful)

* **Linguagem:** Java 21
* **Framework:** Spring Boot
* **Ferramenta de Build:** Maven
* **Banco de Dados:** MySQL 8.0

### Frontend

* **Biblioteca:** React 18
* **Gerenciador de Pacotes:** npm
* **Servidor Web (local/Docker):** Nginx (para servir a aplicação React)
* **Gerenciamento de Requisições HTTP:** Axios

### Orquestração e Contêineres

* **Docker:** Utilizado para conteinerização dos serviços, garantindo ambientes isolados e consistentes.
* **Docker Compose:** Usado para orquestrar e gerenciar a execução de múltiplos contêineres (MySQL, Backend, Frontend) em ambiente de desenvolvimento local.

## Estrutura do Projeto

O repositório está organizado nas seguintes pastas principais:

* `backend/vozes-api/`: Contém o código-fonte da API Spring Boot e seu Dockerfile.
* `frontend/vozes-react/`: Contém o código-fonte da aplicação React e seu Dockerfile.
* `docker-compose.yml`: Arquivo para orquestração local dos serviços.
* `render.yaml`: Arquivo de configuração para deploy da aplicação no Render.

## Como Rodar a Aplicação Localmente (com Docker Compose)

Para iniciar todos os serviços localmente, siga estes passos:

1. **Pré-requisitos:** Certifique-se de ter o **Docker Desktop** instalado e em execução.
  
2. **Clone o Repositório:**
  
      git clone https://github.com/brenoaug/Squad-72-PROJETO-VOZES.git
      cd Squad-72-PROJETO-VOZES
  
3. **Inicie os Contêineres:**
  
      docker-compose up --build -d
  
  Este comando irá construir as imagens Docker (se necessário), criar uma rede interna e iniciar os contêineres de banco de dados (MySQL), backend (Spring Boot) e frontend (React).O volume `mysql_data` será criado para persistir os dados do banco. Se você precisar reiniciar o banco do zero, use `docker-compose down -v` antes.
  
4. **Acesse a Aplicação:**
  
  * **Frontend:** `http://localhost:5173`
  * **Backend API:** `http://localhost:8080` (A API é acessada pelo frontend )

## Deploy da Aplicação (Render)

A aplicação foi implantada na plataforma **Render.com**

### Serviços Implantados no Render:

* **Banco de Dados PostegreSQL**
  * **Nome do Serviço:** `projeto-vozes-database`
* **Backend (Spring Boot):** Implantado como um Web Service.
  * **Nome do Serviço:** `projeto-vozes-backend`
* **Frontend (React):** Implantado como um Static Site.
  * **Nome do Serviço:** `vozes-frontend`
  * **URL Pública:** `projeto-vozes-frontend.onrender.com`

### Acesso à Aplicação Implantada:

* **Site Funcional (Deploy no Render):** [Vozes](https://projeto-vozes-frontend.onrender.com/)
  
  > **Nota:** Este serviço utiliza uma instância gratuita na plataforma Render. Quando a instância fica inativa por um período ela entra automaticamente em modo de “suspensão” (*spin down*) para otimizar recursos.
  > 
  > Ao receber uma nova requisição após esse tempo inativo, o Render “desperta” a instância, o que pode causar um **atraso de até 50 segundos ou mais** na primeira resposta. Após essa retomada, o serviço volta a operar normalmente até que ocorra uma nova inatividade.
  

## Cronograma de Atividades

* **Janeiro**
  * Compreensão do tema e definição do problema.
  * Ideação e planejamento da solução.``
  * Validação.
  * Estrutura HTML do site.
* **Fevereiro**
  * Desenvolvimento e testes (estilização CSS, implementação de scripts e Bootstrap).
  * Apresentação (slides, pitch, bastidores).
  * Entrega do projeto.

## Distribuição das Atividades no Squad

* **Rogério Batista:** Ideação, Slide, Apresentação.
* **Adrielle Hanna:** Pesquisa, Programação, Modelagem do Banco de Dados.
* **Luke Roger:** Pesquisa, Programação, Modelagem do Banco de Dados.
* **Breno Augusto:** Transformação do HTML/CSS original em Frontend React, Desenvolvimento do Backend com persistência de dados, Implementação de autenticação e autorização usando Token JWT no Backend, Modificação e criação de logos do site utilizando Figma.

## Ferramenta de Gerenciamento

A equipe utilizará **Notion** para monitoramento das atividades.

## Links Importantes

* **Site Funcional (Deploy no Render):** [Vozes](https://projeto-vozes-frontend.onrender.com/)
* **Repositório GitHub:** [GitHub Squad 72](https://github.com/adriellehanna/Squad-72-PROJETO-VOZES.git )
* **URL da API (Backend no Render):** [projeto-vozes-backend](https://squad-72-projeto-vozes.onrender.com/)