import axios from 'axios';
import React, {Component} from 'react';
import {Bars} from 'react-loader-spinner';

export default class ImageDisplay extends Component {
    state = {
        images: [],
        generating: false
    }

    requestImages = () => {
        let self = this;

        for (let i = 0; i < 3; i++) {
            axios({
                method: 'post',
                url: 'http://127.0.0.1:7860/sdapi/v1/txt2img',
                data: {
                    "prompt": "the album cover for mormon missionaries",
                    "steps": 20,
                }
            })
            .then(function (response) {
                console.log(response);
                let rawImage = response.data.images[0];
                self.setState({
                    images: [...self.state.images, "data:image/png;base64," + rawImage]
                }, () => {
                    console.log("Image" + i + ": " + self.state.images[i])
                })
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    handleClick = () => {
        let self = this;

        self.setState({
            generating: true
        });

        this.requestImages();
    }

    render() {

        return (
            <div>
                <div className="row">
                    { this.state.images.length === 3 ?
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-xs-4">
                                <img className="img-fluid" src={this.state.images[0]}/>
                            </div>
                            <div className="col-lg-4 col-md-4 col-xs-4">
                                <img className="img-fluid" src={this.state.images[1]}/>
                            </div>
                            <div className="col-lg-4 col-md-4 col-xs-4">
                                <img className="img-fluid" src={this.state.images[2]}/>
                            </div>
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
                            visible={this.state.images.length !== 3 && this.state.generating}
                        />
                    </div>
                </div>
            </div>
        )
    }

}