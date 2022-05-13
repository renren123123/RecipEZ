var score_dict = {};
var review_dict = {};

async function onReviewsByUser(){
    return reviewsByUser('http://localhost:5000/recipe/user');
}

async function onUpdateReview() {
    return updateReview('http://localhost:5000/review/update');
}

async function onDeleteReview() {
    return deleteReview('http://localhost:5000/review/delete');
}

async function reviewsByUser(url = '') {
    var userID = 1676;
    const urlString = url + "?" + "userID=" + userID;
    fetch(urlString, {
        method: "GET",
        // mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
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

        var i = 0;
        for (const tuple of array) {
            split = tuple.split(',');
            if (split.length == 4) {
                var [ratingID, recipeName, score, review] = split
                if (!(ratingID in score_dict)) {
                    recipeName = recipeName.slice(2, -1)
                    review = review.slice(2, -1)

                    recipeList.options[recipeList.options.length] = new Option(recipeName, ratingID);

                    score_dict[ratingID] = score;
                    review_dict[ratingID] = review;

                    if (i == 0) {
                        document.getElementById("rating").value = score;
                        document.getElementById("review_box").value = review;
                    }

                }
            }
            i++;
        }


        return json;
    })
}

async function onRecipeSelected() {
    recipeList = document.getElementById("recipeList")
    ratingID = recipeList.value
    score = score_dict[ratingID]
    review = review_dict[ratingID]

    document.getElementById("rating").value = score;
    document.getElementById("review_box").value = review;

    return;
}

async function updateReview(url = '') {

    var ratingID = document.getElementById("recipeList").value;
    var score = document.getElementById("rating").value;
    var review = document.getElementById("review_box").value;
    review = "'" + review + "'"

    const urlString = url + "?" + "ratingID=" + ratingID + "&score=" + score + "&review=" + review;
    fetch(urlString, {
        method: "PUT",
        // mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Authorization': 'Bearer key'
        }
    })
    //fetch(urlString)
    .then(objData => objData.text())
    .then(json => {
        return json;
    })
}

async function deleteReview(url = '') {

    var ratingID = document.getElementById("recipeList").value;

    const urlString = url + "?" + "ratingID=" + ratingID;
    fetch(urlString, {
        method: "DELETE",
        // mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Authorization': 'Bearer key'
        }
    })
    //fetch(urlString)
    .then(objData => objData.text())
    .then(json => {
        return json;
    })
}
