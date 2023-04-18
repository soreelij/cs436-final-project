import React, { Component } from 'react';
import {TypeAnimation} from "react-type-animation";

export default class AlbumOnboarder extends Component {
    state = {
        renderView: 0
    }
    
    clickBtn = e => {
        this.setState({
            renderView: this.state.renderView += 1
        });
    }
    
    render () {
        switch(this.state.renderView) {
            case 1:
                return <div>
                    <TypeAnimation
                        cursor={false}
                        sequence={["Hey bestie!", 750,
                                   "My name is AlgoRhthym. Let's make music together.", 1500,
                                   "First, I'll need you to input a song ", 1500]}
                        wrapper="p"
                        className="type"
                    />
                </div>      
            default:
                return <div>
                    <p>Generate a hypothetical album using Artificial Intelligence</p>
                    <button onClick={this.clickBtn}>Get Started</button>
                </div>
        }
    }
    
}