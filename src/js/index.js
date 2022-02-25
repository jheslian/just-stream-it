let filmsUrlSort = `http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&`
let filmsMainUrl= `http://127.0.0.1:8000/api/v1/titles/`
let genresUrl = `http://127.0.0.1:8000/api/v1/genres/`

document.body.onload = function(){
    GetGenres(genresUrl)
    GetTopFilm(filmsUrlSort)
    Carrousel()
}

/**
 * Add filter on a url
 * @param {string} url main url
 * @param {string} genre filter
 * @returns url with filter
 */
function FilmsUrlWithGenre(url, genre){
    return url.concat("&genre=",genre)
}

/**
 * fetch from API
 * @param {string} url url to fetch
 * @returns promise from fetch
 */
const FetchUrl = async function(url){
    //const keys = ["image_url", "title", "genres"]
    let response = await fetch(url)
    let res = await response.json()
    return res
}

/**
 * Modal of a film
 * 
 * displays the image and details of a film
 */
const Modal = function(){     
    let modal = document.getElementById("film-modal");
    let infoBtn = document.getElementsByClassName("info");
 
    for (let i = 0; i < infoBtn.length; i++) {
        infoBtn[i].addEventListener("click", async function() {
            const res = await FetchUrl(filmsMainUrl+this.id)
            const content = `
            <div class="modal__content">
                <span class="modal__close">&times;</span>
                <div class="modal__data">
                    <img class="modal__data--img" src="${res.image_url}" alt="con.title" onerror="${ImgError()}">
                    <div class="modal__data--details">
                        <p>Title : ${res.title}</p>
                        <p>Genre(s) : ${res.genres}</p>
                        <p>Date publish : ${res.date_published}</p>
                        <p>Rated : ${res.rated}</p>
                        <p>Score Imbd : ${res.imdb_score}</p>
                        <p>Director(s) : ${res.directors}</p>
                        <p>Actors : ${res.actors}</p>
                        <p>Duration : ${res.duration} minutes</p>
                        <p>Country of origin : ${res.countries}</p>
                        <p>World box office: ${(res.worldwide_gross_income)?res.worldwide_gross_income:"Not available"}</p>
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

/**
 * get all genres and choose 3 genres for the UI and create the container for the films
 *
 * @param {string} url genres url
 */
const genres_list = [];
const GetGenres = async function(url){
    let res = await FetchUrl(url)
    for (let i = 0; i < res.results.length; i++) {
        genres_list.push(res.results[i].name)
    }
    if (res.next)
        GetGenres(res.next) 
    if(res.next == null){
        let genres = []
        for (let i = 0; i < genres_list.length; i++) { 
            random = genres_list[Math.floor(Math.random() * genres_list.length)]
            if (genres.length < 3 && genres.indexOf(random) === -1){
                genres.push(random)
            }       
        }
        if(genres.length === 3){  
            for (let i=0; i < genres.length; i++) {
                let categories = document.getElementById('categories')
                let newdiv = document.createElement("div")
                newdiv.className = "film__block" 
                let section = `
                    <h2 class="title title__genre">${genres[i]}</h2>
                    <section id="${genres[i]}"  class="film film__container film__header">
                    </section>`

                newdiv.innerHTML=section
                categories.appendChild(newdiv)
                AddFilmToGenre(FilmsUrlWithGenre(filmsUrlSort,String(genres[i])), String(genres[i]))
            }   
        }
    }         
}    


/**
 * add films to genre containers
 * @param {string} url url to fetch
 * @param {string} idCategory genre of the film
 */
const AddFilmToGenre = async function(url, idCategory){
    let rightBtn = document.getElementsByClassName("film__container--rightBtn")
    let categoryContainer = document.getElementById(idCategory)
    let res = await FetchUrl(url)
    if(idCategory == "good-films"){
        let category= document.getElementById(idCategory)
        let btnKeys = `
            <img id="rightBtn" class="film__container--keys film__container--rightBtn" src="src/images/key.png"/>
            <img id="leftBtn" class="film__container--keys film__container--leftBtn" src="src/images/key.png"/>`
        category.innerHTML[1] = btnKeys
        if(res.next == null){
            rightBtn[0].style.visibility = "hidden";
        }else{
            rightBtn[0].style.visibility = "visible";
        }

    }
    for (let i = 0; i < res.results.length; i++) {
        if (categoryContainer.children.length != null && categoryContainer.children.length < 7){
            let filmDiv = document.createElement('div')
            filmDiv.id = "div-"+res.results[i].id
            filmDiv.className = "film__content" 
            let data = `
                <p class="title__category">${res.results[i].title}</p>
                <img id="${res.results[i].id}" class="info img__category" src="${res.results[i].image_url}" onerror="${ImgError()}"/>`
            filmDiv.innerHTML = data
            categoryContainer.appendChild(filmDiv)
        }
    }

    if (categoryContainer.children.length != null && categoryContainer.children.length< 7){
        await AddFilmToGenre(res.next, idCategory)
    }
    Modal()  
}

/**
 * this will replace the current image src if there's an error w/ the image
 *
 * @return {string} 
 */
function ImgError(){
    return "this.onerror=null; this.src='src/images/no_image.png';" 
}

/**
 *  top rated films  
 */
let goodFilmsUrl = filmsUrlSort+"&page=1"
let genre = "good-films"
AddFilmToGenre(goodFilmsUrl ,genre)


/**
 * get the top film
 * @param {string} url 
 */
const GetTopFilm = async function(url) {
    let bestFilmContainer = document.getElementById("best-film")
    let res = await FetchUrl(url)
    console.log("des", res.results[0])
    let filmDetail = await FetchUrl(res.results[0].url)
    let data = `
        <div class="top-film__data">
            <h1 class="top-film__title">${res.results[0].title}</h1>
            <p>${filmDetail.description}</p>
            <button class="btn btn__play"><i class="fa fa-play"></i> Play</button>
            <button id="${res.results[0].id}" class="btn btn__info info">&#9432; More info</button>     
        </div>    
        <img class="top-film__img" src="${res.results[0].image_url}" onerror="${ImgError()}"/> 
        ` 
    bestFilmContainer.innerHTML = data
    Modal()
}


/**
 * carrousel for the top rating film
 */
const Carrousel = function(){
    let rightBtn = document.getElementsByClassName("film__container--rightBtn");
    let leftBtn = document.getElementsByClassName("film__container--leftBtn");
    let goodFilm = document.getElementById('good-films')
    let currentPage = 1

    for (let i = 0; i < rightBtn.length; i++) {
        rightBtn[i].addEventListener("click", async function() {
            currentPage = currentPage+1
            if(currentPage > 1){
                leftBtn[i].style.visibility = "visible";
            }
            let linkPage = filmsUrlSort+"&page="+currentPage
            goodFilm.innerHTML = ""
            await AddFilmToGenre(linkPage,'good-films' )
        });
    }
    for (let i = 0; i < leftBtn.length; i++) {
        leftBtn[i].addEventListener("click", async function() {
            currentPage = currentPage-1
            if(currentPage === 1){
                leftBtn[i].style.visibility = "hidden";
            }
            let linkPage = filmsUrlSort+"&page="+currentPage
            goodFilm.innerHTML = ""
            await AddFilmToGenre(linkPage,'good-films' )
        });
    }  
}

