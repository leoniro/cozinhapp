const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
var recipes = require('./recipes.json');
const ingredients = require('./ingredients.json');

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views","./views")
app.set("view engine","ejs")

app.post('/busca', (req,res) => {
    let ings = []
    for (let key in req.body) {
        ings.push(req.body[key])
    }

    result = searchResults(ings,recipes)
    res.render('search', {result});
})

app.get('/',(req,res) => {
    res.sendFile('./public/index.html');
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

app.get('/api/ingredients', (req, res) => {
    res.json(ingredients);
    console.log('api/ingredients')
})

app.get('/api/rec/:recID', (req, res) => {
    const {recID} = req.params;
    const recipe = recipes.find( (r) => r.id === Number(recID) );
    if (!recipe) {
        return res.status(404).send('Receita não existe');
    }
    res.json(recipe);
})

app.listen(666,() => {
    console.log('Server listining on port 666');
})


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