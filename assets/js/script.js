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

// function getRestaurant(dish, suburb, country) {
//     let location = encodeURIComponent(suburb + ' ' + country)
//     console.log(location);
//     let apiRestaurantUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${dish}%20restaurant%20in%20${location}&key=AIzaSyAi3zf-pBvF0jpkEuRsq48SEsOGGl3dYBI`
//     console.log(apiRestaurantUrl);
//     fetch(apiRestaurantUrl)
//         .then( function (response) {
//             if (response.ok) {
//                 console.log(response.json());
//                     } else {
//                         alert(`Error: ${response.statusText}`);
//                     }
//         })
// }

// let map;
// let service;
// let infowindow;

// function initMap() {
//   const sydney = new google.maps.LatLng(-33.867, 151.195);

//   infowindow = new google.maps.InfoWindow();
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: sydney,
//     zoom: 15,
//   });

//   const request = {
//     query: "Museum of Contemporary Art Australia",
//     fields: ["name", "geometry"],
//   };

//   service = new google.maps.places.PlacesService(map);
//   service.findPlaceFromQuery(request, (results, status) => {
//     if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//       for (let i = 0; i < results.length; i++) {
//         createMarker(results[i]);
//       }

//       map.setCenter(results[0].geometry.location);
//     }
//   });
// }

// function createMarker(place) {
//   if (!place.geometry || !place.geometry.location) return;

//   const marker = new google.maps.Marker({
//     map,
//     position: place.geometry.location,
//   });

//   google.maps.event.addListener(marker, "click", () => {
//     infowindow.setContent(place.name || "");
//     infowindow.open(map);
//   });
// }

// window.initMap = initMap;

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
