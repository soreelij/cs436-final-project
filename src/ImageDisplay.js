import axios from 'axios';
import React, {Component} from 'react';
import {Bars} from 'react-loader-spinner';

export default class ImageDisplay extends Component {
    state = {
        image: null,
        generating: false
    }

    handleClick = () => {
        let self = this;

        self.setState({
            generating: true
        });

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
                    image: "data:image/png;base64," + rawImage,
                    generating: false
                }, () => {
                    console.log("Image data: " + self.state.image)
                })
                console.log("rendering image...");

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        return (
            <div>
                <div className="row">
                    { this.state.image ?
                        <div>
                            <img src={this.state.image}/>
                        </div> :
                        this.state.generating ?
                        <div>
                            <br />
                            <br />
                            <br />
                        </div> :
                        <div className="align-items-center justify-content-center">
                            <p>Generate an album cover below...</p>
                            <button onClick={() => this.handleClick()}>Generate image</button>
                        </div>
                    }
                    <div className="col-md">
                        <Bars
                            height="50"
                            width="50"
                            color="#4fa94d"
                            ariaLabel="bars-loading"
                            wrapperStyle={{
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                            }}
                            wrapperClass=""
                            visible={!this.state.image && this.state.generating}
                        />
                    </div>
                </div>
            </div>
        )
    }

}