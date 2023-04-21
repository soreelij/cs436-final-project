import React from 'react';
import axios from 'axios';
import { TypeAnimation } from "react-type-animation";
import { Bars } from 'react-loader-spinner';
import TimedComponent from "./TimedComponent";

export default class AlbumForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderView: 0,
            prevTitle: "",
            albumTitle: "",
            sampleWords: [],
            albums: [],
            generating: false,
            titleSelected: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.clickGenerateBtn = this.clickGenerateBtn.bind(this);

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value.trim()
        })
    }xf
    
    clickGenerateBtn() {
        const regexp = /^\S*$/; 
        const { albumTitle } = this.state; 

        if (!regexp.test(albumTitle) || albumTitle === '') {
            // Do nothing if whitespace still entered;
            console.log("invalid input, aborting.");
            return;
        }
        
        this.getTitles()
    }

    clickSampleBtn(word) {
        let self = this;

        self.setState({
            albumTitle: word
        }, () => {
            self.getTitles();
        });
    }

    getTitles() {
        let self = this;

        self.setState({
            renderView: 0,
            generating: true
        })

        axios({
            method: 'post',
            url: 'http://127.0.0.1:7860/textapi/v1/album',
            data: {
                "input": self.state.albumTitle
            }
        })
            .then(function (response) {
                self.handleResponse(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    handleResponse(response) {
        let self = this;

        if (response.data.output.length === 0) {
            // not enough titles generated
            axios.get('http://127.0.0.1:7860/textapi/v1/sample')
            .then(function (response) {
                console.log("samples: " + response.data.output);
                self.setState({
                    sampleWords: response.data.output
                }, () => {
                    console.log("words: " + self.state.sampleWords);
                    self.setState((prevState) => ({
                        renderView: 1,
                        prevTitle: prevState.albumTitle
                    }));
                });
            })
            .catch(function (error) {
                console.log(error);
            })

        } else {
            const titles = [];
            for (let i in response.data.output) {
                const next = response.data.output[i].toLowerCase()
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ');
                titles.push(next);
            }

            self.setState({
                albums: titles
            });
        }
    }

    render(props, state) {
        switch (this.state.renderView) {
            case 1:
                return (
                <div>
                    <p>Hmm, I'm having trouble with the word "{this.state.prevTitle}".</p>
                    <p>I bet you could think of a better one.</p>
                    {/*Random list of possible words, 1-5 choices needed here.*/}
                    <div>
                        <input
                            className="input"
                            pattern="/^\S*$/"
                            type="text"
                            name="albumTitle"
                            value={this.state.albumTitle}
                            onChange={this.handleChange}
                            placeholder="Type something..."
                        />
                        <div className="mb-4">
                            <button onClick={this.clickGenerateBtn}>Generate Some Titles</button>
                        </div>
                        <div className="mb-4">
                            <p>Here are some of my ideas if you need them.</p>
                            {this.state.sampleWords.map((word, index) => (
                                <div key={index}>
                                    <button onClick={() => this.clickSampleBtn(word)}>{word}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>);
            default:
                return (<div>
                    { this.state.albums.length > 0 ?
                 <div>
                     <p>Choose your favorite title for our album.</p>
                     {this.state.albums.map((albumTitle, index) => (
                         <div key={index}>
                             <button onClick={() => this.props.clickTitleBtn(albumTitle)}>{albumTitle}</button>
                         </div>
                         ))}
                 </div>
                : this.state.generating ?
                <div>
                    <div className="col-md">
                        <Bars
                            height="50"
                            width="50"
                            color="#6270dd"
                            ariaLabel="bars-loading"
                            wrapperStyle={{
                            position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, 250%)"
                        }}
                        />
                    </div>
                </div>
                :
                <div>
                    <div>
                        <TypeAnimation
                            cursor={false}
                            sequence={["Let's make an album.", 600,
                                       "First, it needs a title.", 750,
                                       " Give me one word to inspire it.", 800]}
                            wrapper="p"
                            className="type"
                            deletionSpeed="99"
                        />
                        <TimedComponent
                            element={
                            <div>
                                <input
                                    className="input"
                                    pattern="^[a-zA-Z]*$"
                                    type="text"
                                    name="albumTitle"
                                    value={this.state.albumTitle}
                                    onChange={this.handleChange}
                                    placeholder="Type something..."
                                />
                                <div>
                                    <button onClick={this.clickGenerateBtn}>Generate Some Titles</button>
                                </div>
                            </div>
                            }
                            timeout="9500"
                        />
                    </div>
                </div>}
                </div>);
        }
    }
}