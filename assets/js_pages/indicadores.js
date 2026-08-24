import {UI} from './UI.js';

export function indicador1() {
    UI.cardPlanilha.classList.add('escondido')
    UI.containerFormula.classList.remove('escondido'); // Mostra a div da fórmula
    UI.tituloCodigo.textContent = 'Arquivo cod_indice_1.R do projeto';
    UI.containerFormula.innerHTML = `
        <article class= "card">
            <header class="card-header">
                    <h2>Fórmula de cálculo: Indicador 1</h2>
                </header>
            <img src="./assets/img/formula_indicadores/formula_1.png" alt="Indicador 1" class="card-img-top">
        </article>
    `;

    UI.codigo.textContent = `
    # Captura de dados --------------------------------------------------------

    base_dados1 <- read_excel("Chaves_municipios - nomes, RD, codigo IBGE.xls")
    rgf1 <- read.csv("25.RGF.csv")

    # Limpeza das bases de dados ----------------------------------------------

    base_limpa1 <- base_dados1 |> 
    clean_names()

    base_limpa1 <- base_limpa1 |> 
    rename(
        Cod_ibge = codigo_municipio_completo_ibge,
        Municipio = nome_municipio,
        RD = numero_rd_pe
    ) |> 
    select(
        Cod_ibge,
        Municipio,
        RD
    ) |> 
    filter(
        Cod_ibge != "2605459"
    ) |> 
    mutate(Cod_ibge = as.character(Cod_ibge))

    # Filtragem do RGF --------------------------------------------------------

    rgf1_limpo <- rgf1 |> 
    filter(
        cod_conta %in% c("DividaConsolidada", "ReceitaCorrenteLiquidaLimiteLegal"), #Seleciona as 2 contas necessárias
        stringr::str_detect(anexo, "RGF")
    ) |> 
    group_by(cod_ibge, cod_conta) |> 
    mutate(
        prioridade = case_when(     #Adiciona uma prioridade onde se não houver Q3 ele pega o S2
        periodicidade == "Q" & periodo == 3 ~ 1, #Prioriza o Q(quadrimestral 3)
        periodicidade == "S" & periodo == 2 ~ 2, #Se não houver pega o Semestral 2
        periodicidade == "Q" & periodo == 2 ~ 3, #Se não houver Q3 pega o Q2
        TRUE ~ 99
        )
    ) |> 
    slice_min(order_by = prioridade, n = 1, with_ties = FALSE) |> #Reduz pegando o menor número (maior prioridade)
    ungroup() |> 
    select(cod_ibge, cod_conta, valor) |> #Seleciona os campos que eu preciso
    pivot_wider(   #Separa as colunas de Divida e Receita                        
        names_from = cod_conta,   #Seleciona a coluna que possui os dois valores (Divida e Receita)
        values_from = valor       #Separa pelo seu valor
    ) |>  
    #Cria a coluna endividamento fazendo a divisão das duas colunas
    mutate(
        cod_ibge = as.character(cod_ibge),
        endividamento = DividaConsolidada / ReceitaCorrenteLiquidaLimiteLegal
    ) |> 
    rename(Cod_ibge = cod_ibge)

    # Junção da base final + tabela de endividamento --------------------------------

    #Faz a junção
    base_STN <- left_join(base_limpa1, rgf1_limpo, by = "Cod_ibge") |> 
    rename(
        Divida_consolidada = DividaConsolidada, 
        Receita_corrente_liquida = ReceitaCorrenteLiquidaLimiteLegal,
        indicador_1 = endividamento
        )
    `;
}

export function indicador2() {
    UI.cardPlanilha.classList.add('escondido')
    UI.tituloCodigo.textContent = 'Arquivo cod_indice_2.R do projeto';
    UI.containerFormula.classList.remove('escondido');
    UI.containerFormula.innerHTML = `
        <article class= "card">
            <header class="card-header">
                    <h2>Fórmula de cálculo: Indicador 2</h2>
                </header>
            <img src="./assets/img/formula_indicadores/formula_2.png" alt="Indicador 2" class="card-img-top">
        </article>
    `;

    UI.codigo.textContent = `
    # Capturando dados --------------------------------------------------------

    dca1 <- read.csv("25.DCA.csv")

    # Limpeza dos dados -------------------------------------------------------

    dca1_limpo <- dca1 |> 
    filter(
        anexo == "DCA-Anexo I-D",
        cod_conta == "DO3.1.00.00.00.00",
        coluna == "Despesas Empenhadas"  # <- Filtro essencial 
    ) |>
    select(
        Cod_ibge = cod_ibge,
        Despesa_bruta = valor
    ) |> 
    mutate(Cod_ibge = as.character(Cod_ibge))

    # Calculo indice 2 e junção das tabelas -----------------------------------
    base_STN <- base_STN |> 
    left_join(dca1_limpo, by = "Cod_ibge") |> 
    mutate(
        indicador_2 = Despesa_bruta/Receita_corrente_liquida
    )
        `;
}

