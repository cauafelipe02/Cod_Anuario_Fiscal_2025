import { UI } from "./UI.js";

export function voltarInicio() {
    UI.cardPlanilha.classList.remove('escondido');
    UI.tituloCodigo.textContent = 'Arquivo main.R do projeto';
    UI.containerFormula.classList.add('escondido'); // Esconde a div da fórmula

    UI.codigo.textContent = `
    # 1. Carregar todas as bibliotecas necessárias para o projeto

    library(dplyr)
    library(readxl)
    library(readr)
    library(janitor)
    library(tidyr)
    library(openxlsx)

    # Importa as etapas na ordem ----------------------------------------------

    source("cod_indicador_1.R")
    source("cod_indicador_2.R")
    source("cod_indicador_3.R")
    source("cod_indicador_4.R")
    source("cod_indicador_5.R")
    source("cod_indicador_6.R")
    source("cod_indicador_7.R")
    source("cod_indicador_8.R")

    # Exportando para excel ---------------------------------------------------

    # 1. Cria a pasta de trabalho do Excel
    wb <- createWorkbook()
    addWorksheet(wb, "Indicadores_STN_25")
    writeData(wb, "Indicadores_STN_25", base_STN)

    # 2. Estilos para o cabeçalho (Azul escuro com texto branco e negrito)
    estilo_cabecalho <- createStyle(
    fgFill = "#1F4E78", 
    halign = "CENTER", 
    valign = "CENTER",
    textDecoration = "BOLD", 
    fontColour = "#FFFFFF"
    )

    # Colunas 1 a 3 (Cod_ibge, Municipio, RD): Azul Claro Pastel
    estilo_identificacao <- createStyle(
    fgFill = "#DDEBF7",
    halign = "LEFT",
    valign = "CENTER"
    )

    # Colunas 4 a 11 (Indicadores 1 a 8): Amarelo Pastel
    estilo_indicadores <- createStyle(
    fgFill = "#FFF2CC",
    halign = "RIGHT",
    valign = "CENTER"
    )

    # Criando o vetor com os índices das colunas dos indicadores
    colunas_indicadores <- c(6, 8, 11, 15, 18, 21, 24, 26)

    # 3. Aplicação dos Estilos na Planilha

    # Aplica o cabeçalho na Linha 1
    addStyle(wb, "Indicadores_STN_25", style = estilo_cabecalho, rows = 1, cols = 1:ncol(base_STN), gridExpand = TRUE)

    # Aplica o Azul Claro nas colunas 1 a 3 (da linha 2 até o final dos dados)
    addStyle(wb, "Indicadores_STN_25", style = estilo_identificacao, rows = 2:(nrow(base_STN) + 1), cols = 1:3, gridExpand = TRUE)

    # Aplica o Amarelo Pastel + % nas colunas dos indicadores (colunas 4 até o final)
    addStyle(wb, "Indicadores_STN_25", style = estilo_indicadores, rows = 2:(nrow(base_STN) + 1), cols = colunas_indicadores, gridExpand = TRUE)

    # 5. Salvar o arquivo final
    saveWorkbook(wb, "indicadores_fiscais_2025.xlsx", overwrite = TRUE)
    `;
}