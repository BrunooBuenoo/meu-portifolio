# Guia de Configuração: Coleções e Documentos do Firebase Firestore

Este documento descreve detalhadamente a estrutura de dados (coleções, documentos e tipos de campos) necessária para iniciar o seu banco de dados Firebase Firestore totalmente do zero.

---

## 1. Documentos de Configuração (Coleção `settings`)
Crie uma coleção raiz chamada **`settings`**. Dentro dela, crie os seguintes documentos com IDs específicos:

### A. Documento ID: `site`
Guarda as informações gerais e contatos de Bruno.

*   **Campos**:
    *   `name` (string): Seu nome completo (Ex: `Bruno Bueno`).
    *   `title` (string): Seu cargo/título (Ex: `Desenvolvedor Full Stack`).
    *   `about` (string): Texto biográfico para a seção "Sobre Mim".
    *   `thought` (string): Uma citação ou frase de impacto.
    *   `email` (string): Seu e-mail de contato.
    *   `phone` (string): Seu telefone (Ex: `+55 (11) 99999-9999`).
    *   `location` (string): Sua localização (Ex: `São Paulo, SP - Brasil`).
    *   `linkedin` (string): URL do seu LinkedIn.
    *   `github` (string): URL do seu GitHub.
    *   `whatsapp` (string): Link ou número do WhatsApp.
    *   `profileImage` (string): Imagem de perfil codificada em Base64 (opcional).

### B. Documento ID: `hero`
Configurações de velocidade e mensagens do efeito de máquina de escrever do topo da página.

*   **Campos**:
    *   `messages` (array of strings): As frases alternadas no Hero (Ex: `["Olá, sou Bruno Bueno.", "Desenvolvedor de Software."]`).
    *   `typingSpeed` (number): Velocidade de escrita em milissegundos (Recomendado: `85`).
    *   `deletingSpeed` (number): Velocidade de exclusão em milissegundos (Recomendado: `40`).
    *   `pauseStart` (number): Pausa antes de começar a escrever em milissegundos (Recomendado: `400`).
    *   `pauseEnd` (number): Pausa após concluir a frase em milissegundos (Recomendado: `2500`).

### C. Documento ID: `stats`
As estatísticas em destaque exibidas na página inicial.

*   **Campos**:
    *   `stats` (array of maps/objects): Cada item do array deve conter:
        *   `icon` (string): Emoji representativo (Ex: `🚀`, `🏆`, `☕`).
        *   `number` (number): Valor numérico a ser animado (Ex: `25`).
        *   `suffix` (string): Caractere sufixo (Ex: `+`, `%`, ou vazio `""`).
        *   `label` (string): Rótulo da métrica (Ex: `Projetos Concluídos`).

### D. Documento ID: `timeline`
Lista de experiências profissionais e acadêmicas para a Jornada.

*   **Campos**:
    *   `timeline` (array of maps/objects): Cada item do array deve conter:
        *   `date` (string): Período (Ex: `2024 - Presente`).
        *   `title` (string): Seu cargo ou curso (Ex: `Desenvolvedor Full Stack`).
        *   `company` (string): Empresa ou instituição (Ex: `Autônomo`).
        *   `description` (string): Breve resumo das realizações.
        *   `skills` (array of strings): Tecnologias principais usadas (Ex: `["React", "Node.js"]`).

---

## 2. Coleções de Documentos Individuais (Coleções de Nível Raiz)

### A. Coleção: `projects`
Guarda os projetos cadastrados no portfólio.
*   **Nome da Coleção**: `projects`
*   **IDs dos Documentos**: Automáticos (gerados pelo Firestore).
*   **Campos**:
    *   `title` (string): Nome do projeto.
    *   `description` (string): Descrição detalhada do projeto.
    *   `image` (string): Imagem em Base64 ou URL (Ex: `data:image/png;base64,...`).
    *   `technologies` (array of strings): Lista de tecnologias usadas no projeto (Ex: `["Next.js", "Firebase"]`).
    *   `liveUrl` (string): Link do projeto publicado (opcional).
    *   `githubUrl` (string): Link do código-fonte no GitHub (opcional).
    *   `featured` (boolean): `true` se deve aparecer como destaque na home, caso contrário `false`.
    *   `createdAt` (timestamp): Data de criação, usada para ordenação cronológica decrescente.

