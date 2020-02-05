const express = require('express');
const mongoose = require('mongoose');

mongoose
.connect('mongodb://localhost:27017/umAPI', {useNewUrlParser: true})
.then(() => {
console.log('connected to mongodb');

});

const users = require('./routes/users');

const app = express();

app.use(express.json());

app.use('/api/users', users);


app.listen(8080, () => {
	console.log('Server has started');
});

