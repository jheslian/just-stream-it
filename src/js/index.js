let films_url = `http://127.0.0.1:8000/api/v1/titles/`
let genre_url = `http://127.0.0.1:8000/api/v1/genres/`

function fetchUrl(url) {
    // fetch url
    return fetch(url).then((response) => response.json())
}

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
getGenres(genre_url, function(){
    let genres = []
    for (let i = 0; i < 3; i++) { 
        random = genres_list[Math.floor(Math.random() * genres_list.length)]
        genres.push(random)        
    }
    console.log("ran", genres)


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

        let cat = document.getElementById(genre)
        getGenreFilm(films_url + "?genre=" + genre, cat)

    });
})


filmList = []
let data = ""
function getGenreFilm(url, cat){
    fetchUrl(url).then((res) => {
        
        for (let i = 0; i < res.results.length; i++) {
            console.log("in",res.results[i].title )
            if (filmList.length === 7){
               break
            }    
            
            data += `
            <div class="film__content">
                <p class="title__category">${res.results[i].title}</p>
                <img class="img__category" src="${res.results[i].image_url}" />
            </div>` 
            filmList.push(res.results[i])
            
        }
        cat.innerHTML = data

        
        console.log("in",filmList)
        if (filmList.length < 7){
            getGenreFilm(res.next)
        }
        console.log("after loop", filmList)
    })  
  
}



/** 1.
 * GET TOP 7 of a CATEGORY
 * ex: getGenreFilm(films_url + "?genre=action")
 */

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



// // console.log('io',filmList[1].id);
// // for (let i = 0; i < filmList.length; i++) { 
// //     console.log("oo", filmList[1].id)
    
// //   }


// console.log("DDD")

