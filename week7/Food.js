const express = require('express');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const methodOverride = require('method-override');
const CryptoJS = require('crypto-js');

var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',  // 수정됨
    database:'poapper_backend'
})

const app = express();
app.use(cookieParser("dbbbbd"));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(methodOverride("_method"));
const cookieConfig = { httpOnly : true, maxAge : 20000, signed : true};
const secretKey = 'secret key';

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/login', (req, res) => {
    const body = req.body;
    const query_id = body.id;
    const query_pw = body.password;

    db.query(`SELECT * FROM user WHERE login_id=\'${query_id}\'`, (err, results) => {
        if(err) throw err;
        const bytes = CryptoJS.AES.decrypt(results[0].login_pw, secretKey);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if(Object.keys(results).length == 0) {
            console.log("Login failed...");
        }
        else if(decrypted == query_pw) {  // id에 중복이 없다고 가정
            console.log("Login success");
            res.cookie('id', query_id, cookieConfig);
            res.cookie('password', query_pw, cookieConfig);
        }
        else {
            console.log("Login failed...");
        }
        res.redirect(302, "/");
    });
});

app.post('/register', (req, res) => {
    const body = req.body;
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(body.password), secretKey).toString();

    db.query(`INSERT INTO user (login_id, login_pw) VALUES (\'${body.id}\', \'${encrypted}\')`, (err, results) => {
        if(err) throw err;
        res.redirect(302, "/");
    });
});

app.delete('/quit', (req, res) => {
    const cookie_id = req.signedCookies.id;
    const cookie_pw = req.signedCookies.password;

    db.query(`DELETE FROM user WHERE login_id=\'${cookie_id}\'`, (err, results) => {
        if(err) throw err;
        res.clearCookie('id');
        res.clearCookie('password');
        res.redirect(302, "/");
    });
});

app.get('/food', (req, res) => {
    db.query('SELECT * FROM foods', (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify(results));
    });
});

app.get('/food/:id', (req, res) => {
    const query_id = req.params.id;
    db.query(`SELECT * FROM foods WHERE id=${query_id}`, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify(results));
    });
});

app.get('/food/isVegan', (req, res) => {
    db.query('SELECT * FROM foods WHERE isVegan=1', (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify(results));
    });
});

app.delete('/food/:id', (req, res) => {
    const query_id = req.params.id;
    const cookie_id = req.signedCookies.id;
    const cookie_pw = req.signedCookies.password;


    db.query(`SELECT * FROM user WHERE login_id=\'${cookie_id}\'`, (err, results) => {
        if(err) throw err;
        if(Object.keys(results).length != 0) {
            db.query(`DELETE FROM foods WHERE id=${query_id}`, (err, results) => {
                if(err) throw err;
                res.redirect(302, "/");  // disk cache에 리디렉션을 저장하는 버그가 301 코드에 있다고 함
            });
        }
        else {
            console.log("Access Denied!");
            res.redirect(302, "/");
        }
    });
});

app.post('/food', (req, res) => {
    const body = req.body;
    const cookie_id = req.signedCookies.id;
    const cookie_pw = req.signedCookies.password;

    db.query(`SELECT * FROM user WHERE login_id=\'${cookie_id}\'`, (err, results) => {
        if(err) throw err;
        if(Object.keys(results).length != 0) {
            db.query(`INSERT INTO foods (name, kcal, isVegan) VALUES (\'${body.name}\', ${body.kcal}, ${body.isVegan})`, (err, results) => {
                if(err) throw err;
                res.redirect(302, "/");
            });
        }
        else {
            console.log("Access Denied!");
            res.redirect(302, "/");
        }
    });
});

app.put('/food/:id', (req, res) => {
    const body = req.body;
    const query_id = req.params.id;
    const cookie_id = req.signedCookies.id;
    const cookie_pw = req.signedCookies.password;

    db.query(`SELECT * FROM user WHERE login_id=\'${cookie_id}\'`, (err, results) => {
        if(err) throw err;
        if(Object.keys(results).length != 0) {
            db.query(`UPDATE foods SET name=\'${body.name}\', kcal=${body.kcal}, isVegan=${body.isVegan} WHERE id=${query_id}`, (err, results) => {
                if(err) throw err;
                res.redirect(302, "/");
            });
        }
        else {
            console.log("Access Denied!");
            res.redirect(302, "/");
        }
    });
});

app.listen(8080, () => console.log("server is running on 8080 port."));