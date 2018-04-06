import React, { Component } from 'react';
import "./SearchBar.css";

class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      term: "",
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  handleTermChange(event){
    this.setState({term: event.target.value});
  }

  handleSearch(event){
    this.props.onSearch(this.state.term);
    event.preventDefault();
  }

  render(){
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <a onClick={this.handleSearch}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
