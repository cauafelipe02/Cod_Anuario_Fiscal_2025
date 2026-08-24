import { UI } from './UI.js';

function verificarTela() {
    if (window.innerWidth <= 500) {
        UI.aside.classList.add('collapsed');
        UI.logo.style.display = 'none';
        UI.toggleButton.style.visibility = 'visible';
        UI.navbar.style.marginTop = '60px';
        UI.navbar.classList.add('escondido');
    } else {
        UI.aside.classList.remove('collapsed');
        UI.toggleButton.style.visibility = 'hidden';
        UI.logo.style.display = 'flex';
        UI.navbar.style.marginTop = '0';    
        UI.navbar.classList.remove('escondido');
    }
}

export function toggleSidebar() {

    verificarTela();

    window.addEventListener('resize', verificarTela);

    UI.toggleButton.addEventListener('click', () => {
        UI.aside.classList.toggle('collapsed');
        UI.navbar.classList.toggle('escondido');    
    });
}