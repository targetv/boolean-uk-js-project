let state = {
  recipes: [],
  favourites: [],
  mostPopular: null,
};

function getDataFromApi(userSearch) {
  fetch(
    `https://api.spoonacular.com/recipes/complexSearch/?apiKey=7b5359c91fd640e2b76f99adf52924cc&query=${userSearch}`
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
    alt: "heart",
  });

  heartEl.addEventListener("click", function () {
    const findRecipeId = state.favourites.find(
      (favRecipe) => favRecipe.id === recipe.id
    );
    if (findRecipeId) {
      console.log(recipe.likes);
      updateLikes({
        id: recipe.id,
        likes: findRecipeId.likes + 1,
      }).then((response) => {
        if (response.ok) {
          setState({
            favourites: state.favourites.map(function (item) {
              if (item.id === recipe.id) {
                return { ...item, likes: item.likes + 1 };
              } else {
                return item;
              }
            }),
          });
        } else {
          console.warn("Error");
        }
      });
    } else {
      postToSever({
        id: recipe.id,
        image: recipe.image,
        title: recipe.title,
        likes: 1,
      }).then((response) => {
        if (response.ok) {
          setState({
            favourites: [...state.favourites, { ...recipe, likes: 1 }],
          });
        } else {
          console.warn("Data already exists on sever");
        }
      });
    }
  });

  const imgEl = createElm("img", {
    className: "recipe-image",
    src: recipe.image,
    alt: recipe.title,
  });

  const h3El = createElm("h3", {
    innerText: recipe.title,
  });

  const btnDivEl = createElm("div", {
    className: "button",
  });

  const btnEl = createElm("button", {
    className: "get-recipe",
    innerText: "RECIPE",
  });

  btnDivEl.append(btnEl);

  liEl.append(heartEl, imgEl, h3El, btnDivEl);
  return liEl;
}

function postToSever(object) {
  return fetch("http://localhost:3000/favourites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
}

function renderRecipeCardList() {
  const ulEl = document.querySelector(".container");
  ulEl.innerHTML = " ";
  const newRecipe = state.recipes.slice(0, 6);
  for (const recipe of newRecipe) {
    const liEl = renderRecipeCard(recipe);
    ulEl.append(liEl);
  }
}
function setState(setState) {
  state = { ...state, ...setState };
  render();
}

function favouritesCard() {
  favouritesCardEl.style.display = "grid";
  const divEl = document.querySelector(".most-favourite-card");
  divEl.innerHTML = "";
  const contentSection = createElm("div", { className: "content-section" });
  const test = state.favourites;
  let mostPopular = null;
  for (const randomtest of test) {
    if (mostPopular === null) {
      mostPopular = randomtest;
      console.log(mostPopular);
    } else {
      if (mostPopular.likes < randomtest.likes) {
        mostPopular = randomtest;
      }
    }
  }
  state.mostPopular = mostPopular;
  console.log(state.mostPopular);

  console.log(test);

  const imgEl = createElm("img", {
    className: "food-image",
    src: state.mostPopular.image,
    alt: state.mostPopular.title,
  });
  const h3El = createElm("h3", {
    className: "favourite-h3",
    innerText: state.mostPopular.title,
  });
  h3El.classList.add("color-blue");
  const buttonEl = createElm("a", {
    href: "#",
    className: "button-favourite",
    innerText: "RECIPE",
  });
  contentSection.append(imgEl, h3El, buttonEl);
  divEl.append(contentSection);
  debugger;
}

function render() {
  renderRecipeCardList();
  favouritesCard();
}

function createElm(tag, attobj) {
  const elm = document.createElement(tag);
  for (const key of Object.keys(attobj)) {
    elm[key] = attobj[key];
  }
  return elm;
}

function updateLikes(recipe) {
  console.log(recipe.id);

  fetch(`http://localhost:3000/favourites/${recipe.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });
}

function renderMainRecipe() {

  const recipeSectionEl = document.querySelector('.main-recipe-section')

  const recipeTitleEl = document.createElement('h2')
  recipeTitleEl.setAttribute('class', "main-recipe-title")
  recipeTitleEl.innerText = recipe.title

  const recipeImageEl = document.createElement('img')
  recipeImageEl.setAttribute('class', "main-recipe-image")
  recipeImageEl.setAttribute('src', recipe.image)
  recipeImageEl.setAttribute('class', recipe.title)

  const recipeIngredientsTitleEl = document.createElement('h3')
  recipeIngredientsTitleEl.setAttribute('class', "main-recipe")
  recipeIngredientsTitleEl.innerText = 'Ingredients'

  const recipeIngredientListEl = document.createElement('ul')

  for (const ingredient of ingredients) {

    const liEl = document.createElement('li')
    liEl.innerText = recipe.ingredient
    recipeIngredientListEl.append(liEl)

  }

  const recipeMethodTitleEl = document.createElement('h3')
  recipeMethodTitleEl.setAttribute('class', "main-recipe")
  recipeMethodTitleEl.innerText = 'Method'

  const recipeMethodEl = document.createElement('ul')

  for (const step of method) {

    const liEl = document.createElement('li')
    liEl.innerText = recipe.step
    recipeMethodEl.append(liEl)

  }

  recipeSectionEl.append(recipeTitleEl, recipeImageEl, recipeIngredientsTitleEl, recipeIngredientListEl, recipeMethodTitleEl, recipeMethodEl
    )

}

getUserInput();

const favouritesCardEl = document.querySelector(".most-favourite-card");
favouritesCardEl.style.display = "none";
