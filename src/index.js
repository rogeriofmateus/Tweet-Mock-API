import { createTableTweet, getTweet, getTopTweets, insertTweet, deleteTweet } from './Controller/tweet.js';
import express from 'express';

const app = express();
app.use(express.json());
const port = 3000;

createTableTweet();

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port} !`));

app.post('/api/tweets', (req, res) => {
    const { message } = req.body;
    insertTweet(message).then(tweet => {
        res.status(tweet[0]).send({message: tweet[1]});
    })
});

app.get('/api/tweets/', (req, res) => {
    getTopTweets().then(tweets => {
        res.status(200).send({
            tweets
        })
    });
});

app.get('/api/tweets/:id', (req, res) => {
    const { id } = req.params;
    getTweet(id).then(tweet => {
        res.status(tweet[0]).send({
            message: tweet[1],
            tweet: tweet[2]
        })
    });
});

app.delete('/api/tweets/:id', (req, res) => {
    const { id } = req.params;
    deleteTweet(id).then(tweet => {
        res.status(tweet[0]).send({message: tweet[1]});
    });
});