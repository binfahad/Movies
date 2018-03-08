$(document).ready(() => {
	// Whenever the page is ready, we will get all the movies that are playing now, then display them to the user.
	axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
	.then((response) => {
      console.log(response);
	//We assign the results (Array of arrays) to the variable 'movies'.
      let movies = response.data.results;
      let output = '';
	//We loop through each array and collect the info. that we want into the variable 'output'.
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
	// Now we display the collected info to the user.
      $('#CurrentMovies').html(output);
    })
    .catch((err) => { // Handler in case of an error.
      console.log(err);
    });
	//This is for the search fucntionality, when the user press Enter, getMovies() function will be executed.
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText){
	//We will get the user String, then search for all the matches.
  axios.get('https://api.themoviedb.org/3/search/movie?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4&query='+searchText)
    .then((response) => {
	  //Exactly like the previous step, Collect then display.
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

// In case the user clicked on the "Movie Detailes" bottun, he will be taken to "movie.html" page.
// where the function 'getMovie()' is called.
function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

//Called from 'movie.html' page.
function getMovie(){
  // Just to store the movieId during the session.
  let movieId = sessionStorage.getItem('movieId');
  // we will get more information about the movie using its id.
  axios.get('https://api.themoviedb.org/3/movie/'+movieId+'?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
    .then((response) => {
      //console.log(response4); For Testing
      let movie = response.data;
  // we will get information about the cast of the movie.	 
  axios.get('https://api.themoviedb.org/3/movie/'+movieId+'/credits?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
	.then((response) => {
      //console.log(response2); For Testing
      let casts = response.data.cast;
  // we will get the similar movies for any selected movie.	  
  axios.get('https://api.themoviedb.org/3/movie/'+movieId+'/similar?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
    .then((response) => {
      //console.log(response3); For Testing
      let similarMovies = response.data.results;
	  //console.log(similarMovies); For Testing
	  let similarOutput = '';
	// Same as before, collect the similar movies and display them to the user.
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
	  
	  //output
	  let outCast = '';
	  //counter to print the first 10 actors/actresses only.
	  let count = 0;
	  let castIMDB = '';
		$.each(casts, (index, cast) => {
		if(count < 10){
		//get the (actor or actress) id
		castId = $(cast.id);
		console.log(castId[0]);
		// now we get more info. about the (actor or actress), which includes the IMDB_id.
		axios.get('https://api.themoviedb.org/3/person/'+castId[0]+'?api_key=ca3dd1c611b215e8c0bfd3726e0ff9c4')
		.then((response) => {
		castIMDB = response.data;
		console.log(castIMDB);
		})

	count++;
	//My idea was to provide IMDB link for each (actor or actress), but I'm having a problem 
	//with concating the (imdb_id) to the href link.
        outCast += `
          <li>${cast.name}</li> 
	  <a href="http://imdb.com/name/${castIMDB.imdb_id}" target="_blank">View IMDB page</a>

		  
        `;

      }
});
	  // collect the info about the sellected movie and display them to user.
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
	// we add to buttons to the user, one to take them to IMDB page for the movie,
	// the other to take the user to the home page.
      $('#movie').html(output);
    })
  })
})
    .catch((err) => {
      console.log(err);
    });
	
}
