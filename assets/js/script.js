const restaurantDiv = document.getElementById('restaurant-display');
const recipeDiv = document.getElementById('recipe-display');
const dishForm = document.getElementById('dish-form');
const userDish = document.getElementById('dish');
const userSuburb = document.getElementById('suburb');
const userCountry = document.getElementById('country');
const restOptEl = document.getElementById('restaurant-options');
const restDetsEl = document.getElementById('restaurant-details');
const restFavEl = document.getElementById('restaurant-favs');
const userQuery = document.getElementById('ingredient');
const recipeCardLocation = document.getElementById("recipeCard");
const ingredientArea = document.getElementById("recipeIngredients");
const instructionsArea = document.getElementById("instructionsList");
const ingredientForm = document.getElementById("ingredient-form");
let restFavs = JSON.parse(localStorage.getItem('restFavsList')) || [];
let currentRest;
let restOpts;

// Pseduo Recipies Carousel
let recipeData = [];
let favRecipes = JSON.parse(localStorage.getItem("favourites")) || [];
// This index is for the Pseduo Carousel
let recipeIndex = 0;
let favRecipeIndex = 0;

ingredientForm.addEventListener('click', function () { // Looks for when the form is submitted
  restaurantDiv.classList.add('is-hidden');
  recipeDiv.classList.remove('is-hidden'); // do not need to add an if statement as  it will not add the class if it already exists
  if (userQuery.value === '') {
    alert('Please make sure you enter an ingredient'); //If users leave the inquiries blank, it will alert the user and end the function
    return;
  }
  // ingredientArea.innerHTML = ``;
  // recipeCardLocation.innerHTML = ``;
  instructionsArea.innerHTML = ``;
  getRecipeList(userQuery.value); //run the function to display the restaurant options
  userQuery.value = ''; // empty the form elements
});

function userRestaurantInquiry (dish, suburb, country) {
  request = { // Mimi struggled with reading the documentation and asked Frank Fu for assistance
    textQuery: `${dish} in ${suburb} ${country})`,
    fields: ["displayName", "businessStatus", 'formattedAddress', 'rating', 'priceLevel'],
    includedType: "restaurant",
    isOpenNow: true,
    language: "en-US",
    maxResultCount: 10,
    minRating: 3.5,
    useStrictTypeFiltering: false,
  };
  let placeDetails;
  restOpts = [];
  var retrieveRestaurantData = async function () {
    const { Place } = await google.maps.importLibrary("places");
    const { places } = await Place.searchByText(request);
    for (const place of places) {
      placeDetails = {
        name: place.Fg.displayName,
        address: place.Fg.formattedAddress, 
        status: place.Fg.businessStatus,
        price: place.Fg.priceLevel,
        rating: place.Fg.rating
      };
      restOpts.push(placeDetails);
      restaurantButton(placeDetails);
    }
  };
  retrieveRestaurantData();
};

function restaurantButton (place) { // Create a button with Bulma classes and append it to the restaurant-options element.
  const buttonEl = document.createElement('button');
  buttonEl.textContent = place.name;
  buttonEl.classList = 'button is-centered favButton';
  buttonEl.setAttribute('restaurant-name', place.name.replaceAll(' ', ''));
  restOptEl.appendChild(buttonEl);
}

function checkRestFav(placeName) { //**** */
  return restFavs.some(function(obj) {
    return obj.name.includes(placeName);
  })
} //**** */

