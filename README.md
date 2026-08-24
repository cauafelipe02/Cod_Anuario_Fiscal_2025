# 📊 PIF - Painel de Indicadores Fiscais (STN/SEPLAG-PE)

## 📑 Descrição:
Repositório destinado ao **desenvolvimento da aplicação web do Painel de Indicadores Fiscais (PIF)** para a **SEPLAG-PE**. 

A plataforma foi criada para centralizar, exibir e documentar de forma interativa a visualização dos **indicadores fiscais da Secretaria do Tesouro Nacional (STN)** aplicados aos municípios de Pernambuco, além de disponibilizar o acesso direto ao **Anuário Fiscal de 2024**.

LINK ACESSÍVEL: https://pif-seplag.vercel.app/

## 🛠️ Tecnologias utilizadas:
- `HTML5` — estruturação semântica de toda a aplicação web;
- `CSS3` — estilização responsiva, layout modular e componentes visuais;
- `JavaScript (ES6+)` — lógica de navegação dinâmica via módulos JS (`import`/`export`) e manipulação do DOM;
- `Bootstrap Icons & Font Awesome` — biblioteca de ícones para navegação e interface;
- `Vercel` — plataforma utilizada para deploy e hospedagem contínua da aplicação.

## 🖥️ Fluxo da aplicação:
1. Carregamento da interface principal com menu lateral retrátil (`sidebar`);
2. Exibição inicial da planilha final consolidada via `iframe` interativo;
3. Seleção dinâmica dos indicadores no menu de navegação sem recarregar a página (SPA concept);
4. Ocultação automática da planilha e renderização do card com a fórmula do indicador selecionado;
5. Atualização simultânea do bloco de código com o script R correspondente àquele indicador;
6. Acesso direto à documentação e ao **Anuário Fiscal 2024**.
