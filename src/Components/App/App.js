import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';

import Spotify from '../../util/Spotify.js';

const playlistName = "Favorite playlist #1";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: playlistName,
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    if(!(this.state.playlistTracks.find(x => x.id === track.id))){
      let new_playlist = this.state.playlistTracks;
      new_playlist.push(track);
      this.setState({playlistTracks: new_playlist});
    }
  }

  removeTrack(track){
    let new_playlist = this.state.playlistTracks.filter(x => x.id !== track.id);
    this.setState({playlistTracks: new_playlist});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(x => x.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistTracks: [], playlistName: playlistName});
  }

  search(term){
    Spotify.search(term).then(
      searchResults => {
        this.setState({searchResults: searchResults});
      }
    );
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
