import axios from 'axios';
import React, { Component } from 'react';

export default class ImageDisplay extends Component {
    state = {
        image: null
    }

    handleClick = () => {
        axios.post('http://127.0.0.1:7860/sdapi/v1/txt2img', {
            "prompt": "the album cover for taylor swift riding a horse",
            "steps": 1
        })
        .then(function (response) {
          console.log(response);
          var rawImage = response.data.images[0];
          this.setState({
              image: "data:image/png;base64," + rawImage
          })
          console.log("rendering image...");
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    render() {
        return(<div className="App">
            <p>Let's see if we can't generate and display an image...</p>
            <button onClick={() => this.handleClick() }>Generate image</button>
            <br />
            {this.image ?
            <div>
                <p>Here is the image:</p>
                <img src={ this.image } />
            </div> :
            <p>No image data</p>
            }
        </div>)
    }
        
}