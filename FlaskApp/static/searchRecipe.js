async function onSubmitIngredient(){
    return submitIngredient('http://localhost:5000/recipe/ingredient');
}

async function onSubmitEasy(){
    return submitEasy('http://localhost:5000/recipe/easy');
}

async function onSubmitPopular(){
    return submitPopular('http://localhost:5000/rating/popular');
}

async function onSubmitAvgRatings(){
    return submitAvgRatings('http://localhost:5000/recipe/avgratings');
}

async function submitIngredient(url = '', params = {}, bodyObj = {}) {
    var ingredientName = document.getElementById("Ingredient").value;
    const urlString = url + "?" + "ingredientName=" + ingredientName;
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

        document.getElementById("output").innerHTML = "";

        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        table.appendChild(thead);
        table.appendChild(tbody);

        // Adding the entire table to the body tag
        document.getElementById('output').appendChild(table);

        //Adding the title
        let row_1 = document.createElement('tr');
        let heading_1 = document.createElement('th');
        heading_1.innerHTML = "Recipe Name";
       

        row_1.appendChild(heading_1);
    
        thead.appendChild(row_1);

        array = [];
        c = 0;
        json.split(/([()])/).filter(Boolean).forEach(e =>
            // Increase / decrease counter and push desired values to an array
            e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push(e) : {}
        );

        for (const tuple of array) {
            split = tuple.split(',');
            if (split.length == 2) {
                var [recipeName] = split
                
                let trow = document.createElement('tr');
            
                let tcol1 = document.createElement('td'); //col 1
                tcol1.innerHTML = recipeName.replace("'", "").replace("'", "")

                trow.appendChild(tcol1); //append col1

                tbody.appendChild(trow); //append whole row

            }
        }
        
    })
}


async function submitEasy(url = '', params = {}, bodyObj = {}) {
    const urlString = url;
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

        document.getElementById("output").innerHTML = "";

        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        table.appendChild(thead);
        table.appendChild(tbody);

        // Adding the entire table to the body tag
        document.getElementById('output').appendChild(table);

        //Adding the title
        let row_1 = document.createElement('tr');
        let heading_1 = document.createElement('th');
        heading_1.innerHTML = "Recipe Name";
        let heading_2 = document.createElement('th');
        heading_2.innerHTML = "Min To Prepare";
        let heading_3 = document.createElement('th');
        heading_3.innerHTML = "Num of Steps";
        let heading_4 = document.createElement('th');
        heading_4.innerHTML = "Num of Ingredients";

        row_1.appendChild(heading_1);
        row_1.appendChild(heading_2);
        row_1.appendChild(heading_3);
        row_1.appendChild(heading_4);
        thead.appendChild(row_1);

        array = [];
        c = 0;
        json.split(/([()])/).filter(Boolean).forEach(e =>
            // Increase / decrease counter and push desired values to an array
            e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push(e) : {}
        );

        for (const tuple of array) {

            split = tuple.split(',');
            if (split.length == 4) {
                var [recipeName, Prep, Steps, Ingredient] = split
                
                let trow = document.createElement('tr');
            
                let tcol1 = document.createElement('td'); //col 1
                tcol1.innerHTML = recipeName.replace("'", "").replace("'", "")

                let tcol2 = document.createElement('td'); //col 2
                tcol2.innerHTML = Prep

                let tcol3 = document.createElement('td'); //col 2
                tcol3.innerHTML = Steps

                let tcol4 = document.createElement('td'); //col 2
                tcol4.innerHTML = Ingredient
                
                trow.appendChild(tcol1); //append col1
                trow.appendChild(tcol2); //append col2
                trow.appendChild(tcol3); 
                trow.appendChild(tcol4); 
                tbody.appendChild(trow); //append whole row

            }
        }
    })
}


async function submitAvgRatings(url = '', params = {}, bodyObj = {}) {
    const urlString = url;
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

        document.getElementById("output").innerHTML = "";

        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        table.appendChild(thead);
        table.appendChild(tbody);

        // Adding the entire table to the body tag
        document.getElementById('output').appendChild(table);

        //Adding the title
        let row_1 = document.createElement('tr');
        let heading_1 = document.createElement('th');
        heading_1.innerHTML = "Recipe Name";
        let heading_2 = document.createElement('th');
        heading_2.innerHTML = "Avg Rating";

        row_1.appendChild(heading_1);
        row_1.appendChild(heading_2);
        thead.appendChild(row_1);

        array = [];
        c = 0;
        json.split(/([()])/).filter(Boolean).forEach(e =>
            // Increase / decrease counter and push desired values to an array
            e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push(e) : {}
        );

        for (const tuple of array) {

            split = tuple.split(',');
            if (split.length == 2) {
                var [recipeName, avgRating] = split
                
                let trow = document.createElement('tr');
            
                let tcol1 = document.createElement('td'); //col 1
                tcol1.innerHTML = recipeName.replace("'", "").replace("'", "")

                let tcol2 = document.createElement('td'); //col 2
                tcol2.innerHTML = avgRating

                
                trow.appendChild(tcol1); //append col1
                trow.appendChild(tcol2); //append col2
                tbody.appendChild(trow); //append whole row

            }
        }
    })
}


async function submitPopular(url = '', params = {}, bodyObj = {}) {
    const urlString = url;
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

        // Clear out the output before showing results 
        document.getElementById("output").innerHTML = "";

        var rows = 10;


        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        table.appendChild(thead);
        table.appendChild(tbody);

        // Adding the entire table to the body tag
        document.getElementById('output').appendChild(table);

        //Adding the title
        let row_1 = document.createElement('tr');
        let heading_1 = document.createElement('th');
        heading_1.innerHTML = "Recipe Name";
        let heading_2 = document.createElement('th');
        heading_2.innerHTML = "Avg Rating";

        row_1.appendChild(heading_1);
        row_1.appendChild(heading_2);
        thead.appendChild(row_1);

        array = [];
        c = 0;
        json.split(/([()])/).filter(Boolean).forEach(e =>
            // Increase / decrease counter and push desired values to an array
            e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push(e) : {}
        );

        for (const tuple of array) {
            split = tuple.split(',');
            if (split.length == 2) {
                var [recipeName, score] = split
                
                let trow = document.createElement('tr');
            
                let tcol1 = document.createElement('td'); //col 1
                tcol1.innerHTML = recipeName.replace("'", "").replace("'", "")

                let tcol2 = document.createElement('td'); //col 2
                tcol2.innerHTML = score
                
                trow.appendChild(tcol1); //append col1
                trow.appendChild(tcol2); //append col2
                tbody.appendChild(trow); //append whole row

            }
        }

    })

}