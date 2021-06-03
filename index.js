let state = {
  recipes: [],
  mostfavourite: [],
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
    alt: "heart",
  });

  heartEl.addEventListener("click", function () {
    const findRecipeId = state.mostfavourite.find(
      (favRecipe) => favRecipe.id === recipe.id
    );
    if (findRecipeId) {
      updateLikes()
      setState({
        mostfavourite: state.mostfavourite.map(function (item) {
          if (item.id === recipe.id) {
            return {...item, likes: item.likes + 1 };
          } else {
            return item;
          }
        }),
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
            mostfavourite: [...state.mostfavourite, { ...recipe, likes: 1 }],
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
  return fetch("http://localhost:3000/mostfavourite", {
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

function mostFavouriteCard() {
  mostFavouriteCardEl.style.display = "grid";
  const divEl = document.querySelector(".most-favourite-card");
  divEl.innerHTML = "";
  const contentSection = createElm("div", { className: "content-section" });
  const imgEl = createElm("img", {
    className: "food-image",
    src: state.mostfavourite[0].image,
    alt: state.mostfavourite[0].title,
  });
  const h3El = createElm("h3", {
    className: "favourite-h3",
    innerText: state.mostfavourite[0].title,
  });
  h3El.classList.add("color-blue");
  const buttonEl = createElm("a", {
    href: "#",
    className: "button-favourite",
    innerText: "RECIPE",
  });
  contentSection.append(imgEl, h3El, buttonEl);
  divEl.append(contentSection);
}

function render() {
  renderRecipeCardList();

  mostFavouriteCard();
}

function createElm(tag, attobj) {
  const elm = document.createElement(tag);
  for (const key of Object.keys(attobj)) {
    elm[key] = attobj[key];
  }
  return elm;
}

function updateLikes() {

  fetch(`http://http://localhost:3000/favourites${recipe.id}`, {

  method: 'PATCH',
  headers: {
    "content-type": "application/json"
  },
  body: stringify({likes: likes})
  })
}

getUserInput();

const mostFavouriteCardEl = document.querySelector(".most-favourite-card");
mostFavouriteCardEl.style.display = "none";
