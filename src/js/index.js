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
        console.log("link", films_url + "?genre=" + genre)
        let newdiv = document.createElement("div")
        let section = `
        <p class="title title__genre">${genre}</p>
        <section id="${genre}"  class="film film__container film__header">
        </section>`

        newdiv.innerHTML=section
        categories.appendChild(newdiv)

        console.log("deq", genre)
        getGenreFilm(films_url + "?genre="+ String(genre), String(genre), function(){})

    });
})

/************************************   Add films   ************************************/
filmList = []
let data = ""
function getGenreFilm(url, idCategory, callback){
    let categoryContainer = document.getElementById(idCategory)
    fetchUrl(url).then((res) => {
        
        for (let i = 0; i < res.results.length; i++) {
            if (filmList.length === 7){
                callback.call(this);
                console.log("full")
                console.log("de",filmList)
                break
            }else{  
                console.log(" not full")
                data += `
                <div class="film__content">
                    <p class="title__category">${res.results[i].title}</p>
                    <img class="img__category" src="${res.results[i].image_url}" />
                </div>` 
                filmList.push(res.results[i])
            } 
        }
        categoryContainer.innerHTML = data
    
        if (filmList.length < 7){
            getGenreFilm(res.next)
        }
    })  
    
  
}



/** 1.
 * GET TOP 7 of a CATEGORY
 * ex: getGenreFilm(films_url + "?genre=action")
 */
let bestFilmsUrl = "http://127.0.0.1:8000/api/v1/titles/?imdb_score_min=9"
let bestFilmContainer = document.getElementById('best-films')
let bestFilmList = []
const topScore = 10
getGenreFilm(bestFilmsUrl, "best-films", function(){})


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
















// genres_list.forEach(el => {
//     console.log(el)
    
// });

// //function random_item(items) {
// //    return items[Math.floor(Math.random()*items.length)];
// //}




// console.log("DDD")

