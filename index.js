let state = {
  recipes: [],
  favourites: [],
};

function getDataFromApi(userSearch) {
    
  fetch(
    `https://api.spoonacular.com/recipes/complexSearch/?apiKey=4730c6e1cbe144e1bf35eaee02a816d9&query=${userSearch}`
  )
    .then((response) => response.json())
    .then((data) => {
      state.recipes = data.results;
      render();
    });
}

function getUserInput() {
  const formEl = document.querySelector("form");
  formEl.addEventListener("submit", function (event) {
    event.preventDefault();
    const userSearch = formEl["search-bar-recipes"].value;
    getDataFromApi(userSearch);
    formEl.reset();
  });
}

function renderRecipeCard(recipe) {

  const liEl = document.createElement("li");
  liEl.setAttribute("class", "card");

  const heartEl = createElm("img", {
      id: "heart-icon",
      src: "heart.svg",
      alt: "heart"
    })

  const imgEl = createElm("img", {
    className: "recipe-image",
    src: recipe.image,
    alt: recipe.title,
  });

  const h3El = createElm("h3", {
    innerText: recipe.title,
  });

  const btnDivEl = createElm("div", {
    class: "button",
  });

  const btnEl = createElm("button", {
    className: "get-recipe",
    innerText: "RECIPE",
  });

  btnDivEl.append(btnEl);

  liEl.append(heartEl, imgEl, h3El, btnDivEl);

  return liEl;
}

function renderRecipeCardList() {
  const ulEl = document.querySelector(".container");
  const newRecipe = state.recipes.slice(0, 8);
  console.log(newRecipe);
  if (newRecipe.length > 4) {
    console.log("true");
    const slicedRecipes1 = state.recipes.slice(0, 4);
    const slicedRecipes2 = state.recipes.slice(4, 8);
    const ulEl2 = document.querySelector(".container2");
    for (const recipe of slicedRecipes1) {
      const liEl = renderRecipeCard(recipe);
      ulEl.append(liEl);
    }

    for (const recipe2 of slicedRecipes2) {
      const liEl = renderRecipeCard(recipe2);
      ulEl2.append(liEl);
    }
  }
}

function render() {
  renderRecipeCardList();
}

function createElm(tag, attobj) {
  const elm = document.createElement(tag);
  for (const key of Object.keys(attobj)) {
    elm[key] = attobj[key];
  }
  return elm;
}

getUserInput();
render()