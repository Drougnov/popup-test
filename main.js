// Add a script to the DOM.
function addScriptToDOM(url, type = "absolute") {
    if (type === "relative") {
        // Remove the leading '/' if present in the URL
        if (url.startsWith("/")) {
            url = url.substring(1);
        }
        // Create the full URL by concatenating with the root URL
        url = window.location.origin + "/" + url;
    }

    // Check if the URL is valid
    if (!isValidURL(url)) {
        alert("Invalid URL:", url);
        return;
    }

    // Convert to HTTPS if it's an HTTP URL
    if (url.startsWith("http://")) {
        url = url.replace("http://", "https://");
    }

    // Check if the script already exists
    var existingScript = document.querySelector('script[src="' + url + '"]');
    if (existingScript) {
        alert("Script already exists:", url);
        return;
    }

    // Create a new script element
    var script = document.createElement("script");

    // Set the source attribute to the URL
    script.src = url;

    // Append the script element to the document's body
    document.body.appendChild(script);
}

// Check if a URL is valid.
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

// Toggle hamburger icon in menu
const header = document.querySelector(".header");
// store the timeout ID as variable
let timeoutId;

// Function to check if the script is loaded
function checkScriptLoaded(scriptSrc, callback) {
    const checkInterval = setInterval(() => {
        const existingScript = document.querySelector('script[src="' + scriptSrc + '"]');
        if (existingScript) {
            clearInterval(checkInterval); // Clear the interval
            callback(); // Run the callback when the script is loaded
        }
    }, 100); // Check every 100 milliseconds
}

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
                    popupElementsContainer.querySelector(".simplebar-content");
                // set the 'simplebar-content' div's height as scrollable height
                popupElementsHeight = simpleBarContent.offsetHeight;
            }

            console.log(popupElementsContainerHeight, popupElementsHeight);

            // Check if the content's actual height is greater than container's visible height
            if (popupElementsHeight > popupElementsContainerHeight) {
                // if yes, add the class
                popup.classList.add("exceeded");
                // add simplebar script
                addScriptToDOM(
                    "https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.min.js"
                );
                
                // Check if the script is loaded and then initialize SimpleBar
                checkScriptLoaded("https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.min.js", function() {
                    // Initialize SimpleBar on the container
                    new SimpleBar(popupElementsContainer);
                });
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

// Add an event listener for the custom 'popupClosed' event
document.addEventListener("popupClosed", function (e) {
    if (e.detail && e.detail.target) {
        // Remove 'nav-active' class to header if the target equals '#header-popup'
        if (header && e.detail.target === "header-popup") {
            header.classList.remove("nav-active");
        }
    }
});



























// Function to update the user online status after specified interval
async function startTimerLambda(userOnlineIds) {
    let timer;

    // Clearing previous interval if any
    if (timer) clearInterval(timer);

    const response = await getOnlineUsersIdAPICall(userOnlineIds);
    updateUserStatus(response);

    // Starting new interval
    timer = setInterval(async function () {
        const response = await getOnlineUsersIdAPICall(getUserOnlineIds());
        updateUserStatus(response);
    }, 30000);
}

// Invoke the function to update the online status for ids -->
startTimerLambda(getUserOnlineIds());

/* Is User Online */
// Get array of all user ids that have attribute data-online=""
function getUserOnlineIds() {
    var userOnlineIds = [];
    var divs = document.querySelectorAll("div[data-online]");
    divs.forEach(function (div) {
        userOnlineIds.push(div.getAttribute("data-uid"));
    });

    console.log("userOnlineIds---> ", userOnlineIds);

    return userOnlineIds;
}

async function getOnlineUsersIdAPICall(userOnlineIds) {
    let response = await fetch(
        `https://ttmvdz7ohimfm3u6ns7u4epmba0ggtjd.lambda-url.ap-northeast-1.on.aws/getOnlineUsers`,
        {
            method: "POST",
            body: JSON.stringify({
                requestedIds: userOnlineIds,
            }),
        }
    );
    response = await Promise.all([response.json()]);

    return response[0].data;
}

function updateUserStatus(response) {
    // Sample JSON array of UIDs and their online status

    console.log("update Status called");
    const { returnedUserIds } = response;

    // The response will be in this format
    // [
    //   {uid: '58', last_online: '2023-10-16T12:48:34.721Z', online: 1}
    //   {uid: '41', last_online: null, online: 0}
    // ]

    // Update the data-online attribute based on the JSON array
    returnedUserIds.forEach((status) => {
        const { uid, online } = status;
        const element = document.querySelector(`[data-uid="${uid}"]`);
        if (element) {
            element.setAttribute("data-online", online);
        }
    });
}