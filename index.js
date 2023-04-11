import express, {query} from 'express';
import dotenv from 'dotenv';
import {
    addUserSubscription,
    checkEmailPassword,
    createNewUser,
    getUserSubscriptions, removeSubscription,
    searchMusic
} from "./DDB/functions.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API call Successful');
});

/**
* Login POST request
*/
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


/**
 * Register POST request
 */
app.post('/api/register', async (req, res) => {
    const {email, user_name, password} = req.body;

    try {
        const result = await createNewUser(email,user_name, password);
        res.status(200).json({result});
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Something went terribly wrong!"})
    }
});


/**
 * User Subscriptions Post request (All)
 */
app.post('/api/subscriptions/:email', async (req, res) => {
    const {email} = req.params;

    try {
        const result = await getUserSubscriptions(email);
        res.status(200).json({result});
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Something went terribly wrong!"})
    }
});


/**
 * Subscriptions POST request
 */
app.post('/api/subscribe/:email/:song', async (req, res) => {
    const {email, song} = req.params;

    try {
        const result = await addUserSubscription(email, song);
        res.status(200).json({result});
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Something went terribly wrong!"})
    }
});


/**
 * Subscription Remove  POST request
 */
app.post('/api/subscription/remove/:email/:song', async (req, res) => {
    const {email, song} = req.params;

    try {
        const result = await removeSubscription(email, song);
        res.status(200).json({result});
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Something went terribly wrong!"})
    }
});

/**
 * Query area data - Get request to search music records
 */
app.get('/api/music/', async (req, res) => {
    const queryParams = req.query;
    if (queryParams.release_year) {
        queryParams.release_year = Number(queryParams.release_year);
    }

    try {
        const result = await searchMusic(queryParams);
        res.status(200).json({result});
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Something went terribly wrong!"})
    }
});


const port = process.env.PORT;
app.listen(port, () => {
    console.log("Listening on port " + port)
});