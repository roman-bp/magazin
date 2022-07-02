
let express = require('express');
let app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');


let mysql = require("mysql2");
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "magaz",
    password: "ghjnjrjk24"
});

connection.connect(function (err) {
    if (err) {
        return console.error("erre" + err.masage);
    } else {
        console.log("подключение к серверу успешно установлено")
    }
});
app.listen(3000, function () {
    console.log('node express work in port 3000')

});





connection.execute("SELECT * FROM goods", function (err, result) {
    // console.log(err);
    // console.log(result);
    let goods = {};
    for (let i = 0; i < result.length; i += 1) {
        goods[result[i]['id']] = result[i];
    }
    // console.log('goods');
    // console.log(JSON.parse(JSON.stringify(goods)));
    app.get('/', function (req, res) {
        res.render('main', {
            // foo: 7,
            // bar: 7,


        });
    });
});

app.get('/cat', function (req, res) {
    console.log(req.query.id);
    let catId = req.query.id;

    let cat = new Promise(function (resolve, reject) {
        connection.execute('SELECT * FROM category where id=' + catId,
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            });

    });
    let goods = new Promise(function (resolve, reject) {
        connection.execute('SELECT * FROM goods where category=' + catId,
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
    });

    Promise.all([cat, goods]).then(function (value) {
        console.log(value);
        res.render('cat', {
            cat: JSON.parse(JSON.stringify(value[0])),
            goods: JSON.parse(JSON.stringify(value[1]))
        });
    });
});
app.get('/goods', function (req, res) {
    console.log(req.query.id);

    connection.query('select * from goods where id=' + req.query.id, function (err, result, fields) {

        if (err) throw err;
        res.render('goods', { goods: JSON.parse(JSON.stringify(result)) })
    });
});

