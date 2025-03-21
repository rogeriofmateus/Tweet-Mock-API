import { openDb } from "../dbConfig.js";

export async function createTableTweet() {
    const db = await openDb();
    db.run(`
        CREATE TABLE IF NOT EXISTS Tweets (
            id VARCHAR(32) PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
            message TEXT,
            deleted BOOL DEFAULT 0 NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}
export async function insertTweet(message) {
    const db = await openDb();
    let statusCode;
    let alert;
    if (!message) {
        statusCode = 400;
        alert = "O campo 'message' é obrigatório, cara.";
    } else {
        statusCode = 201;
        alert = "Tweet criado com sucesso!";
        db.run(`INSERT INTO Tweets (message) VALUES (?)`, message);
    }
    return ([statusCode, alert]);
}

export async function getTweet(id) {
    const db = await openDb();
    const tweet = await db.get(`SELECT message FROM Tweets WHERE id = ? AND deleted = 0`, id);
    const statusCode = tweet ? 200 : 404;
    const alert = tweet ? undefined : "Tweet com id " + id + " não encontrado.";
    return ([statusCode, alert, tweet]);
}

export async function getTopTweets() {
    const db = await openDb();
    return await db.all(`SELECT message FROM Tweets WHERE deleted = 0 ORDER BY created_at DESC LIMIT 20`);
}

export async function deleteTweet(id) {
    const db = await openDb();
    let statusCode;
    let alert;
    const tweet = await getTweet(id).then();
    if (!tweet) {
        statusCode = 404;
        alert = "Tweet com id " + id + " não encontrado.";
    } else {
        statusCode = 204;
        alert = "Tweet deletado com sucesso!";
        db.run(`UPDATE Tweets SET deleted = 1 WHERE id = ? AND deleted = 0`, id);
    }
    return ([statusCode, alert]);
}
