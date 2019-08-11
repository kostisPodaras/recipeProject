export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list')
}


export const renderLoader = parent => {  //renders the loader
    const loader = `<div class="loader">
        <svg>
            <use href="img/icons.svg#icon-cw"></use
        </svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader) // It will put all the above htmnl code at top of the results div 
}

export const clearLoader = () => {
    const loader = document.querySelector('.loader');
    if ( loader ) {
        loader.parentElement.removeChild(loader)
    };
}