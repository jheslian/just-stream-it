let films_url = `http://127.0.0.1:8000/api/v1/titles/?`
let filmRelPath= `http://127.0.0.1:8000/api/v1/titles/`
let genre_url = `http://127.0.0.1:8000/api/v1/genres/`
let sort = "&sort_by=-imdb_score"
let pages = [1, 2 , 3, 4, 5, 6, 7, 8, 9, 10]
//let pageNo = pages[Math.floor(Math.random() * pages.length)]


function filmUrl(mainURL, genre){
    //return mainURL.concat("&genre=",genre,sort)
    console.log("film url", mainURL.concat("&genre=",genre,sort))
    return mainURL.concat("&genre=",genre,sort)
}



/**
 * get data
 *
 * @param {string} url
 * @return {promise} data
 */
const fetchUrl = function(url) {
    return fetch(url).then((response) => response.json())
}

const handleErrors = function(response){
    if(!response.ok){
        throw(response.status + ': ' + response.statusText)
    }
}

/**
 * get all categories and create its container
 *
 * @param {string} url
 * @param {function} callback
 */
const genres_list = [];
const getGenres = async function(url){
    //.then((err) => handleErrors(err))
    let response = await fetch(url)
    let res = await response.json()
    for (let i = 0; i < res.results.length; i++) {
        genres_list.push(res.results[i].name)
    }
    if (res.next)
        getGenres(res.next) 
    if(res.next == null){
        let genres = []
        for (let i = 0; i < genres_list.length; i++) { 
            random = genres_list[Math.floor(Math.random() * genres_list.length)]
            if (genres.length < 3 && genres.indexOf(random) === -1){
                genres.push(random)
            }       
        }
        if(genres.length === 3){
            genres = ["Drama", "Crime", "Action"]
           // console.log('rendoom genres',genres)
            for (let i=0; i < genres.length; i++) {
                //console.log("gen", genres[i])
                let categories = document.getElementById('categories')
                let newdiv = document.createElement("div")
                newdiv.className = "film__block" 
                let section = `
                <p class="title title__genre">${genres[i]}</p>
                
                <section id="${genres[i]}"  class="film film__container film__header">
                </section>`

                newdiv.innerHTML=section
                categories.appendChild(newdiv)
                
            
                getGenreFilm(filmUrl(films_url,String(genres[i])), String(genres[i]))
                
                
            }
            
        }
    }    
       
}    

