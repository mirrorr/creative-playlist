import React, {Component} from "react";
import "./TrackList.css";
import Track from "../Track/Track.js";

class TrackList extends Component {
  render(){
    if(this.props.tracks){
      return(
        <div className="TrackList">
          {
            this.props.tracks.map((track) =>
              <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>
            )
          }
        </div>
      );
    } else {
      return null;
    }
  }
}

export default TrackList;