export function indicador3() {
    UI.cardPlanilha.classList.add('escondido')
    UI.tituloCodigo.textContent = 'Arquivo cod_indice_3.R do projeto';
    UI.containerFormula.classList.remove('escondido');
    UI.containerFormula.innerHTML = `
        <article class= "card">
            <header class="card-header">
                    <h2>Fórmula de cálculo: Indicador 3</h2>
                </header>
            <img src="./assets/img/formula_indicadores/formula_3.png" alt="Indicador 3" class="card-img-top">
        </article>
    `;

    UI.codigo.textContent = `
    # Capturando e limpando dados --------------------------------------------------

    dca2 <- dca1 |> 
    filter(
        anexo == "DCA-Anexo I-D",
        coluna == "Despesas Empenhadas",
        cod_conta %in% c("DO3.2.00.00.00.00","DO4.6.00.00.00.00")
    ) |>
    select(
        Cod_ibge = cod_ibge,
        cod_conta,
        valor
    ) |> 
    pivot_wider(
        names_from = cod_conta,
        values_from = valor,
        values_fill = 0 # <- Transforma valores NA em 0
    ) |> 
    rename(
        Juros_encargo_divida = DO3.2.00.00.00.00,
        Amortizacao_divida = DO4.6.00.00.00.00
    ) |> 
    mutate(
        servico_da_divida = Juros_encargo_divida + Amortizacao_divida,
        Cod_ibge = as.character(Cod_ibge)
    )
    # Junção das tabelas + indicador 3 ----------------------------------------

    base_STN <- base_STN |> 
    left_join(dca2, by = "Cod_ibge") |> 
        mutate(
        indicador_3 = servico_da_divida/Receita_corrente_liquida
        )

    `;
}

export function indicador4() {
    UI.cardPlanilha.classList.add('escondido')
    UI.tituloCodigo.textContent = 'Arquivo cod_indice_4.R do projeto';
    UI.containerFormula.classList.remove('escondido');
    UI.containerFormula.innerHTML = `
        <article class= "card">
            <header class="card-header">
                    <h2>Fórmula de cálculo: Indicador 4</h2>
                </header>
            <img src="./assets/img/formula_indicadores/formula_4.png" alt="Indicador 4" class="card-img-top">
        </article>
    `;

    UI.codigo.textContent = `
    # Captura e Limpeza dos dados ---------------------------------------------

    dca3 <- dca1 |> 
    filter(
        anexo == "DCA-Anexo I-C",
        coluna == "Receitas Brutas Realizadas",
        cod_conta %in% c(
        "ReceitasExcetoIntraOrcamentarias", 
        "RO1.7.0.0.00.0.0", 
        "RO2.4.0.0.00.0.0")
    ) |> 
    select(
        Cod_ibge = cod_ibge,
        cod_conta,
        valor
    ) |> 
    pivot_wider(
        names_from = cod_conta,
        values_from = valor,
        values_fill = 0
    ) |> 
    rename(
        Receitas_totais = ReceitasExcetoIntraOrcamentarias,
        Transferencias_correntes = RO1.7.0.0.00.0.0,
        Transferencias_capital = RO2.4.0.0.00.0.0
    ) |> 
    mutate(
        Arrecadacao_propria = Receitas_totais - Transferencias_correntes -Transferencias_capital,
        Cod_ibge = as.character(Cod_ibge)
    )

    # Junção das tabelas + indice 4 -------------------------------------------

    base_STN <- base_STN |> 
    left_join(dca3, by = "Cod_ibge") |> 
    mutate(indicador_4 = Arrecadacao_propria/Receitas_totais) |> 
    select(-Arrecadacao_propria)
    `;
}

export function indicador5() {
    UI.cardPlanilha.classList.add('escondido')
    UI.tituloCodigo.textContent = 'Arquivo cod_indice_5.R do projeto';
    UI.containerFormula.classList.remove('escondido');
    UI.containerFormula.innerHTML = `
        <article class= "card">
            <header class="card-header">
                    <h2>Fórmula de cálculo: Indicador 5</h2>
                </header>
            <img src="./assets/img/formula_indicadores/formula_5.png" alt="Indicador 5" class="card-img-top">
        </article>
    `;

    UI.codigo.textContent = `
    # Capturando e limpando dados ---------------------------------------------

    dca4 <- dca1 |> 
    filter(
        anexo %in% c("DCA-Anexo I-D", "DCA-Anexo I-C"),
        coluna %in% c("Despesas Empenhadas", "Receitas Brutas Realizadas"),
        cod_conta %in% c("DO4.4.00.00.00.00", "RO2.1.0.0.00.0.0")
    ) |> 
    select(
        Cod_ibge = cod_ibge,
        cod_conta,
        valor
    ) |> 
    pivot_wider(
        names_from = cod_conta,
        values_from = valor,
        values_fill = 0
    ) |> 
    rename(
        Investimentos = DO4.4.00.00.00.00,
        Op_credito = RO2.1.0.0.00.0.0
    ) |> 
    mutate(Cod_ibge = as.character(Cod_ibge))

    # Junção das Tabelas + indicador 5 ----------------------------------------

    base_STN <- base_STN |> 
    left_join(dca4, by = "Cod_ibge") |> 
    mutate(indicador_5 = (Investimentos - Transferencias_capital - Op_credito)/Investimentos)

    `;
}

