let starWarsList = document.querySelector(".starWarsList");
let listTypes = document.querySelector(".listTypes");
let fetchPrev = document.querySelector(".fetchPrev");
let fetchNext = document.querySelector(".fetchNext");
let overlay = document.querySelector(".overlay");

let apiData = [];
let currentPage = 1;

let typeNames = {
    people: [],
    starships: [],
    vehicles: [],
    species: [],
    planets: [],
}

let gifs = [
    "i-am-your-father.gif",
    "rey-vs-kylo.gif",
    "starwars_trench.gif",
    "fly-over-death-star.gif",
]

fetchPrev.addEventListener("click", function(event) {
    event.preventDefault();
    let url = event.target.href;
    let arr = url.split("=");
    getData(arr[arr.length - 1]);
});

fetchNext.addEventListener("click", function(event) {
    event.preventDefault();
    let url = event.target.href;
    let arr = url.split("=");
    getData(arr[arr.length - 1]);
});

starWarsList.addEventListener("click", function(event) {
    if (event.target.classList.contains("listItems__link")) {
        event.preventDefault();
        window.history.pushState({}, "", event.target.href);
        let url = new URLSearchParams(window.location.search);
        showListItem(url);
    }
});

listItem.addEventListener("click", closeWindow);

window.addEventListener("keyup", escKeyPressed);

listItem.querySelector(".listItem__close").addEventListener("click", closeWindow);

listItem.querySelector(".listItem__window").addEventListener("click", function(event) {
    event.stopPropagation();
});

listTypes.addEventListener("click", function(event) {
    if (event.target.classList.contains("listTypes__link")) {
        event.preventDefault();
        if (!event.target.classList.contains("js-selected")) {
            window.history.pushState({}, "", event.target.href);
            getData(1);
            let listTypesLink = document.querySelectorAll(".listTypes__link");
            listTypesLink.forEach(link => {
                link.classList.remove("js-selected");
            });
            event.target.classList.add("js-selected");
        }
    }
});

initialize();

function initialize() {
    let url = new URLSearchParams(window.location.search);
    let page = url.get("page");
    if (!page) {
        page = 1;
    }
    getData(page);
}

function getData(page) {
    overlay.style.display = "flex";
    let url = new URLSearchParams(window.location.search);
    let type = url.get("type");
    if (!type) {
        type = "people";
    }
    currentPage = page;
    apiData = [];
    fetchData(`https://swapi.dev/api/${type}?page=${page}`, url);
}

