const express = require("express");

const app = express();
const port = process.env.PORT || 80;

app.get("/", (req, res) => {
	res.send("Aplicacion CI/CD en Kubernetes funcionando");
});

app.get("/lab", (req, res) => {
	res.json({
		mensaje: "Laboratorio 3 - CI/CD en Kubernetes",
		ambiente: process.env.AMBIENTE || "no definido",
		api_key: process.env.API_KEY 
		  ? "API_KEY cargada correctamente" 
		  : "API_KEY no definida"
	});
});

app.listen(port, () => {
	console.log (`Servidor escuchando en puerto ${port}`);
});