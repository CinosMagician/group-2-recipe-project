let userQuery = "tomato";
let dish = 'pizza';
let userDish = 'pizza';
let userSuburb = 'cabramatta';
let userCountry = 'australia';


function getRecipeList(item) {
  let apiRecipeUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${item.replaceAll(' ', '_')}`;
  fetch(apiRecipeUrl)
    .then( function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayRecipeOptions(data);
          return data;
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
};

function displayRecipeOptions (data) {
  // Need to empty the DOM HTML elements
  let mealName = '';
  let mealId = 0;
  let mealImage = '';
  // Using a for loop, create buttons that will show recipe name, recipe photo and a list of ingredients.
  for (let i = 0; (i < 5) && (i < data.meals.length); i++) {
    mealName = data.meals[i].strMeal;
    mealId = data.meals[i].idMeal;
    mealImage = data.meals[i].strMealThumb;
    console.log(`${mealId} ${mealName} ${mealImage}`);
  }
};

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

function displayRecipeOptions (data) {
  // Need to empty the DOM HTML elements
  let mealName = '';
  let mealId = 0;
  let mealImage = '';
  // Using a for loop, create buttons that will show recipe name, recipe photo and a list of ingredients.
  for (let i = 0; (i < 5) && (i < data.meals.length); i++) {
    mealName = data.meals[i].strMeal;
    mealId = data.meals[i].idMeal;
    mealImage = data.meals[i].strMealThumb;
    console.log(`${mealId} ${mealName} ${mealImage}`);
  }
};

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
          console.log(ingredientsList);
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
};

getRecipeList(userQuery);

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
