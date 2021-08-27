// importação dos modulos para o desenvolvimento do servidor
const express = require("express");

// Ajuda a receptionar os dados em formato JSON que virão do front para 
// serem manipulados no servidor.
const bodyParser = require("body-parser");

//importar o modulo do mongoose
const mongoose = require("mongoose");


const cors = require("cors");

const config = {
    origin: "*",
    optionsSuccessStatus: 200
}




//url de conexao com o banco de dados
const url = "mongodb+srv://edilsonsilva:Alunos123@clustercliente.gxz3l.mongodb.net/lojadb?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

//vamos criar a estrutura da tabela de produtos
const tbprodutos = mongoose.Schema({
    nomeproduto: String,
    descricao: String,
    preco: String,
    foto: String
});


//vamos criar a estrutura da tabela de contato
const tbcontato = mongoose.Schema({
    nomecliente: String,
    email: String,
    telefone: String,
    assunto: String,
    mensagem: String
});

//Criar efetivamente as 2 tabelas no banco
const Produto = mongoose.model("produto", tbprodutos);

const Contato = mongoose.model("contato", tbcontato);

// Vamos usar o servidor express com app
const app = express();

app.use(cors());

// registrar o uso do bodyParser
app.use(bodyParser.json());

// criação da rota raiz("/") vamos apresentar dados sobre a loja
app.get("/", cors(config), (req, res) => {
    res.status(200).send({
        titulo: "Lojinha Tudo Aqui É Barato",
        texto: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.",
        imagens: [
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            "https://images.unsplash.com/photo-1629299342303-3f3622666c41?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80"
        ]
    });
});


//Vamos fazer um refactor(refatorar), ou seja, modificar
//o código para uma nova execução. É uma atualização do código
//rota para exibir todos produtos cadastrados no banco de dados
app.get("/produtos", cors(config), (req, res) => {
    Produto.find().then((rs) => {
        res.status(200).send({ output: rs })
    });
});

//localizar um produto por seu id
app.get("/produtos/:id", cors(config), (req, res) => {
    Produto.findById(req.params.id).then((rs) => {
        res.status(200).send({ output: rs })
    });
});




//rota para cadastar os produtos
app.post("/produto/cadastro", cors(config), (req, res) => {

    const dados = new Produto(req.body);
    dados.save().then((rs) => {
        res.status(201).send({ output: "Dados cadastrados " + rs })
    }).catch((erro) => res.status(400).send({ output: "Erro na execução " + erro }))

});

//rota para cadastrar o contato do cliente
app.post("/contato", cors(config), (req, res) => {
    const dados = new Contato(req.body);
    dados.save().then((rs) => {
        res.status(201).send({ output: "Dados cadastrados -> " + rs })
    }).catch((erro) => res.status(400).send({ output: "Erro na execução -> " + erro }));
});

//rota para atualizar os dados
app.put("/atualizar/:id", cors(config), (req, res) => {

    Produto.findByIdAndUpdate(req.params.id, req.body, (erro, dados) => {
        if (erro) {
            res.status(400).send({ output: "Erro ao tentar atualizar " + erro });
            return;
        }
        res.status(200).send({ output: "atualizado com sucesso! " + dados });
    });


});

//rota para apagar um produto
app.delete("/apagar/:id", cors(config), (req, res) => {
    Produto.findByIdAndDelete(req.params.id).then((rs) => {
        res.status(200).send({ output: "Produto apagado." });
    });
});


// vamos configurar o servidor para responder na porta 3350
app.listen(3350, () => console.log("Servidor online ... "));