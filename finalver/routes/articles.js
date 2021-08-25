const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
const axios = require('axios')

var curr;

router.get('/catalogue', async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: 'desc'
  })
  var url = 'http://api.exchangeratesapi.io/v1/latest?' + 'access_key=cf41c4f668ec0beee9572dcec648d6e9';
  curr = await axios.get(url)
  res.render('articles/index', {
    curdata: curr,
    articles: articles
  });
})

router.post('/catalogue', async (req, res) => {
  const val1 = req.body.quantity1
  const val2 = req.body.quantity2
  const brand1 = req.body.brand1
  const articles = await Article.find({
    $and: [{
      brand: {
        $eq: brand1
      }
    }, {
      price: {
        $gte: val1
      }
    }, {
      price: {
        $lte: val2
      }
    }]
  })
  res.render('articles/index', {
    curdata: curr,
    articles: articles
  })
})

router.get('/new', (req, res) => {
  res.render('articles/new', {
    article: new Article()
  })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', {
    article: article
  })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({
    slug: req.params.slug
  })
  if (article == null) res.redirect('/')
  res.render('articles/show', {
    article: article
  })
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('../articles/catalogue')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.model = req.body.model
    article.brand = req.body.brand
    article.description = req.body.description
    article.markdown = req.body.markdown
    article.price = req.body.price
    article.photo = req.body.photo
    article.hosts = req.body.hosts
    article.year = req.body.year
    article.author = req.body.author
    article.mileage = req.body.mileage
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, {
        article: article
      })
    }
  }
}

module.exports = router
