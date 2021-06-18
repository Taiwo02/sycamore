const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL || 'mongodb+srv://Taiwo:56987456Taiwo@cluster0.lyrtx.mongodb.net/loan?retryWrites=true&w=majority'
const client =  mongoose.connect(mongoURL, { useNewUrlParser: true,useUnifiedTopology: true  })
              .then(() => console.log("MongoDb connected"))
              .catch(err => console.log(err));;
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/',routes);
app.listen(process.env.PORT || 5000,(err)=>{
    console.log('You are listen to port 5000');
})



