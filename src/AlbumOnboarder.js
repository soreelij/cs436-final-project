import React, { Component } from 'react';
import { TypeAnimation } from "react-type-animation";
import TimedComponent from './TimedComponent';
import AlbumForm from "./AlbumForm";

export default class AlbumOnboarder extends Component {


    state = {
        renderView: 0,
        title: ""
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
                    <br />
                    {/*<TypeAnimation*/}
                    {/*    cursor={false}*/}
                    {/*    sequence={["Hi, I'm AlgoRhythm.", 600,*/}
                    {/*               "We can make AI albums together (audio not included).", 750,*/}
                    {/*               "To start, we need to choose a title.", 800,*/}
                    {/*               "In one word, what should our album be about?", 1500]}*/}
                    {/*    wrapper="p"*/}
                    {/*    className="type"*/}
                    {/*    deletionSpeed="99"*/}
                    {/*/>*/}
                    <TimedComponent
                        element={
                            <div>
                                <AlbumForm />
                            </div>
                        }
//                        timeout="16000"
                        timeout="0"
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