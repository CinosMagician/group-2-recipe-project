let userQuery = "tomato";
let dish = 'pizza';
let userDish = 'pizza';
let userSuburb = 'cabramatta';
let userCountry = 'australia';
// Pseduo Recipies Carousel
let recipeData = [];
let favRecipes = JSON.parse(localStorage.getItem("favourites")) || [];
// This index is for the Pseduo Carousel
let recipeIndex = 0;
let favRecipeIndex = 0;


function getRecipeList(item) {
  let apiRecipeUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${item.replaceAll(' ', '_')}`;
  fetch(apiRecipeUrl)
    .then( function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          generateRecipeData(data);
          return data;
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
};



// Changed the name to match function purpose

function generateRecipeData (data) {
  // Need to empty the DOM HTML elements
  recipeIndex = 0;
  let mealName = '';
  let mealId = 0;
  let mealImage = '';
  recipeData = [];
  // Using a for loop, create buttons that will show recipe name, recipe photo and a list of ingredients.
  for (let i = 0; (i < 5) && (i < data.meals.length); i++) {
    mealName = data.meals[i].strMeal;
    mealId = data.meals[i].idMeal;
    mealImage = data.meals[i].strMealThumb;
    mealObject = {mealName, mealId, mealImage};
    recipeData.push(mealObject);
  }
  displayRecipeData(recipeData, recipeIndex);
  return recipeData;
};

// New function to read the recipies from previous function

function displayRecipeData(recipeData, recipeIndex) {
  console.log(recipeData[recipeIndex]);

  const recipeCardLocation = document.getElementById("recipeCard");
  recipeCardLocation.innerHTML = `
  <h1>${recipeData[recipeIndex].mealName}
    <button class="js-nextbtn-trigger tooltip" data-target="favouriteItem" id="favouriteItem">⭐
      <span class="tooltiptext">Add or Remove From Favourites</span>
    </button>
  </h1>
  <div>
    <button class="button centeredItem js-nextbtn-trigger" data-target="indexLeftButton" id="indexLeftButton"><</button>
    <img src="${recipeData[recipeIndex].mealImage}" id="imageSize">
    <button class="button centeredItem js-nextbtn-trigger" data-target="indexRightButton" id="indexRightButton">></button>
  </div>
  <h2>Ingredients:</h2>
  <ul id="recipeIngredients"></ul>
  `;

  // Button Control for Next and Prev
  (document.querySelectorAll('.js-nextbtn-trigger') || []).forEach(($trigger) => {
    const btn = $trigger.dataset.target;
    $trigger.addEventListener('click', () => {
      if(btn === `favouriteItem`){
        addFav();
      } else {
        indexControl(btn);
      }
    });
  });

  getRecipe(recipeData[recipeIndex].mealId);
  getIngredients(recipeData[recipeIndex].mealId);
};

// Next and Prev Functions
function indexControl(direction){
  if (direction === 'indexRightButton'){
    nextIndex();
  } else if (direction === 'indexLeftButton'){
    prevIndex();
  }
};

function nextIndex(){
  if (recipeIndex === recipeData.length - 1){
    recipeIndex = 0;
  } else {
    recipeIndex++;
  }
  displayRecipeData(recipeData, recipeIndex);
  console.log(recipeIndex);
  console.log(`next`);
};

function prevIndex(){
  if (recipeIndex === 0){
    recipeIndex = recipeData.length - 1;
  } else {
    recipeIndex--;
  }
  displayRecipeData(recipeData, recipeIndex);
  console.log(recipeIndex);
  console.log(`prev`);
};
// End of Next and Prev Functions

// add Fav Function
function addFav(){
  let newFav = recipeData[recipeIndex];
  for (let i = 0; i < favRecipes.length; i++){
    if (newFav.mealName === favRecipes[i].mealName){
      favRecipes.splice(i, 1);
      localStorage.setItem("favourites", JSON.stringify(favRecipes));
      alert(`Removed from Favourites`);
      console.log(`Removed`);
      generateFavouriteRecipiesBtn();
      return;
    }
  }
  favRecipes.push(newFav);
  localStorage.setItem("favourites", JSON.stringify(favRecipes));
  console.log(`Added`);
  alert(`Added to Favourites`);
  generateFavouriteRecipiesBtn();
};
// add Fav Function End

function generateFavouriteRecipiesBtn(){
  const favBtnArea = document.getElementById("favItems");
  favBtnArea.innerHTML = ``;
  for (let i = 0; i < favRecipes.length; i++){
    // const favBtnArea = document.getElementById("favItems");
    let newFavBtn = document.createElement("a");
    newFavBtn.classList.add("button", "js-fav-trigger");
    newFavBtn.setAttribute("role", "button");
    newFavBtn.setAttribute("id", `${favRecipes[i].mealName}`);
    newFavBtn.setAttribute("data-target", `${favRecipes[i].mealName}`);
    newFavBtn.textContent = favRecipes[i].mealName;
    favBtnArea.appendChild(newFavBtn);
  }
  // Button Control
  (document.querySelectorAll('.js-fav-trigger') || []).forEach(($trigger) => {
    const favBtn = $trigger.dataset.target;
    $trigger.addEventListener('click', () => {
      for (let i = 0; i < favRecipes.length; i++){
        if(favBtn === favRecipes[i].mealName){
          console.log(`Found at index:${i}`);
          favRecipeIndex = i;
          displayFavRecipeData(favRecipes, favRecipeIndex);
          return;
        } else {
          console.log(`Not Found at index:${i}`);
        }
      }
    });
  });
};
// Function to generate from the favs list

// Next and Prev Fav Functions
function favIndexControl(direction){
  if (direction === 'indexRightButtonFav'){
    nextFavIndex();
  } else if (direction === 'indexLeftButtonFav'){
    prevFavIndex();
  }
};

function nextFavIndex(){
  if (favRecipeIndex === favRecipes.length - 1){
    favRecipeIndex = 0;
  } else {
    favRecipeIndex++;
  }
  displayFavRecipeData(favRecipes, favRecipeIndex);
  console.log(favRecipeIndex);
  console.log(`next`);
};

function prevFavIndex(){
  if (favRecipeIndex === 0){
    favRecipeIndex = favRecipes.length - 1;
  } else {
    favRecipeIndex--;
  }
  displayFavRecipeData(favRecipes, favRecipeIndex);
  console.log(favRecipeIndex);
  console.log(`prev`);
};
// End of Next and Prev Fav Functions

// Fav in favdata Function
function favAddFav(){
  let newFav = favRecipes[favRecipeIndex];
  for (let i = 0; i < favRecipes.length; i++){
    if (newFav.mealName === favRecipes[i].mealName){
      favRecipes.splice(i, 1);
      localStorage.setItem("favourites", JSON.stringify(favRecipes));
      alert(`Removed from Favourites`);
      console.log(`Removed`);
      generateFavouriteRecipiesBtn();
      // This checks to see if the index is at 0 and also if the length is at 0 to clear all data
      if(favRecipeIndex === 0 && favRecipes.length === 0){
        // Run a function that hides all data, just hard coding everything to be blank for now
        const recipeCardLocation = document.getElementById("recipeCard");
        const ingredientArea = document.getElementById("recipeIngredients");
        const instructionsArea = document.getElementById("instructionsList");
        ingredientArea.innerHTML = ``;
        recipeCardLocation.innerHTML = ``;
        instructionsArea.innerHTML = ``;
        favRecipeIndex = 0;
        console.log(`no items left in fav`);
        console.log(favRecipes, favRecipeIndex);
        return;
        // this checks if the index is 0 but not an empty favRecipies Array
      } else if (favRecipeIndex === 0){
          favRecipeIndex = favRecipes.length - 1;
          displayFavRecipeData(favRecipes, favRecipeIndex);
          console.log(`first item was removed, moving to last item`);
          console.log(favRecipes, favRecipeIndex);
          return;
      } else {
          // Otherwise it will just go to the previous fav item.
          favRecipeIndex = favRecipeIndex - 1;
          displayFavRecipeData(favRecipes, favRecipeIndex);
          console.log(`moving to previous fav item`);
          console.log(favRecipes, favRecipeIndex);
          return;
      }
    }
  }
  favRecipes.push(newFav);
  localStorage.setItem("favourites", JSON.stringify(favRecipes));
  console.log(`Added`);
  alert(`Added to Favourites`);
  generateFavouriteRecipiesBtn();
};
// Fav in favdata Function End


function displayFavRecipeData(favRecipes, favRecipeIndex) {
  console.log(favRecipes[favRecipeIndex]);

  const recipeCardLocation = document.getElementById("recipeCard");
  recipeCardLocation.innerHTML = `
  <h1>${favRecipes[favRecipeIndex].mealName}
    <button class="js-btn-trigger tooltip" data-target="favouriteItem" id="favouriteItem">⭐
      <span class="tooltiptext">Add or Remove From Favourites</span>
    </button>
  </h1>
  <div>
    <button class="button centeredItem js-btn-trigger" data-target="indexLeftButtonFav" id="indexLeftButtonFav"><</button>
    <img src="${favRecipes[favRecipeIndex].mealImage}" id="imageSize">
    <button class="button centeredItem js-btn-trigger" data-target="indexRightButtonFav" id="indexRightButtonFav">></button>
  </div>
  <h2>Ingredients:</h2>
  <ul id="recipeIngredients"></ul>
  `;

  // Button Control for Next and Prev
  (document.querySelectorAll('.js-btn-trigger') || []).forEach(($trigger) => {
    const btn = $trigger.dataset.target;
    $trigger.addEventListener('click', () => {
      if(btn === `favouriteItem`){
        favAddFav();
      } else {
        favIndexControl(btn);
      }
    });
  });

  getRecipe(favRecipes[favRecipeIndex].mealId);
  getIngredients(favRecipes[favRecipeIndex].mealId);
};
// Function to generate from the favs list
// Function to generate from the favs list
// Function to generate from the favs list
// Function to generate from the favs list


function getIngredients (mealId) {
  let apiRecipeIdUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  let ingredientsList = [];
  fetch(apiRecipeIdUrl)
    .then( function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          for (let i = 1; i <= 20; i++) {
            if (data.meals[0][`strIngredient${i}`] === '') {
              break;
            } else {
              ingredientsList.push(data.meals[0][`strMeasure${i}`] + ' ' + data.meals[0][`strIngredient${i}`]);
            }
          }

          // New Code
          const ingredientArea = document.getElementById("recipeIngredients");
          for (let instruction = 0; instruction < ingredientsList.length; instruction++){
            const instructionItem = document.createElement('li');
            instructionItem.classList.add("has-text-left");
            instructionItem.textContent = ingredientsList[instruction];
            ingredientArea.appendChild(instructionItem);
          }
          // New Code

          console.log(ingredientsList);
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
};

function getRecipe (mealId) {
  let apiRecipeIdUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  fetch(apiRecipeIdUrl)
    .then( function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data.meals[0].strInstructions);

          // Code for placing the instructions on the page
          const instructionsArea = document.getElementById("instructionsList");
          if (instructionsArea) {
            instructionsArea.innerHTML = '';

            let splitLines = data.meals[0].strInstructions.match(/[^\r\n]+/g);
            for (const line of splitLines) {
              console.log(line);
              const listItem = document.createElement('li');
              listItem.classList.add("has-text-left");
              listItem.textContent = line;
              instructionsArea.appendChild(listItem);
            }
          } else {
            console.error("Element with ID 'instructionsList' not found.");

          }
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
  };

// Manual Function calls
// getRecipeList(userQuery);
generateFavouriteRecipiesBtn();


// TEST FUNCTION REMOVE LATER
(document.querySelectorAll('.js-test-trigger') || []).forEach(($trigger) => {
  const testing = $trigger.dataset.target;
  $trigger.addEventListener('click', () => {
    getRecipeList(userQuery);
  });
});
// TEST FUNCTION REMOVE LATER

function userRestaurantInquiry (dish, suburb, country) {
// Mimi struggled with reading the documentation and asked Frank Fu for assistance
  request = {
    textQuery: `${dish} in ${suburb} ${country})`,
    fields: ["displayName", "businessStatus", 'formattedAddress', 'photos'],
    includedType: "restaurant",
    isOpenNow: true,
    language: "en-US",
    maxResultCount: 5,
    minRating: 3.5,

    useStrictTypeFiltering: false,
  };
  //@ts-ignore

  let placeDetails;

  var doSomething = async function () {
    const { Place } = await google.maps.importLibrary("places");
    const { places } = await Place.searchByText(request);
    console.log(places);
    for (const place of places) {
      placeDetails = [place.Fg.displayName, place.Fg.formattedAddress];
      console.log(placeDetails);
    }
  };

  doSomething();
};


userRestaurantInquiry(userDish, userSuburb, userCountry);

// modal scripts
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      if(event.key === "Escape") {
        closeAllModals();
      }
    });
});





