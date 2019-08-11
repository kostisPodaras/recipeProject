import axios from 'axios';
import {API} from '../config'

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${API}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(error) {
            console.log(error)
            alert('Error found')
        }
    } 

    calcTime() {
        // Assuming that we need 15 mins for each 3 ingredients
        const numIng = this.ingredients.length
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        //Some ingredients in the json we recieve are tablespoons, others tablespoon,ounces etc other tbsp. I make them the same unit
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el => {
            //1) Uniform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((el, i) => {
                ingredient = ingredient.replace(el, unitsShort[i]);
            });
            //2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); //copy pasted from regex . It removes text between parenthesis
            //3)Parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' '); // Makes the ingredients into an array. Example 'salt and pepper'  --> ['salt', 'end', pepper']
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) { // So basicaly if it exists (it will return the position.If it existis it will be > -1)
                //There is a unit
                 // Example 4 1/2 cups, arrCount is [4, 1/2] --> eval('4+1/2') --> 4.5
                  // Example 4, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex); // If somethings of the units array exists, for example tbsp, it will slice the array from 0 to its index(0-3 for example)

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+')); //eval() evaluates javascript code represented as string
                } else {
                    count  = eval(arrIng.slice(0, unitIndex).join('+'))
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            }
            else if (parseInt(arrIng[0], 10)) {
                // There is NO unit but the 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
             else if (unitIndex === -1) {
                //There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}