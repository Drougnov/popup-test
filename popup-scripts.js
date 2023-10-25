// set global popup-time-delay variable
var popupTimeDelay;

function initiate_popup(args) {
    // Extract the arguments
    const target = args.target || false;
    const overlayColor = args.overlay_color || false;
    const popupType = args.popup_type || "default"; // fallback value = "default"
    const popupSpaceFromTop = args.popup_top_space || 60; // fallback value = "60px"
    // update popup-time-delay variable based on argument value
    popupTimeDelay = args.popup_time_delay || 0; // fallback value = "0s"

    // If target is not provided, return
    if (!target) {
        return false;
    }

    const targetElement = document.querySelector(target);

    if (!targetElement) return;

    // Set overlay background color if provided
    if (overlayColor) {
        targetElement.style.backgroundColor = overlayColor;
    }

    // Add classes based on the popup type
    if (popupType !== "default") {
        // Add the type class to the target element
        targetElement.classList.add(popupType);

        if (popupType === "force-slidein-popup") {
            targetElement.classList.add("slidein-popup", "force-slide-in");
        }

        if (popupType === "cookie-popup") {
            // Additional handling for cookie popups
            const cookieName = args.cookie_name || "example_cookie";
            const cookieExpiration =
                args.cookie_expiration || "Fri, 31 Dec 9999 23:59:59 GMT";

            const confirmButton = targetElement.querySelector(
                "#confirmCookieButton"
            );
            const exitButton = targetElement.querySelector("#exitCookieButton");

            // on click of confirm set cookie
            confirmButton.addEventListener("click", () => {
                document.cookie = `${cookieName}=true; expires=${cookieExpiration}; path=/`;

                // Check if the cookie is set
                if (document.cookie.indexOf(`${cookieName}=true`) > -1) {
                    // If the cookie is set, close the popup
                    closePopup(targetElement, popupTimeDelay);
                }
            });

            // on click of exit direct to google
            exitButton.addEventListener("click", () => {
                window.location.href = "about:blank";
            });
        }
    }

    // if prevent close is true
    if (args.prevent_close === true) {
        // Add a class to prevent closing the popup
        targetElement.classList.add("prevent-close");
    }

    // pass popupSpaceFromTop's value as css variable
    targetElement.style.setProperty('--popup-space-from-top', popupSpaceFromTop + 'px');

    // Fade in the popup
    openPopup(targetElement, popupTimeDelay);

    // Create and dispatch a custom event when the popup opens
    var popupOpenedEvent = new CustomEvent("popupOpened", {
        detail: { target: target },
    });
    document.dispatchEvent(popupOpenedEvent);

    // set dragging state as false by default
    let isDragging = false;

    // set dragging state to true if dragging start
    targetElement.addEventListener("mousedown", function (e) {
        isDragging = true;
    });

    // set dragging state to false if dragging end
    targetElement.addEventListener("mouseup", function (e) {
        isDragging = false;
    });


    // Close the popup when clicking on the overlay
    targetElement.addEventListener("click", function (e) {
        // prevent popup from closing if has the class 'prevent-close'
        if (targetElement.classList.contains("prevent-close")) {
            return;
        }
        
        // if the user is currently not dragging
        if (!isDragging) {
            if (
                e.target.classList.contains("DuKSh") ||
                e.target.classList.contains("AYaOY")
            ) {
                // Check if the clicked element has the class "DuKSh" or "AYaOY"
                closePopup(targetElement, popupTimeDelay);
                targetElement.classList.remove("opened");
            } else if (e.target.closest(".DuKSh") || e.target.closest(".AYaOY")) {
                // Check if a parent of the clicked element has the class "DuKSh" or "AYaOY"
                e.stopPropagation(); // Prevent the click event from propagating to the parent div
            }
        }
    });

    // Close the popup when clicking on elements with class 'AYaOY(close buttons)'
    const closeButtonElements = targetElement.querySelectorAll(`.AYaOY`);
    closeButtonElements.forEach(function (element) {
        element.addEventListener("click", function () {
            // prevent popup from closing if has the class 'prevent-close'
            if (targetElement.classList.contains("prevent-close")) {
                return;
            }
            closePopup(element.closest(".DuKSh"), popupTimeDelay);
        });
    });
}

function openPopup(element, popupTimeDelay = 0) { // delay time = 0s by default
    setTimeout(() => {
        // Fade in the popup by adding 'gsCWf(display flex)' and 'opened' class
        element.classList.add("gsCWf");
        element.classList.add("opened");

        // if the popup is slidein/force-slidein, don't change style
        if (element.classList.contains("slidein-popup")) {
            return;
        }

        // check if popup should be centered based on height
        checkInnerWrapperHeight(element);

        // check if popup is scrollable
        checkPopupIsScrollable(element);

        // disable scrolling if popup opens
        document.body.style.overflow = "hidden";
    }, popupTimeDelay * 1000); // conver delay from milliseconds to seconds
}

