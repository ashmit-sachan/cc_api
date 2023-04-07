import express from 'express';
import dotenv from 'dotenv';
import {checkEmailPassword} from "./DDB/functions.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/api/music/:id', async (req, res) => {
    const {id} = req.params;

    try {
        console.log(req.body);
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Something went terribly wrong!"})
    }
});


app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const result = await checkEmailPassword(email, password);
        res.status(200).json({result});
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Something went terribly wrong!"})
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port " + port)
});