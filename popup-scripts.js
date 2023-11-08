// if the variable is undefined, it means it haven't been run yet
// if undefined run the script
if (typeof scriptHasRun === "undefined") {
    // set the variable to true to prevent the script from running multiple times
    scriptHasRun = true;

    // set global popup-time-delay variable
    var popupTimeDelay;
    // scroll-trigger-popup flag
    var popupShown = false;

    function initiate_popup(args) {
        // Extract the arguments
        const target = args.target || false;
        const overlayColor = args.overlay_color || false;
        const popupType = args.popup_type || "default"; // fallback value = "default"
        // update popup-time-delay variable based on argument value
        popupTimeDelay = args.popup_time_delay || 0; // fallback value = "0s"
        const popupScrollTrigger = args.popup_scroll_trigger || false;
        const popupAnimationType = args.popup_animation_type || false;
        const popupPosition = args.popup_position || false; //scrollable as default
        const popupOverPopup = args.popup_over_popup || false;

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

        // ----------------==========================handle popup type==========================----------------

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
                const exitButton =
                    targetElement.querySelector("#exitCookieButton");

                // on click of confirm set cookie
                confirmButton.addEventListener("click", () => {
                    document.cookie = `${cookieName}=true; expires=${cookieExpiration}; path=/`;

                    // Check if the cookie is set
                    if (document.cookie.indexOf(`${cookieName}=true`) > -1) {
                        // If the cookie is set, close the popup
                        closePopup(targetElement);
                    }
                });

                // on click of exit direct to blank page
                exitButton.addEventListener("click", () => {
                    window.location.href = "about:blank";
                });
            }
        }

        // ----------------==========================handle prevent close==========================----------------

        // if prevent close is true
        if (args.prevent_close === true) {
            // Add a class to prevent closing the popup
            targetElement.classList.add("prevent-close");
        }

        // ----------------==========================handle popup position==========================----------------

        // if position value is provided
        if (popupPosition) {
            // Add the value as a class
            targetElement.classList.add(popupPosition);
        }

        // ----------------==========================handle animation==========================----------------

        // if animation type is provided
        if (popupAnimationType) {
            // Add the value as a class
            targetElement.classList.add(popupAnimationType);
        }

        // ----------------==========================handle popup over popup==========================----------------

        // if popupOverPopup is true (current popup is placed over another popup)
        if (popupOverPopup) {
            // Add the value as a class
            targetElement.classList.add("popup-over-popup");
        }

        // ----------------==========================handle trigger on scroll==========================----------------

        // Parse and convert the popupSpaceFromTop value based on its unit (px or %)
        function parseScrollPosition(value, bodyHeight) {
            if (typeof value === "string" && value.endsWith("%")) {
                // if has %
                // convert string to number
                const percentage = parseFloat(value);
                // convert percentage to pixels
                return (percentage / 100) * bodyHeight;
            } else if (typeof value === "string" && value.endsWith("px")) {
                // if has px
                // convert string to number
                return parseFloat(value);
            } else {
                // Set fallback value as 0
                return 0;
            }
        }

        // Get the body height
        const bodyHeight =
            document.body.clientHeight ||
            document.documentElement.clientHeight ||
            window.innerHeight;

        // Parse and convert the argument value if provided else set it to 0
        const popupSpaceFromTop =
            "popup_top_space" in args
                ? parseScrollPosition(args.popup_top_space, bodyHeight)
                : 0;

        // if popup trigger on scroll down is true
        if (popupScrollTrigger === true) {
            // Function to check the scroll position and open the popup
            function checkScrollPosition() {
                const scrollTop =
                    window.pageYOffset || document.documentElement.scrollTop;
                console.log(scrollTop);

                if (!popupShown && scrollTop >= popupSpaceFromTop) {
                    // Set a flag to prevent the popup from opening multiple times
                    popupShown = true;
                    console.log("scroll popup opened");

                    // Call the openPopup function with your targetElement and delay
                    openPopup(targetElement, popupTimeDelay);
                }
            }
            window.addEventListener("scroll", checkScrollPosition);
        }

        // ----------------==========================handle popup open==========================----------------

        // if trigger on scroll is set to false
        if (!popupScrollTrigger) {
            // open the popup
            openPopup(targetElement, popupTimeDelay);
        }

        // Create and dispatch a custom event when the popup opens
        var popupOpenedEvent = new CustomEvent("popupOpened", {
            detail: { target: target },
        });
        document.dispatchEvent(popupOpenedEvent);

        // ----------------==========================handle popup close==========================----------------

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
                // Check if the clicked element has the class "DuKSh" or "AYaOY"
                if (
                    e.target.classList.contains("DuKSh") ||
                    e.target.classList.contains("AYaOY")
                ) {
                    // if current popup is over another popup stop event bubbling
                    if (popupOverPopup) {
                        e.stopPropagation();
                    }
                    closePopup(targetElement);
                    targetElement.classList.remove("opened");
                } else if (
                    e.target.closest(".DuKSh") ||
                    e.target.closest(".AYaOY")
                ) {
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
                closePopup(element.closest(".DuKSh"));
            });
        });
    }

    function openPopup(element, popupTimeDelay = 0) {
        // delay time = 0s by default
        setTimeout(() => {
            // Open the popup by adding 'gsCWf(display flex)' and 'opened' class
            element.classList.add("gsCWf");
            element.classList.add("opened");

            // if the current popup is on another popup
            if (element.classList.contains("popup-over-popup")) {
                // show the current popup
                element.style.visibility = "visible";
                // get the parent popup of the current popup
                const parentPopup = element.parentElement.closest(".DuKSh");
                // add class to the parent popup
                parentPopup.classList.add("has-child-popup");
            }

            // if the popup is slidein/force-slidein, return
            if (element.classList.contains("slidein-popup")) {
                return;
            }

            // disable scrolling if popup opens
            document.body.style.overflow = "hidden";
        }, popupTimeDelay * 1000); // convert delay from seconds to milliseconds
    }

    function closePopup(element) {
        // close popup by removing 'gsCWf(display flex)' and 'opened' class
        element.classList.remove("gsCWf");
        element.classList.remove("opened");

        // Create and dispatch a custom event when the popup closes
        var popupClosedEvent = new CustomEvent("popupClosed", {
            detail: { target: element.id },
        });
        document.dispatchEvent(popupClosedEvent);

        // if popup has fade-in, remove transition while closing
        if (element.classList.contains("animate-fade-in")) {
            element.classList.remove("animate-fade-in");
        }

        // if popup has bounce in animation, reset it (re-show animation while re-opening)
        if (element.classList.contains("animate-bounce-in")) {
            element.classList.remove("animate-bounce-in");
        }

        // if the popup is slidein/force-slidein, return
        if (element.classList.contains("slidein-popup")) {
            return;
        }

        // enable scrolling if popup closed
        document.body.style.overflow = "auto";

        // if the current popup is on another popup
        if (element.classList.contains("popup-over-popup")) {
            // hide the current popup
            element.style.visibility = "hidden";
            // get the parent popup of the current popup
            const parentPopup = element.parentElement.closest(".DuKSh");
            // remove class from the parent popup
            parentPopup.classList.remove("has-child-popup");
        }
    }

    // close popups manually when 'prevent_close' argument value is true
    function closePopupManually() {
        // get the popup with the class 'prevent-close'
        const openedPopup = document.querySelector(".prevent-close");

        // if exist, close it
        if (openedPopup) {
            closePopup(openedPopup);
        }
    }

    // store the timeout ID as variable
    let timeoutId;

    // Add an event listener for the custom 'popupOpened' event
    document.addEventListener("popupOpened", function (e) {
        if (e.detail && e.detail.target) {
            console.log(e.detail.target);

            // Clear the previous timeout if it exists
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            const popup = document.querySelector(`${e.detail.target}`); // popup overlay (.DukSh)
            const popupElementsContainer = popup.querySelector(".ExGby"); // popup container

            // Set a new setTimeout function
            timeoutId = setTimeout(() => {
                // get container's visible height
                let popupElementsContainerHeight =
                    popupElementsContainer.offsetHeight;

                // get container's actual (scrollable) height
                let popupElementsHeight = popupElementsContainer.scrollHeight;

                // if simplebar is initialized
                if (
                    popupElementsContainer.classList.contains(
                        "simplebar-scrollable-y"
                    )
                ) {
                    const simpleBarContent =
                        popupElementsContainer.querySelector(
                            ".simplebar-content"
                        );
                    // set the 'simplebar-content' div's height as scrollable height
                    popupElementsHeight = simpleBarContent.offsetHeight;
                }

                console.log(popupElementsContainerHeight, popupElementsHeight);

                // Check if the content's actual height is greater than container's visible height
                if (popupElementsHeight > popupElementsContainerHeight) {
                    // if yes, add the class
                    popup.classList.add("exceeded");
                    // add simplebar script and initialize after it's loaded
                    addScriptToDOM(
                        "https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.min.js",
                        function () {
                            // Initialize SimpleBar only after the script has fully loaded
                            new SimpleBar(popupElementsContainer);
                        }
                    );

                    new SimpleBar(popupElementsContainer);
                } else {
                    // check if the class already exist
                    if (popup.classList.contains("exceeded")) {
                        // if yes, remove the class
                        popup.classList.remove("exceeded");
                        // Destroy SimpleBar instance if the content is no longer exceeded
                        const simpleBarInstance = SimpleBar.instances.get(
                            popupElementsContainer
                        );
                        if (simpleBarInstance) {
                            simpleBarInstance.unMount();
                        }
                    }
                }
            }, 100);
        }
    });

    // -------------------------------------------------------handle single menu dropdown-----------------------------------------------------------

    function singleMenu() {
        // Check if the dropdown overlay already exists
        let dropdownOverlay = document.querySelector(".dropdown-menu-overlay");

        // If the overlay doesn't exist, create it
        if (!dropdownOverlay) {
            dropdownOverlay = document.createElement("div");
            dropdownOverlay.classList.add("dropdown-menu-overlay");
            document.body.appendChild(dropdownOverlay);
        }

        // Find all elements with the class 'target-id-button'
        const targetElements = document.querySelectorAll(".target-id-button");

        // Create a map to associate target elements with menu elements based on data attributes
        const targetMenuMap = new Map();

        // Iterate through target elements and handle click events
        targetElements.forEach((targetElement) => {
            // Get the associated menu element using the data-menu attribute
            const associatedMenu = document.querySelector(
                `[data-menu="${targetElement.getAttribute("data-target")}"]`
            );

            if (associatedMenu) {
                targetMenuMap.set(targetElement, associatedMenu);
                targetElement.show = false; // Initialize the 'show' property for each target
                targetElement.addEventListener("click", (event) => {
                    event.stopPropagation(); // Prevent this click event from propagating to the document click handler
                    targetElement.show = !targetElement.show;

                    // Toggle the visibility of the associated menu and overlay based on the 'show' property
                    if (targetElement.show) {
                        associatedMenu.style.display = "block";
                        targetElement.classList.add("active");
                        dropdownOverlay.style.display = "block";
                    } else {
                        associatedMenu.style.display = "none";
                        targetElement.classList.remove("active");
                        dropdownOverlay.style.display = "none";
                    }
                });
            }
        });

        function closeAllDropdowns() {
            // loop through all the dropdowns
            targetMenuMap.forEach((menu, targetElement) => {
                // Hide the dropdown menu and overlay
                menu.style.display = "none";
                targetElement.classList.remove("active");
                targetElement.show = false;
                dropdownOverlay.style.display = "none";
            });
        }

        // on click of overlay
        dropdownOverlay.addEventListener("click", (event) => {
            closeAllDropdowns();
        });

        // close dropdown on closing of any popup
        const popups = document.querySelectorAll(".DuKSh");
        // loop through all the popups
        popups.forEach((popup) => {
            // on click of popup
            popup.addEventListener("click", () => {
                // if the popup is already opened
                if (popup.classList.contains("opened")) {
                    closeAllDropdowns();
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
}
