// VARIÁVEIS GLOBAIS
const nomeUsuario = {}
let lista = [];
let participantesOnline = [];
let entrando = 0;
let usuarioSelecionado = "Todos";
let privacidadeSelecionada = "Público";
let atualizaUsuarios = 0;

// IMPLEMENTANDO O ENTER PARA ENVIAR INPUT
document.querySelector(".pagina-entrada input").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector(".pagina-entrada button").click();
    }
});
document.querySelector(".pagina .rodape input").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".pagina .rodape ion-icon").click();
    }
});


// BOTÃO ENTRADA NO BATE-PAPO
function entrarBatePapo() {
    const recebeInput = document.querySelector("input").value;
    nomeUsuario.name = recebeInput;

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario);

    document.querySelector("button").insertAdjacentHTML("afterend", `<img class='entrando gato' src='/Projeto_05_batePapoUOL/Assets/imagens/carregato.gif' alt='mais gato'>`);

    requisicao.then(usuarioRegistrado);
    requisicao.catch(falhaLogin);

}

// FUNÇÃO SE FOR POSSÍVEL ENTRAR NO BATE-PAPO COM O NOME ESCOLHIDO
function usuarioRegistrado (resposta) {

    if(document.querySelector(".erro")) {
        document.querySelector(".erro").remove();
    }

    //Atualiza os usuários online ao entrar na página, uma única vez
    const listaInicial = setTimeout(function() {
        const participantes = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
        participantes.then(participantesAtivos);
    },500)

    return conexaoEstavel();
}

// FUNÇÃO SE NÃO FOR POSSÍVEL ENTRAR NO BATE-PAPO COM O NOME ESCOLHIDO
function falhaLogin (erro) {
    console.log(erro.response.data);
    console.log(erro.response.status);

    if(document.querySelector(".erro")) {
        document.querySelector(".erro").remove();
    }

    document.querySelector(".gato").remove();

    document.querySelector("button").insertAdjacentHTML("afterend", `<img class='erro' src='https://http.cat/${erro.response.status}' alt='Gatos por toda parte ♥'>`);
    alert(`ERRO DETECTADO\nVocê não poderá entrar com o nome escolhido, selecione outro!`);
}

// FUNÇÃO QUE MANTEM A CONEXÃO, PARTICIPANTES E MENSAGENS ATUALIZADAS
function conexaoEstavel() {

    //Manter conexão API - Status
    const conexaoStatus = setInterval(function() {
        const online = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeUsuario);
    },5000);

    //Manter usuários atualizados API - Participants
    const participantesConectados = setInterval(function() {
        const participantes = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
        participantes.then(participantesAtivos);
    },10000);

    //Manter Chat Vivo API - Messages
    const mensagensAtualizadas = setInterval(function(){
        const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
        promisse.then(carregarMensagens);
    },3000);
}

// Função que carrega e recarrega as mensagens no site
function carregarMensagens(el) {
    lista = el.data;
    const area = document.querySelector(".area-mensagens");
    area.innerHTML = "";

    for (let i = 0; i < lista.length; i++) {
        
        if(lista[i].type === "status") {
            area.innerHTML += `<div class='mensagem aviso'><p><em class='hora'>${lista[i].time}</em> <em class='chat-usuarios'><strong>${lista[i].from}</strong></em>${lista[i].text}</p></div>`;
        } else if (lista[i].type === "message") {
            area.innerHTML += `<div class='mensagem'><p><em class='hora'>${lista[i].time}</em> <em class='chat-usuarios'><strong>${lista[i].from}</strong> para <strong>${lista[i].to}</strong>:</em>${lista[i].text}</p></div>`;
        } else if (lista[i].type === "private_message" && (lista[i].to === nomeUsuario.name || lista[i].to === "Todos" || lista[i].from === nomeUsuario.name)) {
            area.innerHTML += `<div class='mensagem privado'><p><em class='hora'>${lista[i].time}</em> <em class='chat-usuarios'><strong>${lista[i].from}</strong> reservadamente para <strong>${lista[i].to}</strong>:</em>${lista[i].text}</p></div>`;
        }
    }
    // Quando a página é iniciada pela primeira vez, muda o layout
    if(entrando === 0) {
        document.querySelector(".pagina-entrada").classList.add("escondido");
        document.querySelector(".pagina").classList.remove("escondido");
        entrando = 1;
    }

    area.scrollIntoView(false)
}