### B. Coleção: `technologies`
Guarda as tecnologias exibidas no carrossel infinito da página.
*   **Nome da Coleção**: `technologies`
*   **IDs dos Documentos**: Automáticos.
*   **Campos**:
    *   `name` (string): Nome da tecnologia (Ex: `TypeScript`).
    *   `icon` (string): Imagem ou ícone em Base64 ou URL.
    *   `category` (string): Categoria opcional (Ex: `Frontend`, `Backend`, `Tools`).

### C. Coleção: `skills`
Guarda as barras de progresso de habilidades exibidas na seção "Sobre Mim".
*   **Nome da Coleção**: `skills`
*   **IDs dos Documentos**: Automáticos.
*   **Campos**:
    *   `name` (string): Nome da habilidade (Ex: `CSS / Design`).
    *   `percentage` (number): Valor de `0` a `100` representando o nível de proficiência.

### D. Coleção: `messages`
Guarda as mensagens enviadas pelos visitantes do portfólio no formulário de contato.
*   **Nome da Coleção**: `messages`
*   **IDs dos Documentos**: Automáticos.
*   **Campos**:
    *   `name` (string): Nome de quem enviou.
    *   `email` (string): E-mail do remetente.
    *   `message` (string): Texto da mensagem.
    *   `createdAt` (timestamp): Data de envio.
    *   `read` (boolean): `true` se você leu no painel, caso contrário `false`.

---

## 3. Coleção de Cores e Temas (Coleção `theme`)
Crie uma coleção raiz chamada **`theme`**. Dentro dela, crie os seguintes documentos com IDs específicos:

### A. Documento ID: `colors`
Cores dinâmicas personalizadas para o painel nos modos claro e escuro.

*   **Campos**:
    *   `light` (map/object):
        *   `primary` (string Hex): `#ffffff`
        *   `secondary` (string Hex): `#fafafa`
        *   `card` (string Hex): `#f4f4f5`
        *   `textPrimary` (string Hex): `#09090b`
        *   `textSecondary` (string Hex): `#52525b`
        *   `textMuted` (string Hex): `#71717a`
        *   `accent` (string Hex): `#09090b`
        *   `accentHover` (string Hex): `rgba(9,9,11,0.85)`
        *   `border` (string Hex): `#e4e4e7`
    *   `dark` (map/object):
        *   `primary` (string Hex): `#09090b`
        *   `secondary` (string Hex): `#09090b`
        *   `card` (string Hex): `rgba(9,9,11,0.5)`
        *   `textPrimary` (string Hex): `#ffffff`
        *   `textSecondary` (string Hex): `rgba(255,255,255,0.7)`
        *   `textMuted` (string Hex): `rgba(255,255,255,0.4)`
        *   `accent` (string Hex): `#94ff47`
        *   `accentHover` (string Hex): `#a8ff6b`
        *   `border` (string Hex): `#27272a`

### B. Documento ID: `config`
Configurações avançadas do background radial do topo do Hero.

*   **Campos**:
    *   `light` (map/object):
        *   `heroBackground` (map/object):
            *   `circleColor` (string Hex): `rgba(9,9,11,0.05)`
            *   `circleOpacity` (number): `10`
            *   `circleSize` (number): `80`
            *   `circleX` (number): `50`
            *   `circleY` (number): `50`
            *   `innerGlowColor` (string Hex): `#fafafa`
            *   `innerGlowOpacity` (number): `5`
            *   `outerGlowColor` (string Hex): `#ffffff`
            *   `outerGlowOpacity` (number): `2`
    *   `dark` (map/object):
        *   `heroBackground` (map/object):
            *   `circleColor` (string Hex): `#94ff47`
            *   `circleOpacity` (number): `15`
            *   `circleSize` (number): `80`
            *   `circleX` (number): `50`
            *   `circleY` (number): `50`
            *   `innerGlowColor` (string Hex): `#94ff47`
            *   `innerGlowOpacity` (number): `8`
            *   `outerGlowColor` (string Hex): `#09090b`
            *   `outerGlowOpacity` (number): `3`
