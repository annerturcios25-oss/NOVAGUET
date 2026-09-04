document.addEventListener("DOMContentLoaded", () => {

  const boton = document.querySelector(".hero button");

  boton.addEventListener("click", () => {

    document.querySelector(".products").scrollIntoView({

      behavior: "smooth"

    });

  });

});
const searchButton = document.getElementById("searchButton");

const searchBox = document.getElementById("searchBox");

const closeSearch = document.getElementById("closeSearch");

searchButton.addEventListener("click", () => {

  searchBox.classList.toggle("active");

});

closeSearch.addEventListener("click", () => {

  searchBox.classList.remove("active");

});
const cartButton = document.getElementById("cartButton");

const cartBox = document.getElementById("cartBox");

const closeCart = document.getElementById("closeCart");

cartButton.addEventListener("click", () => {

  cartBox.classList.add("active");

});

closeCart.addEventListener("click", () => {

  cartBox.classList.remove("active");

});
function changeLanguage(language) {

    document.documentElement.lang = language;

    document.querySelectorAll("[data-es][data-en]").forEach(element => {

        if (language === "en") {

            element.textContent = element.getAttribute("data-en");

        } else {

            element.textContent = element.getAttribute("data-es");

        }

    });

}