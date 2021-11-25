const express     = require("express")
const exphbs      = require('express-handlebars') 
const app         = express()
const path        = require('path')
const db          = require('./db/connection')
const bodyparser  = require('body-parser')
const Job         = require('./models/job')
const Sequelize   = require('sequelize')
const Op          = Sequelize.Op

const PORT = 3000

const hbs = exphbs.create({defaultLayout: 'main'})

app.listen(PORT, () => {
    console.log(`O express está rodando na porta ${PORT}`)
})

// body_parser,
app.use(bodyparser.urlencoded({extended: false}))

// handle bars (renderizar os dados que vem do backend)

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// static folder
app.use(express.static(path.join(__dirname, 'public')))


// conexão com o bd
db
.authenticate()
.then(() => {
    console.log("Conectou ao banco com sucesso")
})
.catch(err => {
    console.log("Ocorreu um erro ao conectar", err)
})


// --------> Routes <---------
app.get('/', (req, res) => {
    
    let search = req.query.job;
    let query = '%' + search + '%' //PH -> PHP , Word -> wordpress

    if(!search){
        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs
            })
        })
        .catch(err => console.log(err))
    }else{
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs, search
            })
        })
        .catch(err => console.log(err))
    }
    // puxa todos os jobs que estão no banco e ordena por data de criação decrescente
   
});

// jobs routes
app.use('/jobs', require('./routes/jobs'))

