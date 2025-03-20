const theSearchCategory = document.querySelector('input[name = "searchCategory"]');
const theSearchTerm = document.querySelector("#searchTerm");
const prefix = "jrj8250-";
const searchCategoryKey = prefix + "searchCategory";
const searchTermKey = prefix + "searchTerm";

const storedCategory = localStorage.getItem(searchCategoryKey);
const storedTerm = localStorage.getItem(searchTermKey);

window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked;

    if (storedCategory) {
        document.querySelector(`input[value='${storedCategory}']`).checked = true;
        charOrEp(document.querySelector(`input[value='${storedCategory}']`));
    } else {
        document.querySelector("#character").checked = true;
        charOrEp(document.querySelector("#character"));
    };

    if (storedTerm) {
        theSearchTerm.value = storedTerm;
    } else {
        theSearchTerm.value = "Rick";
    };

    changeStoredTerm(theSearchTerm);
};


function charOrEp(category) {
    if (category.value == "character") {
        let choices;
        choices = `<option>None</option>`;
        choices += `<option>Alive</option>`;
        choices += `<option>Dead</option>`;
        choices += `<option>Unknown</option>`;

        document.querySelector("#filter").innerHTML = choices;
    }

    if (category.value == "episode") {
        let choices;
        choices = `<option>None</option>`;
        choices += `<option value='S01'>Season 1</option>`;
        choices += `<option value='S02'>Season 2</option>`;
        choices += `<option value='S03'>Season 3</option>`;
        choices += `<option value='S04'>Season 4</option>`;
        choices += `<option value='S05'>Season 5</option>`;

        document.querySelector("#filter").innerHTML = choices;
    }

    localStorage.setItem(searchCategoryKey, category.value);
}

function changeStoredTerm(term) {
    localStorage.setItem(searchTermKey, term.value)
}




let displayTerm = "";

function searchButtonClicked() {

    const rickandmortyURL = "https://rickandmortyapi.com/api/";
    let currentSearchFilter = document.querySelector("#filter");

    let url = rickandmortyURL;
    let searchCategory = document.querySelector('input[name = "searchCategory"]:checked').value;
    url += searchCategory;

    let term = document.querySelector("#searchTerm").value;

    if (term == "") {
        document.querySelector("#content").innerHTML = "<p><i>Aw Jeez! You need to enter text into the search bar!</i></p>";
        return;
    }

    displayTerm = term;
    term = term.trim();
    term = encodeURIComponent(term);
    url += `/?name=${term}`;
    if (searchCategory == "character") {
        if(currentSearchFilter.value !== "None") {
            url += `&status=${currentSearchFilter.value}`;
        }
    }
    if (searchCategory == "episode") {
        if(currentSearchFilter.value !== "None") {
            url += `&episode=${currentSearchFilter.value}`;
        }
    }
    

    document.querySelector("#content").innerHTML = "<p><i>Searching...</i></p>";

    getData(url);
}

function getData(url) {
    let xhr = new XMLHttpRequest();
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);

    if(!obj.results || obj.results.length == 0) {
        document.querySelector("#content").innerHTML = "<p><i>Wubba Lubba Dub Dub! No results were found for '" + displayTerm + "'</i></p>";
        return;
    }

    let results = obj.results;

    let bigString = "<p><i>Showing results for '" + displayTerm + "'</i></p>";
    let currentSearchCategory = document.querySelector('input[name = "searchCategory"]:checked');

    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        if (currentSearchCategory.value == "character") {
            let line = `<div class="resultCharacter">`;
            line += `<h3>${result.name}</h3>`
            line += `<img src="${result.image}" alt="" />`;
            line += `<h4 id="species" data-status="${result.status}">Status: ${result.status}</h4>`;
            line += `<h4>Species: ${result.species}</h4>`;
            line += `<h4>Gender: ${result.gender}</h4>`;
            line += `</div>`;

            bigString += line;
        } else if (currentSearchCategory.value == "episode") {
            let line = `<div class="resultEpisode">`;
            line += `<h3>${result.name}</h3>`
            if (result.episode.startsWith("S01")) {
                line += `<img src="images/RickAndMortyPosterS1.jpg" alt="" />`;
            } else if (result.episode.startsWith("S02")) {
                line += `<img src="images/RickAndMortyPosterS2.jpg" alt="" />`;
            } else if (result.episode.startsWith("S03")) {
                line += `<img src="images/RickAndMortyPosterS3.jpg" alt="" />`;
            } else if (result.episode.startsWith("S04")) {
                line += `<img src="images/RickAndMortyPosterS4.jpg" alt="" />`;
            } else if (result.episode.startsWith("S05")) {
                line += `<img src="images/RickAndMortyPosterS5.jpg" alt="" />`;
            }
            line += `<h4>Episode: ${result.episode}</h4>`;
            line += `<h4>Release Date: ${result.air_date}</h4>`;
            line += `</div>`;

            bigString += line;
        }
    }

    document.querySelector("#content").innerHTML = bigString;
}

function dataError(e) {
    console.log("An error occurered");
}