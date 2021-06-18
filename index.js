const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/local'

// const pug = require('pug');
// mongoose.connect(mongoURL, { useNewUrlParser: true,useUnifiedTopology: true  });
// const db = mongoose.Connection;
// db.on('err',(error)=> console.log(error));
// db.once('open',()=>console.log('connected to database'));
// mongoose.connect('mongodb+srv://Taiwo:08102637956@Ta@cluster0.lyrtx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true  });
// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
const client =  mongoose.connect(mongoURL, { useNewUrlParser: true,useUnifiedTopology: true  });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
// mongoose.connect(mongoURL, { useNewUrlParser: true,useUnifiedTopology: true });
const https = require('https')
const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/transaction/verify/:reference',
  method: 'GET',
  headers: {
    Authorization: 'Bearer sk_test_674af420e266597b60d2843367db5a6709d6395d'
  }
}
https.request(options, res => {
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  });
  res.on('end', () => {
    console.log(JSON.parse(data))
  })
}).on('error', error => {
  console.error(error)
})

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/',routes);
app.listen(process.env.PORT || 5000,(err)=>{
    console.log('You are listen to port 5000');
})