// Atualiza os participantes ativos na pagina
function participantesAtivos(el) {

    participantesOnline = el.data;
    const contatosAtivos = document.querySelector(".contato-ativo");
    contatosAtivos.innerHTML = "";
    for(let i = 0; i < participantesOnline.length; i++) {
        if(usuarioSelecionado === participantesOnline[i].name) {
            contatosAtivos.innerHTML += `
        <div class="usuario">
            <span onclick="selecionarUsuario(this)">
                <ion-icon name="person-circle"></ion-icon>
                <p>${participantesOnline[i].name}</p>
            </span>
            <ion-icon class="check" name="checkmark-sharp"></ion-icon>
        </div>
        `;
        atualizaUsuarios = 1;
        } else {
        contatosAtivos.innerHTML += `
        <div class="usuario">
            <span onclick="selecionarUsuario(this)">
                <ion-icon name="person-circle"></ion-icon>
                <p>${participantesOnline[i].name}</p>
            </span>
            <ion-icon class="escondido" name="checkmark-sharp"></ion-icon>
        </div>
        `;
        }
    }
    if(atualizaUsuarios === 0) {
        document.querySelector(".contato-todos").lastElementChild.classList.add("check");
        document.querySelector(".contato-todos").lastElementChild.classList.remove("escondido");
        usuarioSelecionado = "Todos";
    }
    atualizaUsuarios = 0;
}

function selecionarUsuario(el) {
    if(el.innerText === usuarioSelecionado) {
        console.log("mesmuzuario, nada acontece");
        return;        
    }

    // if(atualizaUsuarios === 1) {
    //     console.log("tesntando manter check")
    //     if(document.querySelector(`.${usuarioSelecionado}`)) {
    //         console.log("dentro do if")
    //         console.log(usuarioSelecionado + " usuario previamente escolhido")
    //         document.querySelector(`.${usuarioSelecionado}`).nextElementSibling.add("check");
    //         document.querySelector(`.${usuarioSelecionado}`).nextElementSibling.remove("escondido");
    //     } else {
    //         console.log("dentro do else")
    //         document.querySelector(".contato-todos").lastElementChild.classList.add("check")
    //         document.querySelector(".contato-todos").lastElementChild.classList.remove("escondido")
    //     }
    //     atualizaUsuarios = 0;
    //     return;
    // }


    document.querySelector(".escolha-contato").querySelector(".check").classList.add("escondido");
    document.querySelector(".escolha-contato").querySelector(".check").classList.remove("check");
    el.nextElementSibling.classList.add("check");
    el.nextElementSibling.classList.remove("escondido");
    usuarioSelecionado = el.innerText;
    console.log(usuarioSelecionado + " usuario que eu selecionei;")

}

//FUNÇÃO QUE SELECIONA A PRIVACIDADE DA CONVERSA
function selecionarVisibilidade(el) {
    if(el.innerText === privacidadeSelecionada) {
        return;
    }
    document.querySelector(".escolha-visibilidade").querySelector(".check").classList.add("escondido");
    document.querySelector(".escolha-visibilidade").querySelector(".check").classList.remove("check");
    el.nextElementSibling.classList.add("check");
    el.nextElementSibling.classList.remove("escondido");
    privacidadeSelecionada = el.innerText;
}

// FUNÇÃO QUE ENVIA MENSAGEM
function enviarMensagem() {
    const input = document.querySelector(".pagina").querySelector("input");
    let mensagem = {};

    if(privacidadeSelecionada === "Público") {
        mensagem = 
        {
            "from": nomeUsuario.name,
            "to": usuarioSelecionado,
            "text": input.value,
            "type": "message"
        };
    }
    
    if(privacidadeSelecionada === "Reservadamente") {
        mensagem = 
        {
            "from": nomeUsuario.name,
            "to": usuarioSelecionado,
            "text": input.value,
            "type": "private_message"
        };
    }

    input.value="";
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
}

// FUNÇÃO QUE ABRE E FECHA O MENU LATERAL
function menuLateral() {
    const menu = document.querySelector(".menu-lateral");
    const fundo = document.querySelector(".fundo");
    if(menu.classList.contains("escondido")) {
        menu.classList.remove("escondido");
        fundo.classList.remove("escondido");
        return;
    }
    menu.classList.add("escondido");
    fundo.classList.add("escondido");
}