function fetchData(pageUrl, url) {
    apiData.push("");
    console.log(pageUrl);
    fetch(pageUrl)
        .then(res => res.json())
        .then(data => {
            overlay.style.display = "none";
            starWarsList.classList.add("scrollUp");
            let type = url.get("type");
            if (!type) {
                type = "people";
            }
            let prev = parseInt(currentPage) - 1;
            let next = parseInt(currentPage) + 1;
            let maxPages = Math.ceil(data.count / 10);
            if (next > maxPages) {
                next = maxPages;
            }
            if (prev <= 1) {
                prev = 1;
            }

            fetchPrev.href = `/index.html?type=${type}&page=${prev}`;
            fetchNext.href = `/index.html?type=${type}&page=${next}`;
            window.history.pushState({}, "", `/index.html?type=${type}&page=${currentPage}`);

            data.results.forEach(res => {
                apiData.push(res);
                createList(currentPage);
            });
            if (url && url.get("id")) {
                showListItem(url);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

// function getAllData() {
//     overlay.style.display = "flex";
//     apiData = [];
//     let url = new URLSearchParams(window.location.search);
//     let type = url.get("type");
//     if (!type) {
//         type = "people";
//     }
//     fetchAllData(`https://swapi.dev/api/${type}`, url);
// }

// function fetchAllData(pageUrl, queryString) {
//     apiData.push("");
//     fetch(pageUrl)
//         .then(res => res.json())
//         .then(data => {
//             data.results.forEach(res => {
//                 apiData.push(res);
//             });
//             if (data.next) {
//                 if (queryString) {
//                     fetchAllData(data.next, queryString);
//                 } else {
//                     fetchAllData(data.next);
//                 }
//             } else {
//                 overlay.style.display = "none";
//                 createList();
//                 if (queryString && queryString.get("id")) {
//                     showListItem(queryString);
//                 }
//             }
//         });
// }

function createList(page = null) {
    starWarsList.querySelectorAll("*").forEach(function(element) {
        element.remove();
    });
    let template = document.getElementById("listItems");
    let arr = apiData[1].url.split("/");
    let type = arr[arr.length - 3];
    apiData.forEach((data) => {
        if (data != "") {
            let clone = template.content.cloneNode(true);
            let listItemsLink = clone.querySelector(".listItems__link");
            let arr = data.url.split("/");
            let id = arr[arr.length - 2];
            let pageStr = "";
            if (page) {
                pageStr = `&page=${page}`;
            }
            listItemsLink.href = `?type=${type}${pageStr}&id=${id}`;
            listItemsLink.textContent = data.name;
            typeNames[type].push({ id, name: data.name });
            starWarsList.appendChild(clone);
        }
    });
}

function showListItem(url) {
    overlay.style.display = "flex";
    listItem.classList.add("js-display");
    let randomGif = gifs[randomArrayItem(gifs.length)];
    listItem.querySelector(".listItem__footer").style.backgroundImage = `url(./images/${randomGif})`;
    let type = url.get("type");
    let id = url.get("id");
    let rowContainer = listItem.querySelector(".listItem__rowContainer");
    let template = document.getElementById("listItemRow");
    rowContainer.querySelectorAll("*").forEach(function(element) {
        element.remove();
    });
    fetch(`https://swapi.dev/api/${type}/${id}/`)
        .then(res => res.json())
        .then(data => {
            let fetches = [];
            Object.entries(data).forEach(entry => {
                let clone = template.content.cloneNode(true);
                let keyElement = clone.querySelector(".listItem__key");
                let valueElement = clone.querySelector(".listItem__value");
                // listItem.querySelector(".listItem__title").textContent = url.get("name");
                if (entry[0] == "name") {
                    listItem.querySelector(".listItem__title").textContent = entry[1];
                }
                if (Array.isArray(entry[1])) {
                    if (entry[1].length > 0 && entry[0] != "films") {
                        keyElement.textContent = entry[0];
                        valueElement.textContent = "";
                        rowContainer.appendChild(clone);
                        entry[1].forEach(value => {
                            let newRow = template.content.cloneNode(true);
                            let newRowKeyElement = newRow.querySelector(".listItem__key");
                            let newRowValueElement = newRow.querySelector(".listItem__value");
                            newRowKeyElement.textContent = "";
                            let arr = value.split("/");
                            let linkType = arr[arr.length - 3];
                            let linkID = arr[arr.length - 2];
                            let pageStr = `&page=${Math.ceil(linkID / 10)}`;
                            rowContainer.appendChild(newRow);
                            let currentFetch = fetch(`https://swapi.dev/api/${linkType}/${linkID}/`)
                                .then(res => res.json())
                                .then(data => {
                                    newRowValueElement.innerHTML = `<a class="detailsLink" href="/index.html?type=${linkType}${pageStr}&id=${linkID}">${data.name}</a>`;
                                    newRowValueElement.addEventListener("click", function(event) {
                                        if (event.target.classList.contains("detailsLink")) {
                                            event.preventDefault();
                                            window.history.pushState({}, "", event.target.href);
                                            let urlParam = new URLSearchParams(window.location.search);
                                            showListItem(urlParam);
                                        }
                                    });
                                });
                            fetches.push(currentFetch);
                        });
                    }
                } else {
                    let isUrl = /^https:\/\//.test(entry[1]);
                    if (!isUrl && entry[0] != "created" && entry[0] != "edited") {
                        keyElement.textContent = entry[0];
                        valueElement.textContent = entry[1];
                        rowContainer.appendChild(clone);
                    }
                }
            });
            Promise.all(fetches).then(() => {
                overlay.style.display = "none";
            });
        });
}

function escKeyPressed(event){
    if (event.key === "Escape" && listItem.classList.contains("js-display")) {
        closeWindow(event);
    }
}

function closeWindow(event) {
    event.preventDefault();
    listItem.classList.remove("js-display");
    let url = new URLSearchParams(window.location.search);
    let type = url.get("type");
    let page = url.get("page");
    let pageStr = "";
    if (page) {
        pageStr = `&page=${page}`;
    }
    window.history.pushState({}, "", `/index.html?type=${type}${pageStr}`);
    let listTypesLink = document.querySelectorAll(".listTypes__link");
    listTypesLink.forEach(link => {
        if (link.dataset.type == type) {
            link.classList.add("js-selected");
        } else {
            link.classList.remove("js-selected");
        }
    });
    getData(page ? page : 1);
}

function randomArrayItem(arrLength) {
    return Math.floor(Math.random() * arrLength);
}