document.getElementById("open-modal-button").onclick = function () {
    document.getElementById("review-modal").style.display = "block";
  };
  
  var modal = document.getElementById("review-modal");
  
  var span = document.getElementsByClassName("close-button")[0];
  
  span.onclick = function () {
    modal.style.display = "none";
  };
  
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  
  var stars = document.querySelectorAll(".stars img");
  var ratingInput = document.getElementById("rating");
  
  stars.forEach(function (star, index) {
    star.addEventListener("click", function () {
      ratingInput.value = index + 1;
      updateStars(index + 1);
    });
  
    star.addEventListener("mouseover", function () {
      updateStars(index + 1);
    });
  
    star.addEventListener("mouseout", function () {
      updateStars(ratingInput.value);
    });
  });
  
  function updateStars(rating) {
    stars.forEach(function (star, index) {
      if (index < rating) {
        star.src = "./assets/star.png";
      } else {
        star.src = "./assets/star-off.png";
      }
    });
  }
  