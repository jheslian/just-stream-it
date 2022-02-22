let films_url = `http://127.0.0.1:8000/api/v1/titles/`
let genre_url = `http://127.0.0.1:8000/api/v1/genres/`

/**
 * get data
 *
 * @param {string} url
 * @return {promise} data
 */
function fetchUrl(url) {
    return fetch(url).then((response) => response.json())
}

/**
 * get all categories
 *
 * @param {string} url
 * @param {function} callback
 */
const genres_list = [];
function getGenres(url, callback){
    fetchUrl(url).then((res) => {
        for (let i = 0; i < res.results.length; i++) {
            genres_list.push(res.results[i].name)
        }
        console.log( res.next == null)
        if (res.next)
            getGenres(res.next, callback)
        if(res.next == null){
            callback.call(this);
        }    
    })     
}    

/*******************************     Add categories     *******************************/
/*
 * get 3 random categories and add films that correspond  
 */
getGenres(genre_url, function(){
    let genres = []
    for (let i = 0; i < 3; i++) { 
        random = genres_list[Math.floor(Math.random() * genres_list.length)]
        genres.push(random)        
    }

    let categories = document.getElementById('categories')
    genres.forEach(function(genre) {
        let newdiv = document.createElement("div")
        let section = `
        <p class="title title__genre">${genre}</p>
        <section id="${genre}"  class="film film__container film__header">
        </section>`

        newdiv.innerHTML=section
        categories.appendChild(newdiv)

        getGenreFilm(films_url + "?genre="+ String(genre), String(genre), function(){})

    });
})

/************************************   Add films   ************************************/
//filmList = []
//let data = ""
function getGenreFilm(url, idCategory, callback){
    let categoryContainer = document.getElementById(idCategory)
    if (categoryContainer.children.length != null && categoryContainer.children.length === 7){
        callback.call(this);
    }
    fetchUrl(url).then((res) => {
        
        for (let i = 0; i < res.results.length; i++) {
           
            // if (categoryContainer.children.length != null && categoryContainer.children.length === 7){
            //     //callback.call(this);
            //     console.log("full")
            //    // console.log("de",filmList)
            //     break
            // }
            if (categoryContainer.children.length != null && categoryContainer.children.length < 7){
               // console.log(" not full")
                let filmDiv = document.createElement('div')
                filmDiv.id = res.results[i].id
                filmDiv.className = "film__content"
                categoryContainer.appendChild(filmDiv)
                filmContainer = document.getElementById(res.results[i].id)
            
                let data = `
                    <p class="title__category">${res.results[i].title}</p>
                    <img class="img__category" src="${res.results[i].image_url}"  onerror="${imgError()}"/> ` 
                filmContainer.innerHTML = data
            } 
        }
        
        if (categoryContainer.children.length != null && categoryContainer.children.length< 7){
            getGenreFilm(res.next, idCategory)
        }
    }).catch( error => console.log(error) )
}

/**
 * this will replace the current image src if there's an error w/ the image
 *
 * @return {string} 
 */
function imgError(){
    return "this.onerror=null; this.src='src/images/no_image.png';" 
}

/** 1.
 * GET TOP 7 of a CATEGORY
 * ex: getGenreFilm(films_url + "?genre=action")
 */
//let bestFilmsUrl = "http://127.0.0.1:8000/api/v1/titles/?imdb_score_min=9"
let bestFilmsUrl = "http://127.0.0.1:8000/api/v1/titles/?genre=Biography"
const topScore = 10
let idCategory = "best-films"
getGenreFilm(bestFilmsUrl,idCategory )
let categoryContainer = document.getElementById(idCategory)
console.log("fix", categoryContainer.children.length)
while (categoryContainer.children.length && categoryContainer.children.length < 8){
    console.log("test")
}


/** 2. 
 * GET TOP 7 of all film : random from diff category
 * check : that its not on the category
 */

/** 3. 
 * GET TOP 1 of all film
 * check : that its not on the previous list(1 & 2)
 */

/** 4. 
 * CREATE film modal
 */


