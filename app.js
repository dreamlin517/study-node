const express = require('express');
const app = express();
const path = require('path');
const formidable = require('formidable')
const sd = require('silly-datetime');
const fs = require('fs');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs')
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/upload', function (req, res) {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'public/images');
    const rand = sd.format(new Date(), 'YYYYMMDDHHmm') + Math.floor((Math.random() * 10000));

    form.parse(req, function (err, fields, file) {
        const oldPath = file.photo.path;
        const newpath = path.join(path.dirname(oldPath), rand + path.extname(file.photo.name));
        fs.renameSync(oldPath, newpath);
        res.redirect('/album');
    });
});

app.get('/', function (req, res) {
    res.render('index')
});

app.get('/blog', function (req, res) {
    const stream = fs.readFileSync(path.join(process.cwd(), 'public/articles/index.json'));
    const str = stream.toString();
    const articles = JSON.parse(str);
    res.render('blog', { articles: articles });
});

app.get('/blog/:title', function (req, res) {
    const title = req.params.title;
    const stream = fs.readFileSync(path.join(process.cwd(), 'public/articles/index.json'));
    const str = stream.toString();
    const articles = JSON.parse(str);
    for(var i =0; i < articles.length; i++ ){
        if(title === articles[i].title){
            return res.render('article',{post:articles[i]});
        }
        
    }

});
app.delete('/article', function (req, res) {
    const title = req.body.title;

    const stream = fs.readFileSync(path.join(process.cwd(),'public/articles/index.json'));
    const str = stream.toString();
    let articles = JSON.parse(str);

    articles = articles.filter(item => item.title !==  title);

    fs.writeFileSync(path.join(process.cwd(),'public/articles/index.json'), JSON.stringify(articles, null, 4));

    res.end();
});

app.get('/write',function (req, res) {
res.render('write');
});

app.post('/write', function (req, res) {
    const article = req.body; //客户端传来的数据
    article.author = 'yml';
    article.date = '2018-08-15';

    const stream = fs.readFileSync(path.join(process.cwd(), 'public/articles/index.json'));
    const str = stream.toString();
    const articles = JSON.parse(str);

    articles.unshift(article);
    fs.writeFileSync(path.join(process.cwd(), 'public/articles/index.json'),JSON.stringify(articles, null,4));

    res.redirect('/blog');
});

app.get('/album', function (req, res) {
    const files = fs.readdirSync(path.join(process.cwd(), 'public/images'));

    res.render('album', { file: files });
});

app.listen(3000, function () {
    console.log('监听3000窗口');
});
