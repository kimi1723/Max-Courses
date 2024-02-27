// app
const express = require('express');
const path = require('path');

const mainRoute = require('./routes/main');
const usersRoute = require('./routes/users');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(usersRoute);
app.use(mainRoute);

app.listen(3000);