export function indicador6() {
    UI.cardPlanilha.classList.add('escondido')
    UI.tituloCodigo.textContent = 'Arquivo cod_indice_6.R do projeto';
    UI.containerFormula.classList.remove('escondido');
    UI.containerFormula.innerHTML = `
        <article class= "card">
            <header class="card-header">
                    <h2>Fórmula de cálculo: Indicador 6</h2>
                </header>
            <img src="./assets/img/formula_indicadores/formula_6.png" alt="Indicador 6" class="card-img-top">
        </article>
    `;

    UI.codigo.textContent = `
    # Capturando e limpando dados ---------------------------------------------

    dca5 <- dca1 |> 
    filter(
        anexo == "DCA-Anexo I-D",
        coluna == "Despesas Empenhadas",
        cod_conta == "TotalDespesas"
    ) |> 
    select(
        Cod_ibge = cod_ibge,
        Total_despesas = valor
    ) |>
    mutate(Cod_ibge = as.character(Cod_ibge))

    # Junção das tabelas + indicador ------------------------------------------

    base_STN <- base_STN |> 
    left_join(dca5, by = "Cod_ibge") |> 
    mutate(
        Despesas_de_custeio = Despesa_bruta + servico_da_divida,
        indicador_6 = Despesas_de_custeio/Total_despesas
    ) |>
    relocate(Despesas_de_custeio, .after = indicador_5) |> 
    select(-servico_da_divida)
    `;
}

export function indicador7() {
    UI.cardPlanilha.classList.add('escondido')
    UI.tituloCodigo.textContent = 'Arquivo cod_indice_7.R do projeto';
    UI.containerFormula.classList.remove('escondido');
    UI.containerFormula.innerHTML = `
        <article class= "card">
            <header class="card-header">
                    <h2>Fórmula de cálculo: Indicador 7</h2>
                </header>
            <img src="./assets/img/formula_indicadores/formula_7.png" alt="Indicador 7" class="card-img-top">
        </article>
    `;

    UI.codigo.textContent = `
    # Capturando e Limpando dados ---------------------------------------------

    dca6 <- dca1 |> 
    filter(
        anexo == "DCA-Anexo I-C",
        coluna == "Receitas Brutas Realizadas",
        cod_conta %in% c("RO1.7.1.0.00.0.0", "RO1.0.0.0.00.0.0")
    ) |> 
    select(
        Cod_ibge = cod_ibge,
        cod_conta,
        valor
    ) |> 
    pivot_wider(
        names_from = cod_conta,
        values_from = valor,
        values_fill = 0
    ) |> 
    mutate(Cod_ibge = as.character(Cod_ibge)) |> 
    rename(
        Transferencias_da_uniao = RO1.7.1.0.00.0.0,
        Receitas_correntes_dca = RO1.0.0.0.00.0.0
    )

    # Junção das tabelas + indice ---------------------------------------------

    base_STN <- base_STN |> 
    left_join(dca6, by = "Cod_ibge") |> 
    mutate(indicador_7 = Transferencias_da_uniao/Receitas_correntes_dca)
    `;
}

export function indicador8() {
    UI.cardPlanilha.classList.add('escondido')
    UI.tituloCodigo.textContent = 'Arquivo cod_indice_8.R do projeto';
    UI.containerFormula.classList.remove('escondido');
    UI.containerFormula.innerHTML = `
        <article class= "card">
            <header class="card-header">
                    <h2>Fórmula de cálculo: Indicador 8</h2>
                </header>
            <img src="./assets/img/formula_indicadores/formula_8.png" alt="Indicador 8" class="card-img-top">
        </article>
    `;

    UI.codigo.textContent = `
    # Captura e limpeza dos dados ---------------------------------------------

    dca7 <- dca1 |> 
    filter(
        anexo == "DCA-Anexo I-C",
        coluna == "Receitas Brutas Realizadas",
        cod_conta == "RO1.7.2.0.00.0.0"
    ) |> 
    select(Cod_ibge = cod_ibge, Transferencias_correntes_estado = valor) |> 
    mutate(Cod_ibge = as.character(Cod_ibge))

    # Junção das tabelas + indicador ------------------------------------------

    base_STN <- base_STN |> 
    left_join(dca7, by = "Cod_ibge") |> 
    mutate(indicador_8 = Transferencias_correntes_estado/Receitas_correntes_dca)
    `;
}