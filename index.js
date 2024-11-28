import express from "express";
import { buscarInf, buscarInfPorId, buscarInfPorAno, calcularReajuste } from "./serviços/serviços.js";

const app = express();

app.get('/historicoIPCA', (req, res) => {
    const anoInf = req.query.ano;
    const resultado = anoInf ? buscarInfPorAno(anoInf) : buscarInf();
    if (resultado.length > 0) {
        res.json(resultado);
    } else {
        res.status(404).send({ "erro": "Nenhum registro encontrado" });
    }
});

app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor);
    const primeiroMes = parseInt(req.query.primeiroMes);
    const primeiroAno = parseInt(req.query.primeiroAno);
    const ultimoMes = parseInt(req.query.ultimoMes);
    const ultimoAno = parseInt(req.query.ultimoAno);

    if (isNaN(valor) || isNaN(primeiroMes) || isNaN(primeiroAno) || isNaN(primeiroAno) || isNaN(ultimoAno)) {
        return res.status(400).json({ error: "Todos os parâmetros (valor, primeiroMes, primeiroAno, primeiroAno, ultimoAno) são obrigatórios e devem ser válidos." });
    }

    if (primeiroAno >  ultimoAno || (primeiroAno === ultimoAno && ultimoAno >  ultimoMes)) {
        return res.status(400).json({ error: "O mês/ano primeiro deve ser menor ou igual ao mês/ano ultimo." });
    }

    try {
        const resultado = calcularReajuste(valor, primeiroMes, primeiroAno, ultimoMes, ultimoAno);
        res.json({ valorReajustado: resultado.toFixed(2) });
    } catch (error) {
        res.status(500).json({ "erro": "Erro ao calcular o reajuste." });
    }
});

app.get('/historicoIPCA/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send({ "erro": "Requisição inválida, o ID deve ser numérico" });
    }

    const inf = buscarInfPorId(id);

    if (inf) {
        res.json(inf);
    } else {
        res.status(404).send({ "erro": "ID não encontrado" });
    }
});

app.listen(8080, () => {
    console.log('Servidor iniciado na porta 8080');
});
