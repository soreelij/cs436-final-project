import React from 'react';
import Slider from 'react-input-slider';
import axios from 'axios';

export default class SongForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 10,
            renderView: 0,
            currSong: 0,
            songIdea: "",
            songIdeas: [],
            songTitles: []
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.clickNextSongBtn = this.clickNextSongBtn.bind(this);
    }
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value.trim()
        })
    }
    
    clickNextSongBtn() {
        let self = this;

        const regexp = /^\S*$/; 
        const { songIdea } = this.state; 

        if (!regexp.test(songIdea) || songIdea === '') {
            // Do nothing if whitespace still entered;
            console.log("invalid input, aborting.");
            return;
        }
        
        this.setState({
            songIdeas: [...self.state.songIdeas, songIdea]
        }, () => {
            console.log(self.state.songIdeas);

            if (self.state.currSong === self.state.x) {
                console.log("max number of songs reached")
                this.setState((prevState) => ({
                    renderView: prevState.renderView + 1
                }));
                this.generateSongs();
            } else {
                this.setState((prevState) => ({
                    currSong: prevState.currSong + 1
                }));
            }
        });
    }
    
    generateSongs() {
        const self = this;
            axios({
                method: 'post',
                url: 'http://127.0.0.1:7860/textapi/v1/song',
                data: {
                    "input": self.state.songIdeas
                }
            })
            .then(function (response) {
//                console.log(response);
                self.props.getSongTitles(response.data.output);
            })
            .catch(function (error) {
                console.log(error);
            });


    }
    
    render() {
        switch (this.state.renderView) {
            case 1:
                return (
                    <div>
                        <p>Now I'll just need some ideas for song titles.</p>
                        <p>Give me one word for inpsiration on each song.</p>
                        <div className="row">
                            <form>
                                <label className="me-3">Song {this.state.currSong}</label>
                                <input pattern="/^\S*$/" name="songIdea" className="mb-3" type="text" value={this.state.songIdea} onChange={this.handleChange}></input>
                            </form>
                        </div>
                        <button onClick={this.clickNextSongBtn}>Next Song</button>
                    </div>
                    );
                case 2:
                    return (
                        <div>
                            <p>Generating songs...</p>
                        </div>
                    );
                default:
                    return (
                        <div>
                            <p>That's a great cover, now we need to make some song titles.</p>
                            <p>Choose how many songs we should have.</p>
                            <Slider
                                axis="x"
                                x={this.state.x}
                                xmax="14"
                                onChange={({ x }) => this.setState(state => ({ ...state, x}))}
                            />
                            <p> {this.state.x + 1}  songs</p>
                            <button onClick={() => this.setState(state => ({...state, renderView: 1}))}>Generate Songs</button>
                        </div>
                        );
        }
    }
    
}