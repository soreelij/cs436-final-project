import React from 'react';
import { TypeAnimation } from "react-type-animation";
import TimedComponent from "./TimedComponent";

export default class AlbumDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderView: 0,
            userName: ""
        }
        
        this.handleChange =  this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    
    handleClick = () => {
        this.setState((prevState) => ({
            renderView: prevState.renderView + 1
        }));
    }
    
    render() {
        switch(this.state.renderView) {
            case 1:
                return (
                    <div>
                        <img src={this.props.imageSrc}/>
                        <br />
                        <br />
                        <h2>{this.props.albumTitle}</h2>
                        <p>By AlgoRhythm and {this.state.userName}</p>
                        {this.props.songTitles.map((songTitle, index) => (
                            <div key={index}>
                                <p>{index + 1}. {songTitle}</p>
                            </div>
                            ))}
                        <a href="https://forms.gle/VPn7um81uko29tXc7">Take our survey!</a>
                    </div>
                    );
            default:
                return (
                    <div>
                        <TypeAnimation
                            cursor={false}
                            sequence={["Our new album is ready.", 600,
                                       "I did most of the heavy lifting, but I suppose you helped out too.", 750,
                                       "I'll let you put your name on it if you want.", 500]}
                            wrapper="p"
                            className="type"
                            deletionSpeed="99"
                        />
                        <TimedComponent
                            element={
                            <div>
                                <form className="mt-4 mb-4">
                                <label className="me-3">Your Name:</label>
                                <input
                                    type="text"
                                    className="input mb-3"
                                    placeholder="Type something..."
                                    name="userName"
                                    onChange={this.handleChange}
                                    value={this.state.userName}></input>
                                </form>
                                <button onClick={this.handleClick}>Show Me The Album</button>
                            </div>
                            }
                            timeout="14000"
                            />
                    </div>
                );
        }
        
    }
    
}