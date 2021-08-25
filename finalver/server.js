const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname, 'public', 'images', 'KolikIcon.ico')));

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/main', { articles: articles })
})

app.use(express.static('public'));
app.use('/articles', articleRouter)

app.listen(5000)
