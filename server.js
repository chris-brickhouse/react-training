const express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');

const port = process.env.PORT || 4000;
const host = 'localhost';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

let wishList = [];

for (let i = 1; i <= 10; i++) {
    wishList.push({ title: `Wish list item ${i}`, isComplete: false, id: i });
}

app.get('/api/wishlist', (req, res) => {
  res.send( JSON.stringify(wishList));
});

app.get('/api/wishlists', (request, response) => {
  let wishLists = [];
  fs.readFile('wishlists.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      wishLists = JSON.parse(data);
      wishLists = wishLists.sort((a, b) => a.isComplete - b.isComplete);
      response.json(wishLists);
    }
  });
});

app.post('/api/wishlists', (request, response) => {
  let wishLists = [];
  fs.readFile('wishlists.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      wishLists = JSON.parse(data);
      wishLists.table.push(request);
      wishLists = wishLists.sort((a, b) => a.isComplete - b.isComplete);
      let json = JSON.stringify(wishLists);
      fs.writeFile('wishlists.json', json, 'utf8', function (err) {
        if (err) throw err;
        console.log('complete');
        response.status(200).json(data);
      });  
    }
  });
});

app.get('/api/wishlists/delete/:id', (request, response) => {
  let wishLists = [];
  let id = parseInt(request.params.id);
  fs.readFile('wishlists.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      wishLists = JSON.parse(data);
      if (id > 0) {
        var item = wishLists.findIndex(x => x.id === id);
        wishLists.splice(item, 1);       
      }
      wishLists = wishLists.sort((a, b) => a.isComplete - b.isComplete);
      let json = JSON.stringify(wishLists); 
      fs.writeFile('wishlists.json', json, 'utf8', function (err) {
        if (err) throw err;
        response.status(200).json(wishLists);
      });
    }
  });
});

app.post('/api/wishlists/:id', (request, response) => {
  let wishLists = [];
  let id = parseInt(request.params.id);
  fs.readFile('wishlists.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      wishLists = JSON.parse(data);
      if (id > 0) {
        var item = wishLists.findIndex(x => x.id === id);
        wishLists[item] = request.body;
      } else {
        let sortedList = Object.assign([], wishLists);
        sortedList = sortedList.sort((a, b) => b.id - a.id);
        let newId = sortedList[0].id + 1;
        let newItem = Object.assign({}, request.body);
        newItem.id = newId;
        wishLists.push(newItem);
      }
      wishLists = wishLists.sort((a, b) => a.isComplete - b.isComplete);
      let json = JSON.stringify(wishLists);
      fs.writeFile('wishlists.json', json, 'utf8', function (err) {
        if (err) throw err;
        response.status(200).json(wishLists);
      });  
    }
  });
});

app.listen(port, host);
console.log(`Running on http://${host}:${port}`);