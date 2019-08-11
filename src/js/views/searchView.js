import {elements} from './base'

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

/*
//'pasta with tomatoe and spinach'
acc: 0 / acc + cur.length(length of 'pasta') = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length(length of 'with') = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length(length of 'tomatoe') = 15 / newTitle = ['Pasta','with', 'tomatoe' ]
acc: 15 / acc + cur.length(length of 'and') = 15 / newTitle = ['Pasta','with', 'tomatoe' ]
acc: 18 / acc + cur.length(length of 'spinach') = 24 / newTitle = ['Pasta','with', 'tomatoe' ]



*/
const limitRecipeTitle = (title, limit = 17) => { //if charactes are more than 17 i will end them with ...
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => { //split take the words seperated by space and put them in an array. For example hire me will become [hire, me]
            if (acc + cur.length < limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0); //NOTE 0 is the value of accumulator. Else its the first element of the array 
        //return the result
        return `${newTitle.join(' ')} ...`; //Join is the oposite of split which i used above
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;


const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) { //30 items / 10 items per page = 3 pages
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => { // For each recipe i render the result calling the renderrecipe function
    //render result of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(el => renderRecipe(el)); // At recipes i pass the state.search.result which is an array of our recipes. // with slice,start,end we render only the 10 first results instead of 30 [0-9]

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};