function showRestaurantDetails (place) { // PRINT RESTAURANT DETAILS
  currentRest = place;
  restDetsEl.innerHTML = '';
  const buttonEl = document.createElement('button'), buttonI = document.createElement('i'), nameEl = document.createElement('h2'), addEl = document.createElement('p'), addInt = document.createElement('strong'), addDets = document.createElement('span'), statEl = document.createElement('p'), statInt = document.createElement('strong'), statDets = document.createElement('span'), rateEl = document.createElement('p'), rateInt = document.createElement('strong'), rateDets = document.createElement('span');
  if (checkRestFav(place.name)) { //**** */
    buttonI.classList = 'fas fa-star';
    buttonEl.classList = 'button is-rounded is-centered has-text-warning favourited';
  } else if (!checkRestFav(place.name)) { 
    buttonI.classList = 'far fa-star';
    buttonEl.classList = 'button is-rounded is-centered has-text-warning not-favourited';
  } //**** */
  buttonEl.appendChild(buttonI);
  nameEl.textContent = place.name;
  addInt.textContent = 'Address: ';
  addDets.textContent = place.address;
  addEl.append(addInt, addDets);
  statInt.textContent = 'Status: ';
  statDets.textContent = place.status.toLowerCase();
  statEl.append(statInt, statDets);
  rateInt.textContent = 'Rating: ';
  rateDets.textContent = place.rating;
  rateEl.append(rateInt, rateDets);
  restDetsEl.append(nameEl, buttonEl, addEl, statEl, rateEl);
  if (place.price !== null) {
    const priceEl = document.createElement('p'), priceInt = document.createElement('strong'), priceDets = document.createElement('span');
    priceInt.textContent = 'Affordability: ';
    priceDets.textContent = place.price.toLowerCase();
    priceEl.append(priceInt, priceDets);
    restDetsEl.appendChild(priceEl);
    }
}

function renderRestFavBtns () {
  restFavEl.innerHTML = '';
  for (const place of restFavs) {
    const buttonEl = document.createElement('button');
    buttonEl.textContent = place.name;
    buttonEl.classList = 'button is-centered favButton';
    buttonEl.setAttribute('restaurant-name', place.name.replaceAll(' ', ''));
    restFavEl.appendChild(buttonEl);
  }
}

function addRestFav (place) { // Create a button with Bulma classes and append it to the restaurant-options element.
  restFavs.push(place);
  localStorage.setItem('restFavsList', JSON.stringify(restFavs));
  renderRestFavBtns();
}

function removeRestFav (place) {
  for (let i = 0; i < restFavs.length; i++) {
    if (place.name.replaceAll(' ', '') === restFavs[i].name.replaceAll(' ', '')) {
      restFavs.splice(i, 1);
    }
  }
  localStorage.setItem('restFavsList', JSON.stringify(restFavs));
  renderRestFavBtns();
}

renderRestFavBtns();

dishForm.addEventListener('click', function () { // Looks for when the form is submitted
  restaurantDiv.classList.remove('is-hidden');
  recipeDiv.classList.add('is-hidden'); // do not need to add an if statement as  it will not add the class if it already exists
  if (userDish.value === '' || userSuburb.value === '' || userCountry.value === '') {
    alert('Please make sure all fields are filled'); //If users leave the inquiries blank, it will alert the user and end the function
    return;
  }
  restOptEl.innerHTML = ''; //empty the html elemenets
  restDetsEl.innerHTML = '';
  userRestaurantInquiry(userDish.value, userSuburb.value, userCountry.value); //run the function to display the restaurant options
  userDish.value = ''; // empty the form elements
  userSuburb.value = '';
  userCountry.value = '';
})

restOptEl.addEventListener('click', function (event) {
  if (event.target.classList.contains('button')) { // look for when the restaurant buttons are pressed
    const restName = event.target.getAttribute('restaurant-name');
    for (let i = 0; i < restOpts.length; i++) {
      if (restOpts[i].name.replaceAll(' ', '') === restName) {
        showRestaurantDetails(restOpts[i]); // it will show the specific restaurant
      }
    }
  }
})

restFavEl.addEventListener('click', function (event) {
  if (event.target.classList.contains('button')) { // look for when the restaurant buttons are pressed
    const restName = event.target.getAttribute('restaurant-name');
    for (let i = 0; i < restFavs.length; i++) {
      if (restFavs[i].name.replaceAll(' ', '') === restName) {
        showRestaurantDetails(restFavs[i]); // it will show the specific restaurant
      }
    }
  }
})

restDetsEl.addEventListener('click', function (event) { // add to favourites
  if (event.target.classList.contains('not-favourited')||event.target.classList.contains('far')) { // look for when the restaurant buttons are pressed
    addRestFav(currentRest); // it will show the specific restaurant
    showRestaurantDetails(currentRest);
  } else if (event.target.classList.contains('favourited')||event.target.classList.contains('fas')) {
    removeRestFav(currentRest); // it will show the specific restaurant
    showRestaurantDetails(currentRest);
  }
})


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
    newFavBtn.classList.add("button", "favButton", "js-fav-trigger");
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