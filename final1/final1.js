const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');

var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'dpfeb321321',  // 수정됨
    database:'poapper_backend'
})

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname, 'front1/build')));
app.use(cors());

/* app.get('/', (req, res) => {
    console.log("executedd");
    res.sendFile(path.join(__dirname, '/front1/build/index.html'));
}); */

app.get('/:id', (req, res) => {
    const query_id = req.params.id;

    db.query(`SELECT * FROM boxes`, (err, results) => {
        if(err) throw err;
        let ResponseBody = { "number": [0,0,0,0,0,0], "word": "", "answer": "", "empty": ""};
        for (let i = 1; i <= 5; i++) {
            ResponseBody.number[i] = results.filter(box => box.boxnum === i).length;
        }
        db.query(`SELECT * FROM boxes WHERE boxnum=${query_id}`, (err, results) => {
            if(err) throw err;
            if(ResponseBody.number[query_id] === 0) {
                ResponseBody.empty = "true";
            }
            else {
                ResponseBody.empty = "false";
                ResponseBody.word = results[0].word;
                ResponseBody.answer = results[0].answer;
            }
            res.send(ResponseBody);
        });
    });
});

app.post('/', (req, res) => {
    const body = req.body;

    db.query(`INSERT INTO boxes (word, answer, boxnum) VALUES (\'${body.word}\', \'${body.answer}\', 1)`, (err, results) => {
        if(err) throw err;
        res.send();
    });
});

app.delete('/', (req, res) => {
    db.query(`SELECT * FROM boxes WHERE boxnum=5`, (err, results) => {
        if(err) throw err;
        db.query(`DELETE FROM boxes WHERE word=\'${results[0].word}\'`, (err, results) => {
            if(err) throw err;
            res.send();
        });
    });
});

app.put('/', (req, res) => {
    const body = req.body;

    db.query(`SELECT * FROM boxes WHERE boxnum=${body.boxnum}`, (err, results) => {
        if(err) throw err;
        if(Object.keys(results).length == 0) {

        }
        else if(body.result == "success") {
            db.query(`UPDATE boxes SET boxnum=${body.boxnum + 1} WHERE word=\'${results[0].word}\'`, (err, results) => {
                if(err) throw err;
            });
        }
        else {
            db.query(`UPDATE boxes SET boxnum=1 WHERE word=\'${results[0].word}\'`, (err, results) => {
                if(err) throw err;
            });
        }
        res.send();
    });
});

app.listen(8080, () => console.log("server is running on 8080 port."));