// Rota que adiciona os jobs no projeto
const express   = require("express")
const router    = express.Router()
const Job       = require('../models/job')


router.get('/test', (req,res) => {
    res.send("deu certo")
})



router.get('/add', (req,res) => {
    res.render('add')
})
// add job via post 
router.post('/add', (req,res) => {

    // vai receber um corpo que vai vir do formulario, etc... e por isso utiliza-se o body parser
    let {title, salary, company, description, email, new_job} = req.body;

    //insert
    Job.create({
        title,
        description,
        salary,
        company,
        email,
        new_job
    })

    // caso funcione, redireciona para a homme
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


module.exports = router