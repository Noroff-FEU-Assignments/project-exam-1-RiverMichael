import { getFeaturedPosts, renderFeaturedPosts } from "./components/render.js";
import { clearHtml, createSubscribeValidationHtml } from "./components/createHtml.js";
import { createMessage } from "./components/createMessage.js";
import { validateEmail } from "./components/formValidation.js";
import { openModal, closeModal } from "./components/modal.js";

const featuredContainer = document.querySelector(".carousel-inner");
const nextButton = document.querySelector(".arrow-right");
const prevButton = document.querySelector(".arrow-left");
const subscribeContainer = document.querySelector(".subscribe-container");
const subscribeButton = document.querySelector("#subscribe-button");
const modalOverlay = document.querySelector(".modal-overlay");
const subscribeClose = document.querySelector(".icon-close");
const form = document.querySelector("#signup-form");
const email = document.querySelector("#signup-email");
const emailError = document.querySelector("#email-error");

let slideWidth = 0;
let currentPosition = 0;
let maxScroll = 0;

nextButton.addEventListener("click", slideRight);
prevButton.addEventListener("click", slideLeft);

subscribeButton.addEventListener("click", () => openModal(subscribeContainer, modalOverlay));
modalOverlay.addEventListener("click", () => closeModal(subscribeContainer, modalOverlay));
subscribeClose.addEventListener("click", () => closeModal(subscribeContainer, modalOverlay));
form.addEventListener("click", subscribeValidation);

async function featuredPosts() {
    try {
        const posts = await getFeaturedPosts();
        clearHtml(featuredContainer);
        renderFeaturedPosts(posts, featuredContainer); 

        if (window.innerWidth >= 1200) {
            slideWidth = featuredContainer.offsetWidth + 10;
        } else {
            slideWidth = featuredContainer.offsetWidth + 20;
        }

        maxScroll = featuredContainer.scrollWidth - featuredContainer.offsetWidth;
    }
    catch (error) {
        console.log(error);
        clearHtml(featuredContainer);
        createMessage(featuredContainer, "error", "There was an error while loading the posts, please try again");
    }
};
featuredPosts();

// Show Next/Previous Posts
function slideRight() {
    currentPosition += slideWidth;
    featuredContainer.scrollLeft += slideWidth;
    toggleCarouselButtons();
};

function slideLeft() {
    currentPosition -= slideWidth;
    featuredContainer.scrollLeft -= slideWidth;
    toggleCarouselButtons();
};

// Toggle Carousel Buttons
function toggleCarouselButtons() {
    if (currentPosition >= maxScroll) {
        nextButton.style.opacity = 0.1;
        nextButton.disabled = "true";
    } else {
        nextButton.style.opacity = 1;
        nextButton.disabled = "";
    }

    if (!currentPosition) {
        prevButton.style.opacity = 0.1;
        prevButton.disabled = "true";
    } else {
        prevButton.style.opacity = 1;
        prevButton.disabled = "";
    }
};

// Subscribe Validation
function subscribeValidation(event) {
    event.preventDefault();
    if (validateEmail(email, email.value, emailError)) {
        clearHtml(subscribeContainer);
        createSubscribeValidationHtml(subscribeContainer);
    };
};
