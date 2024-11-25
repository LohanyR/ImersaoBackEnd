import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts.
export async function listarPosts(req, res) {
    // Obtém todos os posts do banco de dados (ou outra fonte de dados)
    // utilizando a função `getTodosPosts` do modelo de posts.
    const posts = await getTodosPosts();

    // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON.
    res.status(200).json(posts);
}

// Função assíncrona para criar um novo post.
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post enviados no corpo da requisição.
    const novoPost = req.body;

    // Tenta criar o novo post.
    try {
        // Chama a função `criarPost` do modelo de posts para inserir o novo post no banco de dados.
        const postCriado = await criarPost(novoPost);

        // Envia uma resposta HTTP com status 200 (OK) e o post criado no formato JSON.
        res.status(200).json(postCriado);
    } catch (erro) {
        // Caso ocorra algum erro durante a criação do post, imprime a mensagem de erro no console
        // e envia uma resposta HTTP com status 500 (Erro interno do servidor).
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post.
export async function uploadImagem(req, res) {
    // Cria um objeto para representar o novo post, com a descrição vazia inicialmente.
    // A URL da imagem é definida como o nome original do arquivo enviado.
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    // Tenta criar o novo post e salvar a imagem.
    try {
        // Chama a função `criarPost` para inserir o novo post no banco de dados.
        const postCriado = await criarPost(novoPost);

        // Constrói o caminho completo para salvar a imagem, utilizando o ID do post criado.
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;

        // Move a imagem enviada para o caminho definido anteriormente.
        fs.renameSync(req.file.path, imagemAtualizada);

        // Envia uma resposta HTTP com status 200 (OK) e o post criado no formato JSON.
        res.status(200).json(postCriado);
    } catch (erro) {
        // Caso ocorra algum erro durante o processo de upload, imprime a mensagem de erro no console
        // e envia uma resposta HTTP com status 500 (Erro interno do servidor).
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:300/${id}.png`;
   
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);      
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}
