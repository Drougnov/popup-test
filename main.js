const header = document.querySelector(".header");
// store the timeout ID as variable
let timeoutId;

// Add an event listener for the custom 'popupOpened' event
document.addEventListener("popupOpened", function (e) {
    if (e.detail && e.detail.target) {
        // Add 'nav-active' class to header if header exist and the target equals '#header-popup'
        if (header && e.detail.target === "#header-popup") {
            header.classList.add("nav-active");
        }

        // Clear the previous timeout if it exists
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const popup = document.querySelector(`${e.detail.target}`); // popup overlay (.DukSh)
        const popupElementsContainer = popup.querySelector(".ExGby"); // popup container

        // Set a new setTimeout function
        timeoutId = setTimeout(() => {
            // get container's visible height
            const popupElementsContainerHeight =
                popupElementsContainer.offsetHeight;

            // get container's actual (scrollable) height
            const popupElementsHeight = popupElementsContainer.scrollHeight;

            console.log(popupElementsContainerHeight, popupElementsHeight);

            // Check if the content's actual height is greater than container's visible height
            if (popupElementsHeight > popupElementsContainerHeight) {
                // if yes, add the class
                popup.classList.add("exceeded");
            } else {
                // check if the class already exist
                if (popup.classList.contains("exceeded")) {
                    // if yes, remove the class
                    popup.classList.remove("exceeded");
                }
            }
        }, 100);
    }
});

// Add an event listener for the custom 'popupClosed' event
document.addEventListener("popupClosed", function (e) {
    if (e.detail && e.detail.target) {
        // Remove 'nav-active' class to header if header exist and the target equals '#header-popup'
        if (header && e.detail.target === "header-popup") {
            header.classList.remove("nav-active");
        }
    }
});
