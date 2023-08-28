function display_none(){
    document.getElementById('join-result').style.display = 'none';
    document.getElementById('private-result').style.display = 'none';
    document.getElementById('join-oops').style.display = 'none';
    document.getElementById('private-oops').style.display = 'none';
}
display_none();

async function private_party(){
    display_none();
    var search_movie = document.getElementById('private-value').value;
    search_movie = search_movie.trim();
    console.log(search_movie);
    if (document.getElementById('private-value').value){
    // console.log(join_link);
        private_movie_details_await = await fetch('/search/'+search_movie);
        private_movie_details = await private_movie_details_await.json();
        console.log(private_movie_details);
        if (private_movie_details != null){
            document.getElementById('private-img-res').src = private_movie_details.poster;
            document.getElementById('private-result').style.display = 'block';
            //console.log(movie_details);
        }
        else{
        document.getElementById('private-oops').style.display = 'block';
        }
    }
    else{
        document.getElementById('private-oops').style.display = 'block';
        }



}
async function join_party(){
    display_none();
    var join_link = document.getElementById('join-value').value;
    if (join_link.endsWith('/')){
        var join_link = join_link.slice(0, -1);
        var inp_session = join_link.split('/').pop();
    }
    else{
        var inp_session = join_link.split('/').pop()
    }
    // console.log(join_link);
       console.log(inp_session);

    if (inp_session){
        movie_details_await = await fetch('/joininfo/'+inp_session);
        movie_details = await movie_details_await.json();
        console.log(movie_details);
        if (movie_details != null){
            document.getElementById('join-img-res').src = movie_details.poster;
            document.getElementById('join-result').style.display = 'block';
            //console.log(movie_details);
        }
        else{
            document.getElementById('join-oops').style.display = 'block';
        }
    }
    else{
        document.getElementById('join-oops').style.display = 'block';
    }
}

