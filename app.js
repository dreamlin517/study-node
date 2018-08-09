const app = require('express')();

app.set( 'view engine','ejs' )

app.get( '/', function( req, res ){
    res.render( 'index' )
})

app.get( '/blog', function(req, res){
    res.render( 'blog')
} )
 
app.get( '/album', function(req, res){
    res.render('album' )
})

app.listen( 3000, function( ){
    console.log( '监听3000窗口' );
} )