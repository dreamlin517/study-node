const express = require('express');
const app = express();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const sd = require('silly-datetime');

app.set( 'view engine','ejs' );
app.use(express.static(path.join(process.cwd(),'public')))

app.post('/upload', function(req, res){
    const form = new formidable.IncomingForm();
    
    form.uploadDir = path.join(process.cwd(), 'public/images'); //设置上传文件放在哪个目录下
    const rand = sd.format(new Date(), 'YYYYMMDDHHmm') + Math.floor((Math.random()*10000));  //设置上传文件名产生随机数
    
    form.parse(req, function(err, fields,files){
        const oldPath = files.photos.path;
        const newPath = path.join(path.dirname(oldPath), rand + path.extname(files.photos.name));
        fs.renameSync(oldPath, newPath);
        res.redirect('/album');
    })
})

app.get( '/', function( req, res ){
    res.render( 'index' )
})

app.get( '/blog', function(req, res){
    res.render( 'blog')
} )
 
app.get( '/album', function(req, res){
   const files= fs.readdirSync(path.join(process.cwd(),'public/images'))

    res.render('album', {files:files})
})

app.listen( 3000, function( ){
    console.log( '监听3000窗口' );
} )