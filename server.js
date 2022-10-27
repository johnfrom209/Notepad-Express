const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');
let textSaved = require('./db/db.json');
const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
}
);
app.get('/api/notes', (req, res) => {
    res.json(textSaved);
})

// saves the notes
app.post('/api/notes', (req, res) => {

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uniqid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            }
            else {
                const parsedSaved = JSON.parse(data);

                parsedSaved.push(newNote);
                textSaved = parsedSaved;

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedSaved, null, 3),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully added note!')
                );
            }
            res.json(textSaved);
        }
        )
    }
})

app.delete('/api/notes/:id', (req, res) => {

    let currentId = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            const parsedSaved = JSON.parse(data);

            for (let i = 0; i < parsedSaved.length; i++) {
                if (currentId == parsedSaved[i].id) {
                    parsedSaved.splice(i, 1);
                }
            }
            textSaved = parsedSaved;

            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedSaved),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully deleted!')
            );
        }
        res.json(textSaved);
    }
    )
})

app.get(`*`, (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);


