const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');

const app = express();

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));

const randomId = () => {
    let result = '';
    const characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

app.get('/', (request, response) => {

    const allArticles = [];
    const articleDir = './articles';
    fs.readdirSync(articleDir).forEach(file => {
        const articleContent = fs.readFileSync(`./articles/${file}`, {encoding:'utf8'});
        allArticles.push(JSON.parse(articleContent));
        //console.log(allArticles);
    });
    response.render('home', {articles: allArticles});
});

app.get('/article/:fileName', (request, response) => {
    const fileName = request.params.fileName;
    const article = fs.readFileSync((`./articles/${fileName}`), {encoding:'utf8'});
    const parsedArticle = JSON.parse(article);
    response.render("article", {article: parsedArticle});
});

app.get('/editor', (request, response) => {
    response.render('editor');
});

app.post('/new', (request, response) => {

    //fs.readdir('./articles', (error, files) => {
        const fileId = randomId();
        const newDate = new Date().toDateString();
        //const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


        const article = {
            headline: request.body.headline,
            teaser: request.body.teaser,
            article: request.body.article,
            author: request.body.author,
            date: newDate,
            linkUrl: `http://localhost:3000/article/${fileId}.json`,
            imageUrl: request.body.image
        };
        //console.log(fileCount);
        fs.writeFile(`./articles/${fileId}.json`, JSON.stringify(article), {encoding: 'utf8'}, (err) => {
            if (err) console.log(err);
            //console.log('Successfully created article!');
            response.redirect('/editor');
        });
    });

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('App listening on port 3000...');
});








/*
let messages = [];

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
 */