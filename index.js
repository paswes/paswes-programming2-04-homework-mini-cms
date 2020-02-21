const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');

const app = express();

let messages = [];

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));

app.get('/', (request, response) => {
    response.render('home');
});

app.post('/board', (request, response) => {
    let currentAuthor = request.body.author;
    const savedData = fs.readFileSync('./savedData.json', {encoding:'utf8'});
    messages = JSON.parse(savedData);
    response.render('board', {messages: messages, author: currentAuthor});
    //console.log(currentAuthor);
});

app.post('/next', (request, response) => {

    messages.push({
        author: request.body.author,
        text: request.body.text,
        date: new Date()
    });

    //console.log('Array data:\n', messages);
    fs.writeFileSync('./savedData.json', JSON.stringify(messages), {encoding: 'utf8'});

    response.render('board', {messages: messages});
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});