const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const app = express();
const recipes = require('./recipes.json');
const ingredients = require('./ingredients.json')

app.use(express.static('./public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', (req,res) => {
    res.json(req.body);
})

app.get('/',(req,res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

/*
app.get('/api', (req, res) => {
    const subRecipes = recipes.map( (recipe) => {
        const {id, name} = recipe;
        return {id, name}
    })
    res.json(subReceitas)
})
*/

app.get('/api/ingredients', (req, res) => {
    res.json(ingredients);
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
