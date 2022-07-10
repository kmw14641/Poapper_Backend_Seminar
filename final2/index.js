const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',  // 수정됨
    database:'poapper_backend'
})

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static("public"));
app.use(cors());

const storage = multer.diskStorage({
    destination: "./client/public/",
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
  });

app.get('/:id', (req, res) => {  // Information on the first card in the box corresponding to that id + get the number of cards that the boxes contain
    const query_id = req.params.id;

    db.query(`SELECT * FROM boxes`, (err, results) => {
        if(err) throw err;
        let ResponseBody = { "number": [0,0,0,0,0,0], "word": "", "answer": "", "property": "", "empty": ""};
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
                ResponseBody.property = results[0].property;
            }
            res.send(ResponseBody);
        });
    });
});

app.post('/', (req, res) => {  // Create a word card with words + meanings
    const body = req.body;

    db.query(`INSERT INTO boxes (word, answer, property, boxnum) VALUES (\'${body.word}\', \'${body.answer}\', \'text\', 1)`, (err, results) => {
        if(err) throw err;
        res.send();
    });
});

app.post('/image', upload.single("image"), (req, res) => {  // Create an image card with images + meanings
    const body = req.body;
    
    db.query(`INSERT INTO boxes (word, answer, property, boxnum) VALUES (\'${req.file.filename}\', \'${body.answer}\', \'image\', 1)`, (err, results) => {
        if(err) throw err;
        res.send();
    });
});

app.delete('/', (req, res) => {  // Remove the first card in box 5, call when success is pressed in box 5
    db.query(`SELECT * FROM boxes WHERE boxnum=5`, (err, results) => {
        if(err) throw err;
        db.query(`DELETE FROM boxes WHERE word=\'${results[0].word}\'`, (err, results) => {
            if(err) throw err;
            res.send();
        });
    });
});

app.put('/', (req, res) => {  // Move the card according to whether the result of the body is successful or failed
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

app.listen(process.env.PORT || 8080, () => console.log("server is running on 8080 port."));