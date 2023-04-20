import axios from 'axios';
import React, {Component} from 'react';
import { Bars } from 'react-loader-spinner';
import { TypeAnimation } from "react-type-animation";
import TimedComponent from "./TimedComponent";

export default class ImageDisplay extends Component {
    state = {
        images: [],
        generating: false
    }

    requestImages = (title) => {
        let self = this;

        console.log("requesting images for " + title);

        for (let i = 0; i < 3; i++) {
            axios({
                method: 'post',
                url: 'http://127.0.0.1:7860/sdapi/v1/txt2img',
                data: {
                    "prompt": "the album cover for " + title,
                    "steps": 1,
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

        this.requestImages(this.props.albumTitle);
    }

    render() {
        return (
            <div>
                <div className="row">
                    { this.state.images.length === 3 ?
                        <div className="row">
                            {this.state.images.map((image, index) => (
                                <div key={index}>
                                    <button onClick={() => this.props.clickImgBtn(image)}>{
                                        <div key={index} className="col-lg-4 col-md-4 col-xs-4">
                                            <img src={image} />
                                        </div>
                                    }</button>
                                </div>
                            ))}
                        </div> :
                        this.state.generating ?
                        <div>
                            <br />
                            <br />
                            <br />
                        </div> :
                        <div className="align-items-center justify-content-center">
                            <div>
                                <TypeAnimation
                                    cursor={false}
                                    sequence={["That has a nice ring to it.", 600,
                                               "Your title gives me some good ideas for the album's cover.", 750]}
                                    wrapper="p"
                                    className="type"
                                    deletionSpeed="99"
                                />
                            </div>
                            <TimedComponent
                                element={<button onClick={() => this.handleClick()}>Generate Some Covers</button>}
                                timeout="8000"
                            />
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
                                transform: "translate(-50%, 250%)"
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