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
    <button class="js-btn-trigger tooltip" data-target="favouriteItem" id="favouriteItem">⭐
      <span class="tooltiptext">Add or Remove From Favourites</span>
    </button>
  </h1>
  <div>
    <button class="button centeredItem js-btn-trigger" data-target="indexLeftButton" id="indexLeftButton"><</button>
    <img src="${recipeData[recipeIndex].mealImage}" id="imageSize">
    <button class="button centeredItem js-btn-trigger" data-target="indexRightButton" id="indexRightButton">></button>
  </div>
  <h2>Ingredients:</h2>
  <ul id="recipeIngredients"></ul>
  `;

  // Button Control for Next and Prev
  (document.querySelectorAll('.js-btn-trigger') || []).forEach(($trigger) => {
    const btn = $trigger.dataset.target;
    $trigger.addEventListener('click', () => {
      indexControl(btn);
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
  if (recipeIndex === 4 || recipeIndex === recipeData.length){
    recipeIndex = 0;
  } else {
    recipeIndex++;
  }
  displayRecipeData(recipeData, recipeIndex);
  console.log(recipeIndex);
  console.log(`next`);
};

function prevIndex(){
  if (recipeIndex === 0 && recipeData.length === 5){
    recipeIndex = 4;
  } else {
    recipeIndex--;
  }
  displayRecipeData(recipeData, recipeIndex);
  console.log(recipeIndex);
  console.log(`prev`);
};

// End of Next and Prev Functions


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