getGenres(genre_url)
//console.log("list 25", genres_list)
const getGenreFilm = async function(url, idCategory){
    //console.log("ffff")
    let rightBtn = document.getElementsByClassName("film__container--rightBtn")
    let categoryContainer = document.getElementById(idCategory)
    let response = await fetch(url)
    handleErrors(response)
    let res = await response.json()
    console.log("full",  idCategory, res.results)
    if(idCategory == "good-films"){
        let category= document.getElementById(idCategory)
        let btnKeys = `<img id="rightBtn" class="film__container--keys film__container--rightBtn" src="src/images/key.png"/>
            <img id="leftBtn" class="film__container--keys film__container--leftBtn" src="src/images/key.png"/>`
        category.innerHTML[1] = btnKeys
        //console.log("in good", res.next == null)
        if(res.next == null){
            rightBtn[0].style.visibility = "hidden";
        }else{
            rightBtn[0].style.visibility = "visible";
        }

    }
    for (let i = 0; i < res.results.length; i++) {
        //console.log("dery", res.results[i].title)
        if (categoryContainer.children.length != null && categoryContainer.children.length < 7){
            let filmDiv = document.createElement('div')
            filmDiv.id = "div-"+res.results[i].id
            filmDiv.className = "film__content"
            categoryContainer.appendChild(filmDiv)
            filmContainer = document.getElementById("div-"+res.results[i].id)
            console.log("title", res.results[i].title)
        
            let data = `
                <p class="title__category">${res.results[i].title}</p>
                <img id="${res.results[i].id}" class="info img__category" src="${res.results[i].image_url}" onerror="${imgError()}"/>`
            filmContainer.innerHTML = data

        } 
    }
    

    if (categoryContainer.children.length != null && categoryContainer.children.length< 7){
        await getGenreFilm(res.next, idCategory)
    }
    modal()  
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
let goodFilmsUrl = "http://127.0.0.1:8000/api/v1/titles/?imdb_score_min=9&page=".concat(1)
let idCategory = "good-films"
let bestFilmUrl = films_url.concat(sort)
getGenreFilm(goodFilmsUrl ,idCategory)


/**************   best film   **************/
const bestFilm = async function(url) {

let bestFilmContainer = document.getElementById("best-film")
let response = await fetch(bestFilmUrl)
let res = await response.json()
let data = `
    <div class="top-film__data">
        <p class="top-film__title">${res.results[0].title}</p>
        <button class="btn btn__play"><i class="fa fa-play"></i> Play</button>
        <button id="${res.results[0].id}" class="btn btn__info info">&#9432; More info</button>
    </div>    
    <img class="top-film__img" src="${res.results[0].image_url}"  onerror="${imgError()}"/> 
    ` 
bestFilmContainer.innerHTML = data
modal()


}
const filmContent = async function(url){
    //const keys = ["image_url", "title", "genres"]
    let response = await fetch(url)
    let res = await response.json()
    return res
}

bestFilm(bestFilmUrl)


const modal = function(){     
    /**************   modal   **************/
    let modal = document.getElementById("film-modal");
    let infoBtn = document.getElementsByClassName("info");
 
    for (let i = 0; i < infoBtn.length; i++) {
        infoBtn[i].addEventListener("click", async function() {
            console.log("cmodal no: ", this.id)
            //let filmId = getElementById(infoBtn[i].id)
            const res = await filmContent(filmRelPath+this.id)
            const content = `
            <div class="modal__content">
                <span class="modal__close">&times;</span>
                <div class="modal__data">
                    <img src="${res.image_url}" alt="con.title">
                    <div class="modal__data--details">
                        <p>Title : ${res.title}</p>
                        <p>Genre(s) : ${res.genres}</p>
                        <p>Date publish : ${res.date_published}</p>
                        <p>Rated : ${res.genres}</p>
                        <p>Score Imbd : ${res.genres}</p>
                        <p>Director(s) : ${res.directors}</p>
                        <p>Actors : ${res.actors}</p>
                        <p>Duration : ${res.duration} minutes</p>
                        <p>Country of origin : ${res.countries}</p>
                        <p>Box office result : ${res.votes}</p>
                        <p>Description : ${res.description}</p>
                    <div>    
                </div>
            </div>` 
            modal.innerHTML = content
            
            modal.style.display = "block";
            document.getElementsByClassName("modal__close")[0].addEventListener("click", function(){
                modal.style.display = "none";
            })

        });
    }
}

const carrousel = function(){
    //  const res = await filmContent(filmRelPath+filmId)
   
  
    let rightBtn = document.getElementsByClassName("film__container--rightBtn");
    let leftBtn = document.getElementsByClassName("film__container--leftBtn");
    let goodFilm = document.getElementById('good-films')
    let currentPage = 1

    for (let i = 0; i < rightBtn.length; i++) {
        
        rightBtn[i].addEventListener("click", async function() {
            currentPage= currentPage+1
            
            if(currentPage > 1){
                leftBtn[i].style.visibility = "visible";
            }
            
            console.log("c page",  currentPage)
            let linkPage = "http://127.0.0.1:8000/api/v1/titles/?imdb_score_min=9&page="+currentPage
            console.log("link", linkPage)
            goodFilm.innerHTML = ""
            await getGenreFilm(linkPage,'good-films' )
            // if (maxPage < nextPage){
            //     maxPage = nextPage
            // }
            //currentPage+1
        });
    }
    for (let i = 0; i < leftBtn.length; i++) {
        
        leftBtn[i].addEventListener("click", async function() {
            
            currentPage = currentPage-1
            if(currentPage === 1){
                leftBtn[i].style.visibility = "hidden";
            }
            console.log("prev page", currentPage)
            let linkPage = "http://127.0.0.1:8000/api/v1/titles/?imdb_score_min=9&page="+currentPage
            console.log("link", linkPage)
            goodFilm.innerHTML = ""
            await getGenreFilm(linkPage,'good-films' )
            //currentPage-1
            
        });
    }  
    
}
document.body.onload = function(){
    carrousel()
}
