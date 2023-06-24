const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

var recipes = require('./recipes.json');
var ingredients = [];

compileIngredients(recipes)

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views","./views")
app.set("view engine","ejs")

// Home: static page
app.get('/',(req,res) => {
    res.sendFile('./public/index.html');
})

// Search: ejs template
app.post('/busca', (req,res) => {
    console.log(req.body)
    if ( Array.isArray(req.body.ings) ){
        ings = req.body.ings;
    } else {
        ings = [req.body.ings];
    }
    //for (let key in req.body) {
     //   ings.push(req.body[key])
    //}

    result = searchResults(ings,recipes)
    res.render('search', {result});
})

// View individual recipe: ejs template
app.get('/r/:recID', (req, res) => {
    const {recID} = req.params;
    const recipe = recipes.find( (r) => r.id === Number(recID) );
    if (!recipe) {
        return res.status(404).send('Receita não existe');
    }
    res.render("recipe",{recipe});
})

// Add recipe: static page, then post request
app.get('/criarReceita', (req, res) => {
    res.sendFile(path.resolve(__dirname,'public','criarReceita.html'))
})

app.post('/receitaEnviada', (req,res) => {
    o = {};
    o.author = req.body.author;
    o.name = req.body.name;
    o.instructions = req.body.instructions;
    o.ingredients = req.body.ings;
    if ( Array.isArray(req.body.qtys) ){
        o.quantities = req.body.qtys;
    } else {
        o.quantities = [req.body.qtys];
    }
    if ( Array.isArray(req.body.ings) ){
        o.ingredients = req.body.ings;
    } else {
        o.ingredients = [req.body.ings];
    }

    o.id = recipes.length
    recipes.push(o)
    compileIngredients([o])
    saveRecipesToDisk()
    res.send('Obrigado por enviar sua receita!')
})

// API serving ingredients list for form filling
app.get('/api/ingredients', (req, res) => {
    res.json(ingredients);
})

let port = 666
app.listen(port,() => {
    console.log('Server listining on port ' + port);
})

/*
app.get('/api', (req, res) => {
    const subRecipes = recipes.map( (recipe) => {
        const {id, name} = recipe;
        return {id, name};
    })
    res.json(subReceitas)
})
*/

function searchResults(ingreds,recipes) {
    result = [];
    for (let r in recipes) {
        let quantTotal = recipes[r].ingredients.length;
        let quantMissing = recipes[r].ingredients.length;
        let missing = [];
        for (let i in recipes[r].ingredients) {
            if (ingreds.indexOf(recipes[r].ingredients[i]) === -1) {
                quantMissing -= 1;
                missing.push(recipes[r].ingredients[i]);
            }
        }
        let o = {};
        o.name = recipes[r].name;
        o.id = recipes[r].id;
        o.quantMissing = quantMissing;
        o.quantTotal = quantTotal;
        o.missing = missing;
        result.push(o);
    }
    return result
}

function compileIngredients(recs) {
    for (r in recs) {
        for (i in recs[r].ingredients) {
            if (ingredients.indexOf(recs[r].ingredients[i]) === -1) {
                ingredients.push(recs[r].ingredients[i])
            }
        }
    }
}

function saveRecipesToDisk() {
    fs.copyFile('./recipes.json', './recipes.json.bak', err => {
        if (err) {
            throw err
        }
        fs.writeFile('./recipes.json', JSON.stringify(recipes), err => {
            if (err) {
                throw err
            }
        })
    })
    
    console.log('Nova receita salva')
}