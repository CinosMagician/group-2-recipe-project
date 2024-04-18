const restaurantDiv = document.getElementById('restaurant-display');
const dishForm = document.getElementById('dish-form');
const userDish = document.getElementById('dish');
const userSuburb = document.getElementById('suburb');
const userCountry = document.getElementById('country');
const restOptEl = document.getElementById('restaurant-options');
const restDetsEl = document.getElementById('restaurant-details');
const restFavEl = document.getElementById('restaurant-favs');
let restFavs = JSON.parse(localStorage.getItem('restFavsList')) || [];
let currentRest;
let restOpts;

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
  const buttonDiv = document.createElement('div'), buttonEl = document.createElement('button');
  buttonDiv.classList = 'field';
  buttonEl.textContent = place.name;
  buttonEl.classList = 'button is-centered';
  buttonEl.setAttribute('restaurant-name', place.name.replaceAll(' ', ''));
  restOptEl.appendChild(buttonDiv).appendChild(buttonEl);
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
    const buttonDiv = document.createElement('div'), buttonEl = document.createElement('button');
    buttonDiv.classList = 'field';
    buttonEl.textContent = place.name;
    buttonEl.classList = 'button is-centered';
    buttonEl.setAttribute('restaurant-name', place.name.replaceAll(' ', ''));
    restFavEl.appendChild(buttonDiv).appendChild(buttonEl);
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
