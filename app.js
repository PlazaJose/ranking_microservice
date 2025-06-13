const express = require('express');
const db = require('./db');
const app = express();
const port = 5106;

// Middleware to parse JSON
app.use(express.json());

async function consult_user_rank(id_player) {
    const sql_player_mmr = "SELECT * FROM usuarios WHERE id_usuario = ?";
    const sql="SELECT COUNT(*) + 1 AS position FROM usuarios WHERE mmr > ?";
    try{
        const [results] = await
        db.promise().execute(sql_player_mmr, [id_player]);
    
        if (results.length === 0) {
            return {result_code:1, data:"jugador no encontrado!"};
        }
        const mmr = results[0].mmr;
        const name = results[0].nombre;
        const [position_results] = await
        db.promise().execute(sql, [mmr]);
        if (results.length === 0) {
            return {result_code:2, data:"position no encontrada"};
        }
        const position = position_results[0].position;
        return {result_code:0, data:{name: name, mmr: mmr, position: position}}

    }catch(errt){
        console.log("error: ", errt);
        return {result_code:-1, data: errt};
    }
}

async function consult_top_ranking(size) {
    const sql = "SELECT id_usuario, nombre, mmr FROM usuarios ORDER BY mmr DESC LIMIT ?";
    try {
        const [results] = await
        db.promise().execute(sql, [size]);
    
        if (results.length === 0) {
            return {result_code:1, data:"jugadores no encontrados!"};
        }
        const top = JSON.stringify(results, null, 2);
        return {result_code : 0, data: results};
    } catch (error) {
        return {result_code:-1, data:error};
    }
}

async function update_mmr(id_player, points) {
    const sql = "UPDATE usuarios SET mmr = mmr + ? WHERE id_usuario = ?";
    try {
        const [results] = await
        db.promise().execute(sql, [points, id_player]);

        if (results.affectedRows === 0){
            return {result_code:1, data: "jugador no encontrado"};
        }
        const new_mmr = await consult_user_rank(id_player);
        return {result_code:0, data:new_mmr};
    } catch (error) {
        return {result_code:-1, data: error};
    }
}

app.get("/ranking/player/:id_player", async(req, res)=>{
    const {id_player} = req.params;
    const result_consulta = await consult_user_rank(id_player);
    switch(result_consulta.result_code){
        case 0:
            return res.json({ result: true, data: result_consulta.data});
        default:
            return res.json({ result: false, data: result_consulta.data});
        
    }
});
app.get("/ranking/top/:size", async(req, res)=>{
    const {size} = req.params;
    const result_consulta = await consult_top_ranking(size);
    switch(result_consulta.result_code){
        case 0:
            return res.json({ result: true, data: result_consulta.data});
        default:
            return res.json({ result: false, data: result_consulta.data});
        
    }
});

app.post("/ranking/add",async (req, res)=>{
    const {id, points} = req.body;
    if(!id || !points){
        console.log("faltan datos");
        return res.status(500).json({ entrada: false, estado: 'faltan datos' });
    }
    const result_consulta = await update_mmr(id, points);
    
    switch(result_consulta.result_code){
        case 0:
            return res.json({ result: true, data: result_consulta.data});
        default:
            return res.json({ result: false, data: result_consulta.data});
        
    }

});

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Ranking Microservice</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #007bff; }
            </style>
        </head>
        <body>
            <h1>Welcome to the Ranking Microservice 🚀</h1>
            <p>Use the API endpoints to retrieve ranking data.</p>
            <p>Try: <code>/ranking/player/:id_player</code> or <code>/ranking/top/:size</code></p>
        </body>
        </html>
    `);
});

//module.exports = app;


app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
});