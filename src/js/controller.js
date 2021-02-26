// import icons from '../img/icons.svg';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import receipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'regenerator-runtime/runtime';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    receipeView.renderSpinner();

    // 0) Update results view for displaying active container
    resultsView.update(model.getSearchResultsPage());

    // Updating bookmarksview
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id);

    // rendering recipe
    receipeView.render(model.state.recipe);
  } catch (err) {
    receipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load serach results
    await model.loadSearchResults(query);
    // resultsView.render(model.state.search.results);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // Render Pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new  Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the view
  // receipeView.render(model.state.recipe);
  receipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // ADD or Remoove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  receipeView.update(model.state.recipe);

  //Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    receipeView.render(model.state.recipe);

    //Render Success Message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change id url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close Form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`${err} 💥`);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  receipeView.addhandlerRender(controlRecipes);
  receipeView.addhandlerUpdateServings(controlServings);
  receipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addhandlerUpload(controlAddRecipe);
};

init();
