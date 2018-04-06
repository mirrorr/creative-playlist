const clientId = "8e2168c221094f9db6f346e562c69776";
const redirectUriDevelopment = "http://localhost:3001";
const redirectUriProduction = "http://creative-playlist.surge.sh";

const Spotify = {
  accessToken: null,
  expiresIn: null,

  getAccessToken(){
    if(this.accessToken){
      return this.accessToken;
    } else {
      if(window.location.href.match(/access_token=([^&]*)/)){
        this.accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
        this.expiresIn =  window.location.href.match(/expires_in=([^&]*)/)[1];
        setTimeout(function(){ this.accessToken = null }, this.expiresIn);
        window.history.replaceState({}, document.title, "/");
      } else {
        let redirectUri = process.env.NODE_ENV === "production" ? redirectUriProduction : redirectUriDevelopment;
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=playlist-modify-public`;
      }
    }
  },

  search(term){
    this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {Authorization: `Bearer ${this.accessToken}`}})
    .then(response => {
      if(response.ok){
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      if(jsonResponse.tracks){
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          album: track.album.name,
          artist: track.artists[0].name,
          uri: track.uri,
        }));
      }
    }).catch(error => {console.log(error.message); return [];});
  },

  getUserId(token){
    return fetch("https://api.spotify.com/v1/me", {headers: {Authorization: `Bearer ${token}`} })
    .then(response => {
      if(response.ok){
        return response.json();
      }
    }).then(jsonResponse => {
      return jsonResponse.id;
    });
  },

  savePlaylist(playlistName, trackURIs){
    if(!playlistName || !trackURIs){
      return;
    }
    let token = this.getAccessToken();
    if(!token){
      return;
    }
    this.getUserId(token).then(userId => {
      // Create Playlist
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: new Headers({
      		'Content-Type': 'text/plain',
          Authorization: `Bearer ${token}`
      	}),
        method: "POST",
        body: JSON.stringify({name: playlistName})
      })
      .then(response => {return response.json()})
      .then(jsonResponse => {
        let playlistID = jsonResponse.id;
        // Add tracks to playlist
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
          headers: new Headers({
        		'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        	}),
          method: "POST",
          body: JSON.stringify({"uris": trackURIs})
        });
      });
    });
  },


};

export default Spotify;
