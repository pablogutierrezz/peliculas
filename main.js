import keys from "./keys.js"

let contenedorMovie = document.querySelector(".contenedor-peliculas"),
contenedorPopular = document.querySelector(".contenedor-popular"),
inputText = document.querySelector(".buscador"),
btnMovie = document.querySelector(".btn-movie"),
next = document.querySelector(".next"),
prev = document.querySelector(".prev"),
nextP = document.querySelector(".next-popular"),
prevP = document.querySelector(".prev-popular"),
datas = document.querySelectorAll("#img-popular"),
pagePopular = 1,
numero = 1,
pageMovie = 10
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${keys.key1}&language=es-ES&page=1`)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(json=>{
    document.querySelector(".title-movies").innerHTML = "Películas recomendadas"
    document.querySelector(".errorApi1").innerHTML = ""
    json.results.forEach(el => {
        contenedorMovie.innerHTML += `
        <article class="m-1 article-movies">
                    <img src="https://image.tmdb.org/t/p/original${el.poster_path}" class="img-pelicula" alt="${el.title}">
                    <p class="h4">${el.title}</p>
        </article>
        `
    })
})
.catch(err=>{
    console.log(err);
    document.querySelector(".errorApi1").innerHTML = `error ${err.status}: ${err.statusText}`
})

function loadPopular() {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${keys.key1}&language=es-ES&page=${pagePopular}`)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(json=>{
        document.querySelector(".errorApi2").innerHTML = ""
    json.results.forEach(el => {
        contenedorPopular.innerHTML += `
    <div class="card bg-danger m-2 cardMovie" style="width: 15rem; height: 500px; overflow-x: hidden; overflow-y: auto;">
     <img src="https://image.tmdb.org/t/p/original${el.poster_path}" class="card-img-top img-pelicula" data-bs-toggle="modal" data-bs-target="#popular" id="img-popular" data-title="${el.title}" data-img="https://image.tmdb.org/t/p/original${el.poster_path}" alt="${el.title}"">
     <div class="card-body m-0 p-0">
     <h5 class="card-title">${el.title}</h5>
     <p class="card-text ">${el.overview}</p>
    </div>
   </div>
        `
    })
    document.addEventListener("click",e=>{
        if (e.target.matches("#img-popular")) {
            document.querySelector(".modal-title").innerHTML = e.target.dataset.title           
            document.querySelector(".modal-img").src = e.target.dataset.img           
        }
    })
})
.catch(err=>{
    console.log(err);
    document.querySelector(".errorApi2").innerHTML = `error ${err.status}: ${err.statusText}`
})
}
loadPopular()
nextP.addEventListener("click",e=>{
    if (pagePopular<1000) {
        pagePopular++
        contenedorPopular.innerHTML =""
        loadPopular()
    }
})
prevP.addEventListener("click",e=>{
    if (pagePopular>1){
        pagePopular--
        contenedorPopular.innerHTML =""
        loadPopular()
    }
})
async function loadMovies(value) {   
    try {
    let res = await fetch(`https://www.omdbapi.com/?s=${value}&page=${numero}&apikey=${keys.key2}`),
    json = await res.json()
    if(!res.ok) throw {status: res.status, statusText: res.statusText}
     let nm = Number(json.totalResults)
                if (pageMovie < nm) {
              next.classList.remove("disabled")     
            }else{
                next.classList.add("disabled")     
            }
            if (numero > 1) {
                prev.classList.remove("disabled")
            }else{
                prev.classList.add("disabled")
            }
     json.Search.forEach(el => { 
        document.querySelector(".title-movies").innerHTML = `resultados de <b>${value}</b>`
        contenedorMovie.innerHTML += `
        <article class="m-1 article-movies">
                    <img src="${el.Poster}" class="img-pelicula" alt="${el.Title}">
                    <p class="h4">${el.Title}</p>
                    <p>Estreno: ${el.Year}</p>
        </article>
        `
     });
     
    } catch (error) {
        document.querySelector(".title-movies").innerHTML = `no se encontraron resultados de <b>${inputText.value}</b>`
    }
}
next.addEventListener("click",e=>{
      pageMovie+= 10
       numero++
         contenedorMovie.innerHTML = ""
        loadMovies(inputText.value)
   })    
prev.addEventListener("click",e=>{
            numero--
            contenedorMovie.innerHTML = ""
            loadMovies(inputText.value)
            prev.classList.add("disabled")
   })
btnMovie.addEventListener("click",e=>{
    loadMovies(inputText.value)
    contenedorMovie.innerHTML = ""
})
inputText.addEventListener("keyup",e=>{
    if (e.key==="Enter") {
        contenedorMovie.innerHTML = ""
        loadMovies(e.target.value)
    }
})
