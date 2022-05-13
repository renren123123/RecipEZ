var recipe_dict = {};

async function onLoadRecipes() {
    return loadRecipes('http://localhost:5000/recipe/all');
}

async function onPostReview(){
    return postReview('http://localhost:5000/review/new');
}


async function loadRecipes(url = '') {
    const urlString = url;
    fetch(urlString, {
        method: "GET",
        // mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':  "Content-Type",
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
            'Authorization': 'Bearer key'
        }
    })
    //fetch(urlString)
    .then(objData => objData.text())
    .then(json => {
        recipeList = document.getElementById("recipeList");

        array = [];
        c = 0;
        json.split(/([()])/).filter(Boolean).forEach(e =>
            // Increase / decrease counter and push desired values to an array
            e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push(e) : {}
        );

        for (const tuple of array) {
            split = tuple.split(',');
            if (split.length == 2) {
                var [recipeID, recipeName] = split
                if (!(recipeID in recipe_dict)) {
                    recipeName = recipeName.slice(2, -1)

                    recipeList.options[recipeList.options.length] = new Option(recipeName, recipeID);

                    recipe_dict[recipeID] = recipeName;
                }
            }
        }

        return json;
    })
}


async function postReview(url = '') {

    var recipeID = document.getElementById("recipeList").value 
    var score = document.getElementById("rating").value 
    var review = document.getElementById("review_box").value 
    var userID = 1676

    const urlString = url + "?" + "recipeID=" + recipeID + "&score=" + score + "&review=" + review + "&userID=" + userID;
    fetch(urlString, {
        method: "POST",
        // mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Authorization': 'Bearer key'
        }
    })
    .then(objData => objData.text())
    .then(json => {
        return json;
    })
}

// const submitted = document.querySelector('.btn-group');
// submitted.addEventListener('click', formSubmitted);
// async function formSubmitted() {
//     window.open('yo');
// }
    
    