function closePopup(element, popupTimeDelay = 0) { // delay time = 0s by default
    setTimeout(() => {
        // Fade out the popup by removing 'gsCWf(display flex)' and 'opened' class
        element.classList.remove("gsCWf");
        element.classList.remove("opened");

        // Create and dispatch a custom event when the popup closes
        var popupClosedEvent = new CustomEvent("popupClosed", {
            detail: { target: element.id },
        });
        document.dispatchEvent(popupClosedEvent);

        // if the popup is slidein/force-slidein, don't change style
        if (element.classList.contains("slidein-popup")) {
            return;
        }

        // enable scrolling if popup closed
        document.body.style.overflow = "auto";
    }, popupTimeDelay * 1000); // conver delay from milliseconds to seconds
}

// close popups manually when 'prevent_close' argument value is true
function closePopupManually() {
    // get the popup with the class 'prevent-close'
    const openedPopup = document.querySelector(".prevent-close");

    // if exist, close it
    if (openedPopup) {
        closePopup(openedPopup, popupTimeDelay);
    }
}

function checkInnerWrapperHeight(element){
    // get the popup's inner wrapper(GodhZ)
    const innerWrapper = element.querySelector(".GodhZ");
    // get the popup inner wrapper's height
    const innerWrapperHeight = innerWrapper.offsetHeight;
    console.log(innerWrapperHeight, window.innerHeight)

    // if inner wrapper's height is less than 100vh, add class to center it
    if (window.innerHeight > innerWrapperHeight) {
        innerWrapper.classList.add("centered");
    } else {
        // else remove the class if exist
        if (innerWrapper.classList.contains("centered")) {
            innerWrapper.classList.remove("centered");
        }
    }
}

function checkPopupIsScrollable(element){
    // get the popup content's container (ExGby);
    const popupContentContainer = element.querySelector('.ExGby');
    const contentHeight = popupContentContainer.scrollHeight; // popup contents height
    const actualHeight = popupContentContainer.offsetHeight;  // popup content's container height
    console.log(contentHeight, actualHeight);

    if (contentHeight > actualHeight) {
        // if content is greater than container's height
        alert('popup is scrollable')
        console.log("Content is greater than height.");
    } else {
        // else
        console.log("Content is not greater than height.");
    }
}

// -------------------------------------------------------handle single menu dropdown-----------------------------------------------------------

function singleMenu() {
    // Find all elements with the class 'target-id-button'
    const targetElements = document.querySelectorAll(".target-id-button");

    // Create a map to associate target elements with menu elements based on data attributes
    const targetMenuMap = new Map();

    // Populate the map based on data attributes
    targetElements.forEach((targetElement) => {
        // Get the data-target attribute value from the target element
        const targetDataTarget = targetElement.getAttribute("data-target");

        // Find the associated menu element using the data-menu attribute
        const associatedMenu = document.querySelector(
            `[data-menu="${targetDataTarget}"]`
        );

        // If an associated menu element is found, add it to the map
        if (associatedMenu) {
            targetMenuMap.set(targetElement, associatedMenu);
        }
    });

    // Iterate through target elements and handle click events
    targetElements.forEach((targetElement) => {
        const associatedMenu = targetMenuMap.get(targetElement);
        if (!associatedMenu) return;

        let show = false;

        // Toggle the visibility of the associated menu when the target element is clicked
        targetElement.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent this click event from propagating to the document click handler
            show = !show;

            // Show or hide the associated menu based on the 'show' flag
            if (show) {
                associatedMenu.style.display = "block";
                targetElement.classList.add("active");
            } else {
                associatedMenu.style.display = "none";
                targetElement.classList.remove("active");
            }
        });
    });

    document.addEventListener("click", (event) => {
        targetMenuMap.forEach((menu, targetElement) => {
            if (
                !targetElement.contains(event.target) &&
                !menu.contains(event.target)
            ) {
                // Hide the menu and remove the 'active' class
                menu.style.display = "none";
                targetElement.classList.remove("active");

                // Reset the 'show' state to false
                show = false;
            }
        });
    });

    // Check the position of containers to determine if menus should be aligned to the right
    const dropdownContainers = document.querySelectorAll(".target-id");

    // Iterate through each 'target-id' container
    dropdownContainers.forEach((container) => {
        // Get the bounding rectangle (position and size) of the container
        const rect = container.getBoundingClientRect();

        // Get the width of the viewport (the visible part of the browser window)
        const viewportWidth = window.innerWidth;

        // Find the dropdown menu element within this container
        const dropdownMenu = container.querySelector(".menu-id");

        // Calculate half of the width of the parent element of the target element
        const targetHalfWidth = container.offsetWidth / 2;

        // Set a CSS variable with the calculated half width value
        container.style.setProperty(
            "--target-half-width",
            targetHalfWidth + "px"
        );

        // Add a 'right' class to the dropdown menu if it's close to the right edge of the screen
        if (rect.right > viewportWidth - 300) {
            dropdownMenu.classList.add("right");
        }
    });
}

// Call the 'singleMenu' function to initialize the dropdown menus
singleMenu();