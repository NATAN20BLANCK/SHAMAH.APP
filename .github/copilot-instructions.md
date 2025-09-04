# Copilot Instructions for SHAMAH.APP

## Visão Geral
Este projeto é um app multiplataforma (React Native/Expo + Next.js) com integração web e mobile, scripts customizados e regras rígidas para UI/UX de componentes críticos.

## Arquitetura
- **Mobile/Web:** Usa Expo, React Native, Next.js e Vite para builds e execução.
- **Entradas principais:** `app-entry.js`, `vite-entry.js`, `server.js`.
- **Componentes e páginas:** Em `components/`, `pages/`, `app/` e `src/`.
- **Configurações:** `metro.config.js`, `next.config.js`, `vite.config.js`, `webpack.config.js`.
- **Scripts:** Use sempre os scripts do `package.json` para rodar, buildar e debugar.

## Workflows Essenciais
- **Rodar local:**
  - `npm install` para instalar dependências.
  - `npm run start` para Expo (mobile/dev).
  - `npm run web` para rodar versão web (porta 8030).
- **Builds customizados:**
  - Use scripts `.ps1` para Windows (ex: `start-web.ps1`).
  - Use `restart-server.bat` para reiniciar ambiente local.
- **Debug:**
  - Debugue pelo Expo Go ou navegador (web).

## Convenções e Regras Específicas
- **NUNCA altere:**
  - Posição, z-index, pointerEvents do botão FAB (ver `REGRAS_DO_GITHUB_COPILOT.md`).
  - Rotas do FABMenu (sempre `/tabs/agendados` e `/tabs/contas`).
- **Siga sempre:**
  - Estrutura de pastas e nomes de arquivos já existentes.
  - Não mova arquivos críticos de configuração.
- **Pode alterar:**
  - Textos, espaçamentos mínimos, apenas se solicitado.

## Integrações e Dependências
- **Principais:** Expo, React Native, Next.js, Vite, Express, Metro, Webpack.
- **Atenção:**
  - Dependências e versões são sensíveis. Sempre rode `npm install` após qualquer alteração em `package.json`.

## Exemplos de Padrões
- Componentes em `components/` seguem padrão funcional React.
- Serviços e hooks em `services/` e `hooks/`.
- Configurações de build e bundler em arquivos raiz (`*.config.js`).

## Referências
- Consulte `REGRAS_DO_GITHUB_COPILOT.md` para restrições de UI.
- Consulte scripts no `package.json` e arquivos `.ps1` para automações.

---
Se não tiver certeza sobre uma alteração, consulte os arquivos de regras ou peça revisão.
