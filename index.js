let state = {
  recipes: [],
  favourites: [
    {
      id: 663357,
      image: "https://spoonacular.com/recipeImages/663357-312x231.jpg",
      title: "The Unagi Burger",
      likes: 5,
    },
    {
      id: 651190,
      image: "https://spoonacular.com/recipeImages/651190-312x231.jpg",
      title: "Masala-Tofu Burger",
      likes: 1,
    },
    {
      id: 654928,
      image: "https://spoonacular.com/recipeImages/654928-312x231.jpg",
      title: "Pasta With Italian Sausage",
      likes: 10,
    },
  ],
  mostPopular: null,
  vegan: false,
  vegetarian: false,
};

function getDataFromApi(userSearch) {
  fetch(
    `https://api.spoonacular.com/recipes/complexSearch/?apiKey=4dd67b37210b4a2c953bdd036ee130db&query=${userSearch}&addRecipeInformation=true&fillIngredients=true&addRecipeNutrition=true&number=100`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      state.recipes = data.results;
      render();
    });
}
function getFavouritesFromSever() {
  fetch("http://localhost:3000/favourites")
    .then((response) => response.json())
    .then((data) => {
      state.favourites = data;
    });
}

function deleteFromSever(recipe) {
  return fetch(`http://localhost:3000/favourites/${recipe.id}`, {
    method: "DELETE",
  });
}

function getUserInput() {
  const formEl = document.querySelector("form");
  formEl.addEventListener("submit", function (event) {
    event.preventDefault();
    const userSearch = formEl["search-bar-recipes"].value;
    getDataFromApi(userSearch);
    isUserFilter();
    getFavouritesFromSever();
    formEl.reset();
  });
}

function renderRecipeCard(recipe) {
  const liEl = document.createElement("li");
  liEl.setAttribute("class", "card");
  const heartsEl = document.createElement("div");

  const heartEl = createElm("img", {
    className: "heart-icon",
    src: "heart.svg",
    alt: "heart",
  });
  const blackHeartEl = createElm("img", {
    className: "heart-icon",
    src: "blackheart.svg",
    alt: "heart",
  });
  heartsEl.append(heartEl, blackHeartEl);

  blackHeartEl.addEventListener("click", function () {
    const getId = state.favourites.findIndex((test) => test.id === recipe.id);
    const findRecipeId = state.favourites.find(
      (favRecipe) => favRecipe.id === recipe.id
    );
    if (findRecipeId.likes === 1) {
      deleteFromSever(findRecipeId).then((response) => {
        if (response.ok) {
          state.favourites.splice(getId, 1);
          console.log(state.favourites);
          render();
        } else {
          console.warn("Something went wrong with delete");
        }
      });
    }
    setState({
      favourites: state.favourites.map(function (item) {
        console.log(getId);
        if (item.id === recipe.id) {
          return { ...item, likes: item.likes - 1 };
        } else {
          return item;
        }
      }),
    });
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

  const btnEl = createElm("a", {
    href: "#main-recipe",
    className: "button-favourite",
    innerText: "RECIPE",
  });
  btnEl.addEventListener("click", function () {
    mainRecipeSection.style.display = "grid";
    renderMainRecipe(recipe);
  });

  btnDivEl.append(btnEl);

  liEl.append(heartsEl, imgEl, h3El, btnDivEl);
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
  let newRecipe = state.recipes;
  console.log(newRecipe);
  if (state.vegan === true) {
    newRecipe = newRecipe.filter((recipe) => recipe.vegan === true);
  }
  if (state.vegetarian === true) {
    newRecipe = newRecipe.filter((recipe) => recipe.vegetarian === true);
    console.log("vege");
  }
  newRecipe.slice(0, 8);
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
  const contentSection = document.querySelector(".content-section");
  contentSection.innerHTML = " ";
  const favouritesRecipes = state.favourites;
  console.log("fav", favouritesRecipes);

  let mostPopular = null;
  for (const recipes of favouritesRecipes) {
    if (mostPopular === null) {
      mostPopular = recipes;
    } else {
      if (mostPopular.likes < recipes.likes) {
        mostPopular = recipes;
      }
    }
  }
  state.mostPopular = mostPopular;
  console.log(state.favourites);
  console.log(state.mostPopular);

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
    href: "#main-recipe",
    className: "button-favourite",
    innerText: "RECIPE",
  });
  contentSection.append(imgEl, h3El, buttonEl);
  divEl.append(contentSection);
}

function render() {
  isUserFilter();
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

  return fetch(`http://localhost:3000/favourites/${recipe.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });
}

function renderMainRecipe(recipe) {
  const recipeSectionEl = document.querySelector(".main-recipe-section");

  const recipeTitleEl = document.createElement("h2");
  recipeTitleEl.setAttribute("class", "main-recipe-title");
  recipeTitleEl.innerText = recipe.title;

  const recipeImageEl = document.createElement("img");
  recipeImageEl.setAttribute("class", "main-recipe-image");
  recipeImageEl.setAttribute("src", recipe.image);
  recipeImageEl.setAttribute("class", recipe.title);

  const recipeIngredientsTitleEl = document.createElement("h3");
  recipeIngredientsTitleEl.setAttribute("class", "main-recipe");
  recipeIngredientsTitleEl.innerText = "Ingredients";

  const recipeIngredientListEl = document.createElement("ul");

  for (const ingredient of recipe.nutrition.ingredients) {
    const liEl = document.createElement("li");
    liEl.innerText = `${ingredient.name}, ${ingredient.amount}, ${ingredient.unit}`;
    recipeIngredientListEl.append(liEl);
  }

  const recipeMethodTitleEl = document.createElement("h3");
  recipeMethodTitleEl.setAttribute("class", "main-recipe");
  recipeMethodTitleEl.innerText = "Instructions";

  const recipeMethodEl = document.createElement("ul");

  for (const i of recipe.analyzedInstructions[0].steps) {
    const liEl = document.createElement("li");
    liEl.innerText = i.step;
    recipeMethodEl.append(liEl);
  }

  recipeSectionEl.append(
    recipeTitleEl,
    recipeImageEl,
    recipeIngredientsTitleEl,
    recipeIngredientListEl,
    recipeMethodTitleEl,
    recipeMethodEl
  );
}

function isUserFilter() {
  const vegetarian = document.querySelector("#vegetarian").checked;
  console.log(vegetarian);
  state.vegetarian = vegetarian;
  console.log(state.vegetarian);
  const vegan = document.querySelector("#vegan").checked;
  state.vegan = vegan;
}

const favouritesCardEl = document.querySelector(".most-favourite-card");
const mainRecipeSection = document.querySelector(".main-recipe-section");

getUserInput();
