const express = require('express');
const app = express();
const port = 3000;
const compression = require('compression');
const fs = require('fs').promises;


//acelerar o tempo de transferência
app.use(compression());


// Array de frases motivacionais
const frases = require('./frases.json');

// Função para buscar uma frase aleatória de qualquer categoria
const fraseAleatoriaDeTodas = (frases) => {
  return frases[Math.floor(Math.random() * frases.length)];
};

// Endpoint com parâmetro opcional de categoria assincrona 
app.get('/frase', async (req, res) => {
  const data = await fs.readFile('./frases.json', 'utf8');
  const json = JSON.parse(data);
  const frases = json.frases;
  
  const categoria = req.query.categoria;

  let frasesFiltradas;

  // Se a categoria foi passada, filtra as frases pela categoria
  if (categoria) {
    frasesFiltradas = frases.filter(frase => frase.categoria.toLowerCase() === categoria.toLowerCase());
  } else {
    frasesFiltradas = frases;
  }

  if (frasesFiltradas.length === 0) {
    return res.status(404).json({ erro: "Nenhuma frase encontrada para essa categoria." });
  }

  const fraseAleatoria = fraseAleatoriaDeTodas(frasesFiltradas);
  res.json({ frase: fraseAleatoria });
});

// Servidor rodando
app.listen(port, () => {
  console.log(`API de frases rodando em http://localhost:${port}`);
});


//mantém as conexões abertas entre requisições e nao deixa dar sobrecarga (vai que ne)
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  next();
});
