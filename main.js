$(document).ready(() => {
	axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
	.then((response) => {
      console.log(response);
      let movies = response.data.results;
      let output = '';
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}">
              <h5>${movie.original_title}</h5>
              <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });

      $('#CurrentMovies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText){
  axios.get('https://api.themoviedb.org/3/search/movie?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4&query='+searchText)
    .then((response) => {
      console.log(response);
      let movies = response.data.results;
      let output = '';
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}">
              <h5>${movie.original_title}</h5>
              <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}
function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get('https://api.themoviedb.org/3/movie/'+movieId+'?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
    .then((response4) => {
      //console.log(response4);
      let movie = response4.data;
	 
  axios.get('https://api.themoviedb.org/3/movie/'+movieId+'/credits?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
	.then((response2) => {
      //console.log(response2);
      let casts = response2.data.cast;
	  
  axios.get('https://api.themoviedb.org/3/movie/'+movieId+'/similar?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
    .then((response3) => {
      //console.log(response3);
      let similarMovies = response3.data.results;
	  console.log(similarMovies);
	  let similarOutput = '';
      $.each(similarMovies, (index, similarMovie) => {
        similarOutput += `
		<div class="row">
          <div class="col-md-3">
            <div class="well">
              <img src="https://image.tmdb.org/t/p/w185/${similarMovie.poster_path}">
              <h5>${similarMovie.original_title}</h5>
              <a onclick="movieSelected('${similarMovie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
		</div>
        `;
      });

      $('#similarMovies').html(similarOutput);
	  
	  let outCast = '';
	  let count = 0;
	  let castIMDB = '';
		$.each(casts, (index, cast) => {
		if(count < 10){
		castId = $(cast.id);
		console.log(castId[0]);
		axios.get('https://api.themoviedb.org/3/person/'+castId[0]+'?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
		.then((response5) => {
		castIMDB = response5.data;
		console.log(castIMDB);
		})

		count++;
        outCast += `
          <li>${cast.name}</li> <a href="http://imdb.com/name/${castIMDB.imdb_id}" target="_blank">View IMDB page</a>

		  
        `;

      }
		});
      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}">
          </div>
          <div class="col-md-8">
            <h2>${movie.original_title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Budget:</strong> ${movie.budget}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.release_date}</li>
              <li class="list-group-item"><strong>Run Time:</strong> ${movie.runtime} Minutes</li>
              <li class="list-group-item"><strong>Language:</strong> ${movie.original_language}</li>
              <li class="list-group-item"><strong>Over View:</strong> ${movie.overview}</li>	
			  <li class="list-group-item"> <strong>Full Cast:</strong>			
				<ul>${outCast}</ul>
			  </li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <hr>
            <a href="http://imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
	})
	})
    .catch((err) => {
      console.log(err);
    });
	/*
	axios.get('https://api.themoviedb.org/3/movie/'+movieId+'/similar?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
    .then((response3) => {
      console.log(response3);
      let similarMovies = response3.data.results;
      let similarOutput = '';
      $.each(SimilarMovies, (index, similarMovie) => {
        similarOutput += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="https://image.tmdb.org/t/p/w185/${similarMovie.poster_path}">
              <h5>${similarMovie.original_title}</h5>
              <a onclick="movieSelected('${similarMovie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });

      $('#similarMovies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
	*/
	
}
