const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// 🔑 TU API KEY AQUÍ
const RAPID_KEY = "TU_API_KEY";
const RAPID_HOST = "api-matriculas-espana.p.rapidapi.com";

// Endpoint propio
app.get("/api/:plate", async (req, res) => {
    const plate = req.params.plate.toUpperCase().replace(/[-\s]/g, "");

    try {
        const response = await fetch(`https://${RAPID_HOST}/matricula/${plate}`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": RAPID_KEY,
                "X-RapidAPI-Host": RAPID_HOST
            }
        });

        if (!response.ok) {
            return res.status(404).json({ error: "MATRÍCULA NO ENCONTRADA" });
        }

        const data = await response.json();
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

app.listen(3000, () => {
    console.log("Servidor funcionando en http://localhost:3000");
});
