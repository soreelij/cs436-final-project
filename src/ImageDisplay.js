import axios from 'axios';
import React, { Component } from 'react';

export default class ImageDisplay extends Component {
    state = {
        image: null
    }

    handleClick = () => {
        var self = this;
        axios({
            method: 'post',
            url: 'http://127.0.0.1:7860/sdapi/v1/txt2img',
            data: {
                "prompt": "the album cover for mormon missionaries",
                "steps": 1
            }
        })
        .then(function (response) {
          console.log(response);
          var rawImage = response.data.images[0];
          self.setState({
              image: "data:image/png;base64," + rawImage
          }, () =>  {console.log("Image data: " + self.state.image)})
          console.log("rendering image...");

        })
        .catch(function (error) {
          console.log(error);
        });
    }

    render() {

        return(
            <div className="App">
            <p>Let's see if we can't generate and display an image...</p>
            <button onClick={() => this.handleClick()}>Generate image</button>
            <br />
            {this.state.image ?
                <div>
                    <p>Here is the image:</p>
                    <img src={ this.state.image } />
                </div> :
                <p>No image data</p>
            }
        </div>
        )
    }
        
}