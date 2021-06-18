const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/local'
// mongoose.connect(mongoURL, { useNewUrlParser: true,useUnifiedTopology: true  });
// mongoose.connect('mongodb://localhost/local', { useNewUrlParser: true,useUnifiedTopology: true  });
// const db = mongoose.Connection;
// db.on('err',(error)=> console.log(error));
// db.once('open',()=>console.log('connected to database'));
// mongoose.connect('mongodb+srv://Taiwo:08102637956@Ta@cluster0.lyrtx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true  });
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
// mongoose.connect(mongoURL, { useNewUrlParser: true,useUnifiedTopology: true });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/',routes);
app.listen(5000,(err)=>{
    console.log('You are listen to port 5000');
})



