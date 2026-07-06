# Referência de Caminhos e Coleções do Firebase Firestore

Este documento descreve detalhadamente a estrutura de dados (coleções, documentos e esquemas de campos) integrada no Firestore para o portfólio. Mantenha esta referência ao refatorar a interface gráfica para garantir que os dados sejam lidos e salvos corretamente.

---

## 1. Coleções de Nível de Raiz

### A. Coleção: `projects`
Utilizada para armazenar os projetos exibidos no portfólio.

*   **Caminho do Documento:** `/projects/{projectId}`
*   **Campos do Documento:**
    *   `title` (string): Nome do projeto.
    *   `description` (string): Texto de descrição sobre o projeto.
    *   `image` (string - Base64): Imagem comprimida do projeto.
    *   `technologies` (array of strings): Lista de tecnologias usadas (ex: `["React", "TypeScript"]`).
    *   `liveUrl` (string): Link para visualizar o projeto publicado (opcional).
    *   `githubUrl` (string): Link para o código-fonte no GitHub (opcional).
    *   `featured` (boolean): `true` se o projeto for destaque na Home, `false` caso contrário.
    *   `createdAt` (timestamp): Data de criação do projeto (usada para ordenação cronológica decrescente).

---

### B. Coleção: `technologies`
Armazena a lista de tecnologias para exibição no carrossel infinito ou seções de habilidades.

*   **Caminho do Documento:** `/technologies/{techId}`
*   **Campos do Documento:**
    *   `name` (string): Nome da tecnologia (ex: `TypeScript`).
    *   `category` (string): Categoria da tecnologia (`Frontend`, `Backend`, `Database`, `Tools`).
    *   `icon` (string - Base64): Ícone gráfico em formato de imagem base64.

---

### C. Coleção: `skills`
Usada para as barras de progresso na seção "Sobre Mim".

*   **Caminho do Documento:** `/skills/{skillId}`
*   **Campos do Documento:**
    *   `name` (string): Nome da habilidade (ex: `React`).
    *   `percentage` (number): Valor de 0 a 100 indicando o nível de proficiência.

---

### D. Coleção: `messages`
Armazena as mensagens de contato enviadas pelos visitantes do portfólio.

*   **Caminho do Documento:** `/messages/{messageId}`
*   **Campos do Documento:**
    *   `name` (string): Nome completo do remetente.
    *   `email` (string): Endereço de e-mail do remetente.
    *   `message` (string): Conteúdo textual da mensagem.
    *   `createdAt` (timestamp): Data de envio da mensagem.
    *   `read` (boolean): `true` se a mensagem foi visualizada pelo administrador, `false` caso contrário.

---

## 2. Documentos de Configuração Únicos (Coleções de Configurações)

Estas configurações dinâmicas ficam centralizadas em documentos específicos dentro de coleções de configurações gerais.

### A. Documento: `/settings/site`
Configurações de identidade e informações de contato do profissional.

*   **Campos do Documento:**
    *   `name` (string): Seu nome completo (ex: `Bruno Bueno`).
    *   `title` (string): Subtítulo ou cargo profissional principal (ex: `Desenvolvedor Full Stack`).
    *   `about` (string): Texto descritivo da seção "Sobre Mim".
    *   `thought` (string): Citação reflexiva ou pensamento destacado na seção "Sobre Mim".
    *   `email` (string): E-mail para contato de negócios.
    *   `phone` (string): Número de telefone formatado.
    *   `location` (string): Cidade/Estado e país.
    *   `linkedin` (string): URL do perfil do LinkedIn (opcional).
    *   `github` (string): URL do perfil do GitHub (opcional).
    *   `whatsapp` (string): Número do WhatsApp ou link direto (opcional).
    *   `profileImage` (string - Base64): Imagem de perfil do desenvolvedor (opcional).

---

### B. Documento: `/settings/hero`
Configurações do efeito de digitação automática no cabeçalho principal.

*   **Campos do Documento:**
    *   `messages` (array of strings): Lista de frases que se alternam no efeito de escrita.
    *   `typingSpeed` (number): Velocidade de digitação em milissegundos por caractere.
    *   `deletingSpeed` (number): Velocidade de apagamento em milissegundos por caractere.
    *   `pauseEnd` (number): Tempo de pausa ao finalizar a digitação de uma frase (em ms).
    *   `pauseStart` (number): Tempo de pausa antes de começar a digitar a frase (em ms).

---

### C. Documento: `/settings/stats`
Estatísticas e contadores numéricos na Home.

*   **Campos do Documento:**
    *   `stats` (array of objects): Lista de itens de estatísticas. Cada objeto contém:
        *   `icon` (string): Emoji representativo (ex: `🚀`).
        *   `number` (number): Valor do contador (ex: `25`).
        *   `suffix` (string): Sufixo de exibição (ex: `+`, `%`).
        *   `label` (string): Descrição da métrica (ex: `Projetos Concluídos`).

---

### D. Documento: `/settings/timeline`
Lista de experiências profissionais e acadêmicas da linha do tempo.

*   **Campos do Documento:**
    *   `timeline` (array of objects): Itens cronológicos. Cada objeto contem:
        *   `date` (string): Período (ex: `2024 - Presente`).
        *   `title` (string): Cargo ou curso (ex: `Desenvolvedor Full Stack`).
        *   `company` (string): Empresa ou instituição (ex: `Autônomo`).
        *   `description` (string): Descrição das atividades desempenhadas.
        *   `skills` (array of strings): Habilidades utilizadas (ex: `["React", "Node.js"]`).

---

## 3. Configurações de Tema Dinâmico

Configurações avançadas de cores e background do Hero, gerenciadas pelo painel de controle e armazenadas no Firestore.

### A. Documento: `/theme/colors`
Variáveis de paleta de cores para os modos claro e escuro.

*   **Campos do Documento:**
    *   `light` e `dark` (objects): Configuração para cada modo contendo:
        *   `primary` (string - Hex): Cor do background principal.
        *   `secondary` (string - Hex): Cor do background secundário.
        *   `card` (string - Hex): Cor de fundo dos cards.
        *   `textPrimary` (string - Hex): Cor do texto principal.
        *   `textSecondary` (string - Hex): Cor do texto secundário.
        *   `textMuted` (string - Hex): Cor do texto silenciado (muted).
        *   `accent` (string - Hex): Cor de destaque (botões principais, detalhes).
        *   `accentHover` (string - Hex): Cor de hover para elementos de destaque.
        *   `border` (string - Hex): Cor de bordas e divisores.

---

### B. Documento: `/theme/config`
Configurações avançadas do background interativo do Hero (como o círculo glow futurista).

*   **Campos do Documento:**
    *   `light` e `dark` (objects): Contendo o objeto `heroBackground` com os seguintes campos:
        *   `circleColor` (string - Hex): Cor do círculo de glow.
        *   `circleOpacity` (number - 0 a 100): Opacidade da borda do círculo.
        *   `circleSize` (number - 10 a 200): Tamanho proporcional do círculo em %.
        *   `circleX` (number - -50 a 150): Posição X do centro do círculo em %.
        *   `circleY` (number - -50 a 150): Posição Y do centro do círculo em %.
        *   `innerGlowColor` (string - Hex): Cor de brilho interno do degradê.
        *   `innerGlowOpacity` (number - 0 a 100): Intensidade do brilho interno.
        *   `outerGlowColor` (string - Hex): Cor de brilho externo.
        *   `outerGlowOpacity` (number - 0 a 100): Intensidade do brilho externo.
