// Function to add a script to the DOM
function addScriptToDOM(url, type = "absolute") {
    if (type === "relative") {
        console.log("");

        // Remove the leading '/' if present in the URL
        if (url.startsWith("/")) {
            url = url.substring(1);
        }
        // Create the full URL by concatenating with the root URL
        url = window.location.origin + "/" + url;
    }
    console.log(url);
    // Create a new script element
    var script = document.createElement("script");

    // Set the source attribute to the URL
    script.src = url;

    // Append the script element to the document's body
    document.body.appendChild(script);
}

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
