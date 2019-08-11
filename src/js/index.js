import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from './models/List';
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from "./views/base";

//Global state of the app
const state = {};
window.state = state // testing purpose on console
//--------- Search Controller -----------------

const controlSearch = async () => {
  //1 Get query from view
  const query = searchView.getInput(); // save the value from form (for example pizza)
  if (query) {
    //2 New search object and add to state
    state.search = new Search(query);

    //3 Prepare UI for results
    searchView.clearInput(); //clears the input after search
    searchView.clearResults(); //clears the right side of recipes when we make a new search
    renderLoader(elements.searchRes); // we render the loader icon while we wait (NOTE it keeps rendering after results too)
    //4 Search for recipes
    await state.search.getResults();

    //5 render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};



document.querySelector(".search").addEventListener("submit", e => {
  e.preventDefault(); //Clicking on a "Submit" button, prevent it from submitting a form. So we just save the input
  controlSearch();
});



elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline"); //closest let us click the closest it is with the class btn inline.SO i dont accidently press another element in the button like span
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

//--------Recipe Controller --------

const controlRecipe = async () => {
  //Get ID from url
  const id = window.location.hash.replace("#", ""); //window.location is the url, and with .hash its the url after # (example #34125). We want the url without the # so we replace the # with nothing
  // We want to have a recipe rendered ONLY if we have an id
  if (id) {
    //PREPARE UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Create new recipe object
    state.recipe = new Recipe(id);

    //Get recipe data and parse ingredients
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();

    //Calculate servings and time
    state.recipe.calcTime();
    state.recipe.calcServings();

    //Render recipe
    clearLoader();
    recipeView.renderRecipe(state.recipe);
  }
};

//I can make them 1 line like this because they use the same function ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))
window.addEventListener("hashchange", controlRecipe); // every time #url is changed (that means everytime i click on different recipe) the control recipe function will be called
window.addEventListener("load", controlRecipe); //this event will hold an id and diplay results IF the user has saved this page with the url in his bookmarks.If its a normal url it wont trigger



/** 
 * LIST CONTROLLER
 */
const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) {
     state.list = new List(); // wE just want to initialize an empty object
  }
  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
      listView.renderItem(item);
  });
}


// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
      // Delete from state
      state.list.deleteItem(id);

      // Delete from UI
      listView.deleteItem(id);

  // Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
      const val = parseFloat(e.target.value, 10);
      state.list.updateCount(id, val);
  }
});


//Hnadling recipe button clicks
elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) { //SO if the element i click, its className matches these values the event fires. The second parameter with * means if i click to child elements like the svg. Works like the closest
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});
