let films_url = `http://127.0.0.1:8000/api/v1/titles/?`
let genre_url = `http://127.0.0.1:8000/api/v1/genres/`
let sort = "&sort_by=-imdb_score"
let pages = [1, 2 , 3, 4, 5, 6, 7, 8, 9, 10]
let pageNo = pages[Math.floor(Math.random() * pages.length)]


function filmUrl(mainURL, genre){
    return mainURL.concat("&genre=",genre,sort)

    //return mainURL.concat("&genre=",genre,"&page=",pageNo,sort)
}
   
       
    
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
        //console.log( res.next == null)
        if (res.next)
            getGenres(res.next, callback)
        if(res.next == null){
            callback.call(this);
        }    
    }).catch(error => console.log(error))     
}    

/*******************************     Add categories     *******************************/
/*
 * get 3 random categories and add films that correspond  
 */
getGenres(genre_url, function(){
    let genres = []
    for (let i = 0; i < genres_list.length; i++) { 
        random = genres_list[Math.floor(Math.random() * genres_list.length)]
        if (genres.length < 3 && genres.indexOf(random) === -1){
            genres.push(random)
        }       
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

        getGenreFilm(filmUrl(films_url,String(genre)), String(genre))

    });
})

/************************************   Add films   ************************************/
//filmList = []
//let data = ""


async function getGenreFilm(url, idCategory){
    let categoryContainer = document.getElementById(idCategory)
    console.log("1", categoryContainer.children.length === 7)
   
    await fetchUrl(url).then((res) => {  
       // console.log("res.status",res.status) 
       
        for (let i = 0; i < res.results.length; i++) {
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
    }).catch(error => console.log(error))
}

/**
 * this will replace the current image src if there's an error w/ the image
 *
 * @return {string} 
 */
function imgError(){
    return "this.onerror=null; this.src='src/images/no_image.png';" 
}

/**************   top rated films   **************/
let goodFilmsUrl = "http://127.0.0.1:8000/api/v1/titles/?imdb_score_min=9&page=".concat(pageNo)
let idCategory = "good-films"
getGenreFilm(goodFilmsUrl ,idCategory )


/**************   best film   **************/
bestFilmUrl = films_url.concat(sort)
//console.log("ded", bestFilmUrl)
let bestFilmContainer = document.getElementById("best-film")
fetchUrl(bestFilmUrl).then((res) => {
    let data = `
        <div class="top-film__data">
            <p class="top-film__title">${res.results[0].title}</p>
            <button class="btn btn__play"><i class="fa fa-play"></i> Play</button>
            <button class="btn btn__info">&#9432; More info</button>
        </div>    
        <img class="top-film__img" src="${res.results[0].image_url}"  onerror="${imgError()}"/> 
        ` 
    bestFilmContainer.innerHTML = data

})

/** 4. 
 * CREATE film modal
 */


