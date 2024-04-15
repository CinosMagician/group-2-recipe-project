let userSearchOption = 'ingredient'
let userQuery = "tomato";

function getFood(item) {
    let apiRecipeUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?`;
    if (userSearchOption === 'ingredient') {
        apiRecipeUrl += `i=${item}`;
    } else {
        apiRecipeUrl += `s=${item}`;
    }
    console.log(apiRecipeUrl);
    fetch(apiRecipeUrl)
        .then( function (response) {
            if (response.ok) {
                console.log(response.json());
                    } else {
                        alert(`Error: ${response.statusText}`);
                    }
        })
}

getFood(userQuery);

const request = {
  textQuery: "pizza in sydney australia",
  fields: ["displayName", "businessStatus", 'formattedAddress', 'photos'],
  includedType: "restaurant",
  isOpenNow: true,
  language: "en-US",
  maxResultCount: 5,
  minRating: 3.2,
  region: "us",
  useStrictTypeFiltering: false,
};
//@ts-ignore

var doSomething = async function () {
  const { Place } = await google.maps.importLibrary("places");
  const { places } = await Place.searchByText(request);
  console.log(places);
};

doSomething();

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
