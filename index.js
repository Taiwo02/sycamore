const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/local'
// mongoose.connect('mongodb://localhost/local', { useNewUrlParser: true,useUnifiedTopology: true  });
// const db = mongoose.Connection;
// db.on('err',(error)=> console.log(error));
// db.once('open',()=>console.log('connected to database'));
mongoose.connect(mongoURL, { useNewUrlParser: true,useUnifiedTopology: true  });
// mongoose.connect(mongoURL, { useNewUrlParser: true,useUnifiedTopology: true });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/',routes);
app.listen(5000,(err)=>{
    console.log('You are listen to port 5000');
})



