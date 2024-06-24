const API_KEY = 'api_key=3114841b93c14134f21f08516695c3ac&language=en-US';
const BASE_URL = 'https://api.themoviedb.org/3';
const popular = BASE_URL + '/movie/popular?' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;
const topRated = BASE_URL + '/movie/top_rated?' + API_KEY;
const upcoming = BASE_URL + '/movie/upcoming?' + API_KEY;
const now = BASE_URL + '/movie/now_playing?' + API_KEY;
// const detail = BASE_URL+`/movie/${id}?`+API_KEY;



const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const toprated = document.getElementById('toprated');
const upcoming_id = document.getElementById('upcoming');
const now_playing = document.getElementById('nowplaying');
const tagsEl = document.getElementById('tags');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');
const pagination = document.getElementById('pagination');
const md = document.getElementById('movie-detail');



const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = "";
var totalPages = 100;
let nopage = 1;

let selectedGenre = []
setGenre();
function setGenre() {
    tagsEl.innerHTML = ''
    genres.map(genre => {
        const e = document.createElement('div');
        e.classList.add('tag');
        e.id = genre.id;
        e.innerText = genre.name
        e.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id);
            }
            else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.map((id, idx) => {
                        if (id == genre.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            md.innerHTML=" "
            getMovies(BASE_URL + '/discover/movie?' + API_KEY + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(e);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }
}

function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.classList.add('highlight')
    } else {
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(popular);
            md.innerHTML=" "
        })
        tagsEl.append(clear);
    }
}
getMovies(popular);
//getMovies is getting the url and fetching the movies information with the help of api
function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        // console.log(data.results);
        if (data.results.length !== 0) {
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;
            current.innerText = currentPage;

            if (currentPage <= 1) {
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            } else if (currentPage >= totalPages) {
                prev.classList.remove('disabled');
                next.classList.add('disabled')
            } else {
                prev.classList.remove('disabled');
                next.classList.remove('disabled')
            }
            tagsEl.scrollIntoView({ behavior: 'smooth' })
        } else {
            main.innerHTML = `<h1 class="no-results">No results found</h1>`
        }
    })
}
//this is the main element of the page which are showing the movie poster and the rating of the movie 
function showMovies(data) {
    pagination.classList.remove('mr')
    main.innerHTML = '';
    nopage=1
    data.map(movie => {
        const { title, poster_path, vote_average,id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" id=${id} alt="${title}">
            <div class="movie-info" id=${id}>
                <h3>${title}</h3>
                <span class="${vote_average}">${vote_average}</span>
            </div>
        `
        main.appendChild(movieEl);
//this is redirecting to the details of the movie selected 
        movieEl.addEventListener('click',()=>{
            const  detail = BASE_URL+`/movie/${id}?`+API_KEY;
            fetch(detail).then(res => res.json()).then(data => {
                showPic(data)
            })
        })
    })
}

function showPic(movie){
    // window.location.href = "/html/movie_detail.html";
    nopage = 0;
    // console.log(movie);
    main.innerHTML=" "
    prev.classList.add('disabled')
    next.classList.add('disabled')
    pagination.classList.add('mr')
    md.innerHTML=`    
    <img src="${movie.backdrop_path ? IMG_URL + movie.backdrop_path : "http://via.placeholder.com/1080x1580"}" >
    <div class="det">
        <div class="movie__detailLeft">
            <div class="movie__posterBox" id="movie_posterBox" >
                <img src="${movie.poster_path ? IMG_URL + movie.poster_path : "http://via.placeholder.com/1080x1580"}" >
            </div>
        </div>
        <div class="movie__detailRight">
                <div class="movie__detailRightTop">
                    <div class="movie__name">${movie.original_title ? movie.original_title : ""}</div>
                    <div class="movie__tagline">${movie.tagline ? "Tagline : "+movie.tagline : ""}</div>
                    <div class="movie__rating">
                        <span class="movie__voteCount">  ${"Rating : "} ${movie.vote_average ?movie.vote_average: ""}${movie.vote_count ? "(" + movie.vote_count + ")votes" : ""}</span>
                    </div>  
                    <div class="movie__runtime">${movie.runtime ? "Runtime : " + movie.runtime + " mins" : ""}</div>
                    <div class="movie__releaseDate">${movie.release_date ? "Release date: " + movie.release_date : ""}</div>
                    <div class="movie__releaseDate">${movie.popularity ? "Popularity : " + movie.popularity : ""}</div>
                    <div class="movie__releaseDate">${movie.budget ? "Budget : " + movie.budget : ""}</div>
                    <div class="movie__releaseDate">${movie.revenue ? "Revenue : " + movie.revenue : ""}</div>
                    
                    <div class="movie__releaseDate">${movie.original_language ? "Language : " + movie.original_language : ""}</div>
                </div>
            <div class="movie__detailRightBottom">
                <div class="synopsisText">Information : </div>
                <div>${movie.overview ? movie.overview : ""}</div>
            </div>
            <div class="movie__links">
                <div class="movie-h"> 
                    <h1 style="color:white" > Useful Links : </h1> 
                    <button class="tag"><a class="mdhead" href=${movie.homepage ? movie.homepage : "" } >Homepage Link</a></button>
                    <button class="tag"><a class="mdhead" href=${movie.imdb_id ? "https://www.imdb.com/title/" + movie.imdb_id : ""}>IMDB Link</a></button>
                </div>
            </div>
        </div>
    </div>   
    `
}
//this is getting the value from search bar and searching for the movies
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchterm = search.value
    selectedGenre = []
    setGenre();
    if (searchterm) {
        getMovies(searchURL + '&query=' + searchterm)
        md.innerHTML = " "
        pagination.classList.remove('mr')
    }
    else {
        getMovies(popular);
        pagination.classList.remove('mr')
    }
})
//this is getting the top rated movies
toprated.addEventListener('click', (e) => {
    md.innerHTML=" "
    getMovies(topRated);
    nopage=1
    pagination.classList.remove('mr')
})
// this is getting the now playing movies
now_playing.addEventListener('click', (e) => {
    md.innerHTML=" "
    getMovies(now);
    nopage=1
    pagination.classList.remove('mr')
})
//this is getting the upcoming movies
upcoming_id.addEventListener('click', (e) => {
    md.innerHTML=" "
    getMovies(upcoming);
    pagination.classList.remove('mr')
    nopage=1
})
//this is for the previou page of pagination
prev.addEventListener('click', () => {
    if(nopage == 1){
        if (prevPage > 0) {
            pageCall(prevPage);
        }
    }
    else{
        console.log("No previous page");
    }
})
//this is for the next page of pagination
next.addEventListener('click', () => {
    if(nopage == 1){
        if (nextPage <= totalPages) {
            pageCall(nextPage);
        }
    }else{
        console.log("No next page");
    }
})
//this is getting the current url and then it is adding the page parameter at the end of it and then the url is passed to the getMovies function
function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] != 'page') {
        let url = lastUrl + '&page=' + page
        getMovies(url);
    } else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b
        getMovies(url);
    }
}
/*
understanding of page call function
// let b;
// console.log(lastUrl.split('?'))
// b=lastUrl.split('?');
// console.log(b[1].split('&'))
// let key = b[b.length-1].split('=')
// console.log(key)
// let url = lastUrl+'&page'+nextPage
// console.log(url)
*/

// https://api.themoviedb.org/3/movie/?api_key=3114841b93c14134f21f08516695c3ac&language=en-US
