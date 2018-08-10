var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
var path=require('path');
app.use(express.static(path.join(__dirname,'public/css')));
var db = require('./lib/db');
app.set('views', './views_shoppingcart');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser('23879ASDF234sdf@!#$a'));
app.set('views', './views_shoppingcart');
app.set('view engine', 'jade');
app.locals.pretty = true;
var products = {
  1:{title:'The history of web 1',price:500},
  2:{title:'The next web',price:250},
  3:{title:'happy',price:650},
  4:{title:'easy',price:700}
};
app.get('/products', function(req, res){
  var cart = req.signedCookies.cart;
  res.render('products',{cart:cart,products:products})
});
app.get('/cart/:id', function(req, res){
  var id = req.params.id;
  if(req.signedCookies.cart) {
    var cart = req.signedCookies.cart;
    var totalprice= req.signedCookies.totalprice;
  } else {
    var cart = {};
    var totalprice = 0;
  }
  if(!cart[id]){
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id])+1;
  totalprice = parseInt(parseInt(totalprice)+parseInt(products[id].price));

  res.cookie('cart', cart, {signed:true});
  res.cookie('totalprice', totalprice, {signed:true});
  res.redirect('/cart');
});

app.post('/cart/edit/:id', function(req, res){
  var id = req.params.id;
  if(req.signedCookies.cart) {
    var cart = req.signedCookies.cart;
    var totalprice= req.signedCookies.totalprice;
  } else {
    var cart = {};
    var totalprice = 0;
  }
  if(!cart[id]){
    cart[id] = 0;
  }
  totalprice = parseInt(parseInt(totalprice)+(parseInt(products[id].price))*parseInt(req.body.products_quantity-cart[id]));
  cart[id] = parseInt(req.body.products_quantity);

  res.cookie('cart', cart, {signed:true});
  res.cookie('totalprice', totalprice, {signed:true});
  res.redirect('/cart');
});

app.get('/cart/delete/:id', function(req, res){
  var id = req.params.id;
  if(req.signedCookies.cart) {
    var cart = req.signedCookies.cart;
    var totalprice= req.signedCookies.totalprice;
  } else {
    var cart = {};
    var totalprice = 0;
  }
  if(!cart[id]){
    cart[id] = 0;
  }
  if(parseInt(cart[id])>0){
    totalprice = parseInt(parseInt(totalprice)-(parseInt(products[id].price))*parseInt(cart[id]));
    cart[id] = 0;
  }
  res.cookie('cart', cart, {signed:true});
  res.cookie('totalprice', totalprice, {signed:true});
  res.redirect('/cart');
});

app.get('/cart', function(req, res){
  var cart = req.signedCookies.cart;
  var totalprice = req.signedCookies.totalprice;
  res.render ('cart',{cart:cart,products:products,totalprice:totalprice});
});

app.get('/count', function(req, res){
  if(req.signedCookies.count){
    var count = parseInt(req.signedCookies.count);
  } else {
    var count = 0;
  }
  count = count+1;
  res.cookie('count', count, {signed:true});
  res.send('count : ' + count);
});
app.get('/pay', function(req, res){
  var totalprice = req.signedCookies.totalprice;
  res.render ('pay',{totalprice:totalprice});
});
app.get('/pay_ing',function(req,res){
    var totalprice = req.signedCookies.totalprice;
  res.render ('pay_ing',{totalprice:totalprice});
});
app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
});
