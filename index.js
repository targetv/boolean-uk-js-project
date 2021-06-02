let state =  {
    recipes: [],
    favourites: []
}

function getDataFromApi(userSearch) {

    fetch(`https://api.spoonacular.com/recipes/complexSearch/?apiKey=4730c6e1cbe144e1bf35eaee02a816d9&query=${userSearch}`)
    .then(response => response.json())
    .then(data => {
        state.recipes = data.results
        console.log(state.recipes)
    })
}

function getUserInput() {

   const formEl = document.querySelector('form')
   formEl.addEventListener('submit', function(event) {
       event.preventDefault()
       const userSearch = formEl["search-bar-recipes"].value
       getDataFromApi(userSearch)
       formEl.reset()
    })
}

function renderRecipeCard(recipe) {

    const liEl = document.createElement('li')
    liEl.setAttribute('class', 'card')

    const imgEl = createElm('img', {className: "recipe-image",
                                    src: recipe.image,
                                    alt: recipe.title
                                })

    const h3El = createElm('h3', {
        innerText: recipe.title
    })

    const btnDivEl = createElm('div', {
        class: "button"
    })

    const btnEl = createElm('button', {
        className: "get-recipe",
        innerText: "RECIPE"
    })

    btnDivEl.append(btnEl)

    liEl.append(imgEl, h3El, btnDivEl)

    return liEl
}

function renderRecipeCardList() {

    const ulEl = document.querySelector(".container")

    for (const recipe of state.recipes) {
        const liEl = renderRecipeCard(recipe)
        ulEl.append(liEl)
    }
}

function render() {

    renderRecipeCardList()
}

function createElm(tag, attobj) { 
      const elm = document.createElement(tag);   
      for (const key of Object.keys(attobj)) {     
          elm[key] = attobj[key];   
        }   
          return elm; 
}

getUserInput()
// renderRecipeCard()

