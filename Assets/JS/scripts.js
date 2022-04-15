// VARIÁVEIS GLOBAIS
let nomeUsuario = 
{
    name: ""
};
let lista = [];


// BOTÃO ENTRADA NO BATE-PAPO
function entrarBatePapo() {
    nomeUsuario.name = document.querySelector("input").value;
    
    const requisicao = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants',nomeUsuario);

    requisicao.then(usuarioRegistrado);
    requisicao.catch(falhaLogin);

}

// FUNÇÃO SE FOR POSSÍVEL ENTRAR NO BATE-PAPO COM O NOME ESCOLHIDO
function usuarioRegistrado (resposta) {

    if(document.querySelector(".erro")) {
        document.querySelector(".erro").remove();
    }

    entrandoNaPagina();



    return setInterval(estouOnline, 5000);
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

// FUNÇÃO DE MANTER CONEXÃO DO USUÁRIO
function estouOnline () {
    console.log("executei -ESTOU ONLINE-");
    console.log(nomeUsuario);
    nomeUsuario = axios.post("https://mock-api.driven.com.br/api/v6/uol/status");
}

function entrandoNaPagina () {

    document.querySelector("button").insertAdjacentHTML("afterend", `<img class='entrando' src='/Projeto_05_batePapoUOL/Assets/imagens/carregato.gif' alt='mais gato'>`);

    // setTimeout(() => {
    //     document.querySelector(".pagina-entrada").classList.add("escondido");
    //     document.querySelector(".pagina").classList.remove("escondido");
    // },3000);

    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promisse.then(abrirPagina);
    promisse.catch(falhaLogin);
}

function abrirPagina(el) {

    lista = el;
    for (let i = 0; i < lista.data.length; i++) {

        const area = document.querySelector(".area-mensagens");
       
        if(lista.data[i].type === "status") {
            area.innerHTML += `<div class='mensagem aviso'><p><em class='hora'>${lista.data[i].time}</em> <em class='chat-usuarios'><strong>${lista.data[i].from}</strong></em>${lista.data[i].text}</p></div>`;
        } else if (lista.data[i].type === "message") {
            area.innerHTML += `<div class='mensagem'><p><em class='hora'>${lista.data[i].time}</em> <em class='chat-usuarios'><strong>${lista.data[i].from}</strong> para <strong>${lista.data[i].to}</strong>:</em>${lista.data[i].text}</p></div>`;
        } else if (lista.data[i].type === "private_message") {
            area.innerHTML += `<div class='mensagem'><p><em class='hora'>${lista.data[i].time}</em> <em class='chat-usuarios'><strong>${lista.data[i].from}</strong> para <strong>${lista.data[i].to}</strong>:</em>${lista.data[i].text}</p></div>`;
        }
    }

    

    document.querySelector(".pagina-entrada").classList.add("escondido");
    document.querySelector(".pagina").classList.remove("escondido");
    document.querySelector(".area-mensagens").lastElementChild.scrollIntoView();

    return setInterval(carregarMensagens,3000);
}

function carregarMensagens() {
    
    document.querySelector(".area-mensagens").lastElementChild.scrollIntoView();

    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promisse.then(novasMensagens);
    promisse.catch(falhaLogin);

    document.querySelector(".area-mensagens").lastElementChild.scrollIntoView();
}

function novasMensagens(el) {

    const novaLista = el;

    if(lista.data === novaLista.data) {
        console.log("é igual")
    } else {
        console.log("é diferente")
    }

    for(let i = 0; i < lista.data.length; i++) {
        for(let j = 0; j < novaLista.data.length; j++) {
            
            if(lista.data[i].indexOf(novaLista.data[j]) !== -1) {
                if(novaLista.data[j].type === "status") {
                    area.innerHTML += `<div class='mensagem aviso'><p><em class='hora'>${novaLista.data[j].time}</em> <em class='chat-usuarios'><strong>${novaLista.data[j].from}</strong></em>${novaLista.data[j].text}</p></div>`;
                } else if (novaLista.data[j].type === "message") {
                    area.innerHTML += `<div class='mensagem'><p><em class='hora'>${novaLista.data[j].time}</em> <em class='chat-usuarios'><strong>${novaLista.data[j].from}</strong> para <strong>${novaLista.data[j].to}</strong>:</em>${novaLista.data[j].text}</p></div>`;
                } else if (novaLista.data[j].type === "private_message") {
                    area.innerHTML += `<div class='mensagem'><p><em class='hora'>${novaLista.data[j].time}</em> <em class='chat-usuarios'><strong>${novaLista.data[j].from}</strong> para <strong>${novaLista.data[j].to}</strong>:</em>${novaLista.data[j].text}</p></div>`;
                }
            }
        }
    }
}