import { 
    indicador1,
    indicador2,
    indicador3,
    indicador4,
    indicador5,
    indicador6,
    indicador7,
    indicador8
 } from "./indicadores.js";
import { voltarInicio } from "./pagInicial.js";
import { toggleSidebar } from "./aside.js";

window.mudarPagina = (tipo) => {
    const cenas = {
        inicio: voltarInicio,
        indice1: indicador1,
        indice2: indicador2,
        indice3: indicador3,
        indice4: indicador4,
        indice5: indicador5,
        indice6: indicador6,
        indice7: indicador7,
        indice8: indicador8,
        esconder: toggleSidebar
    };
    if(cenas[tipo]) {
        cenas[tipo]();
    } else {
        console.error(`A cena ${tipo} não foi definida.`)
    }
}

// Inicializa o comportamento
toggleSidebar();