// VARIÁVEIS GLOBAIS
const nomeUsuario = {}
let lista = [];
let novaLista = [];
let entrando = 0;

// BOTÃO ENTRADA NO BATE-PAPO
function entrarBatePapo() {
    const recebeInput = document.querySelector("input").value;
    nomeUsuario.name = recebeInput;

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario);

    requisicao.then(usuarioRegistrado);
    requisicao.catch(falhaLogin);

}

// FUNÇÃO SE FOR POSSÍVEL ENTRAR NO BATE-PAPO COM O NOME ESCOLHIDO
function usuarioRegistrado (resposta) {

    if(document.querySelector(".erro")) {
        document.querySelector(".erro").remove();
    }

    // console.log(nomeUsuario.name)
    // let usuario = 
    // {
    //     "from": nomeUsuario.name,
    //     "to": "Todos",
    //     "text": "entrou na sala...",
    //     "type": "status"
    // }
    
    // const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', usuario);

    // promisse.then(entrandoNaPagina)
    // promisse.catch(falhaLogin)

    document.querySelector("button").insertAdjacentHTML("afterend", `<img class='entrando' src='/Projeto_05_batePapoUOL/Assets/imagens/carregato.gif' alt='mais gato'>`);

    return conexaoEstavel();
}

// FUNÇÃO SE NÃO FOR POSSÍVEL ENTRAR NO BATE-PAPO COM O NOME ESCOLHIDO
function falhaLogin (erro) {
    console.log(erro.response.data);
    console.log(erro.response.status);

    if(document.querySelector(".erro")) {
        document.querySelector(".erro").remove();
    }

    document.querySelector("button").insertAdjacentHTML("afterend", `<img class='erro' src='https://http.cat/${erro.response.status}' alt='Gatos por toda parte ♥'>`);
    alert(`ERRO DETECTADO\nVocê não poderá entrar com o nome escolhido, selecione outro!`);
}

// // FUNÇÃO DE MANTER CONEXÃO DO USUÁRIO
// function estouOnline () {

//     const online = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeUsuario);
// }

function conexaoEstavel() {

    //Manter conexão API - Status - FUNCIONANDO
    const conexaoStatus = setInterval(function() {
        const online = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeUsuario);
    },5000);

    //Manter usuários atualizados API - Participants
    const participantesConectados = setInterval(function() {

    },10000)

    //Manter Chat Vivo API - Messages
    const mensagensAtualizadas = setInterval(function(){
        const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
        promisse.then(carregarMensagens);
    },3000)
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
        } else if (lista[i].type === "private_message") {
            area.innerHTML += `<div class='mensagem'><p><em class='hora'>${lista[i].time}</em> <em class='chat-usuarios'><strong>${lista[i].from}</strong> para <strong>${lista[i].to}</strong>:</em>${lista[i].text}</p></div>`;
        }
    }
    if(entrando === 0) {
        document.querySelector(".pagina-entrada").classList.add("escondido");
        document.querySelector(".pagina").classList.remove("escondido");
        entrando = 1;
    }

    area.scrollIntoView(false)
}


function participantesAtivos(el) {

}


function enviarMensagem() {
    document.querySelector(".")
}