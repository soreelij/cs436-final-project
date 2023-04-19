import React, { Component } from 'react';
import { TypeAnimation } from "react-type-animation";
import TimedComponent from './TimedComponent';
import AlbumForm from "./AlbumForm";
import ImageDisplay from "./ImageDisplay";
import SongForm from "./SongForm";
import AlbumDisplay from "./AlbumDisplay";

export default class AlbumOnboarder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderView: 0,
            albumTitle: '',
            imageSrc: '',
            songTitles: []
        }

        this.clickImgBtn = this.clickImgBtn.bind(this);
        this.clickTitleBtn = this.clickTitleBtn.bind(this);
        this.getSongTitles = this.getSongTitles.bind(this);

    }
    clickTitleBtn(albumTitle) {
        let self = this;

        self.setState({
            albumTitle: albumTitle
        }, () => {
            console.log("title: " + self.state.albumTitle);
            self.next();
        })
    }

    clickImgBtn(imageSrc) {
        let self = this;

        self.setState({
            imageSrc: imageSrc
        }, () => {
            self.next();
        });

    }

    getSongTitles(titles) {
        let self = this;

        self.setState({
            songTitles: titles
        }, () => {
            console.log("Titles: " + this.state.songTitles);
            self.next();
        });
    }

    next = () => {
        this.setState((prevState) => ({
            renderView: prevState.renderView + 1
        }));
    }
    
    render () {
        switch(this.state.renderView) {
            case 1:
                return (<div>
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
                                <AlbumForm
                                    clickTitleBtn={this.clickTitleBtn}
                                />
                            </div>
                        }
                        //                        timeout="16000"
                        timeout="0"
                    />
                </div>);
            case 2:
                return (
                    <div>
                        <ImageDisplay
                            prompt={this.state.albumTitle}
                            clickImgBtn={this.clickImgBtn}
                        />
                    </div>
                )
            case 3:
                return (
                    <div>
                        <SongForm
                            clickSongBtn={this.clickSongBtn}
                            getSongTitles={this.getSongTitles}
                        />
                    </div>
                )
            case 4:
                return (
                    <div>
                        <AlbumDisplay
                            imageSrc={this.state.imageSrc}
                            albumTitle={this.state.albumTitle}
                            songTitles={this.state.songTitles}
                        />
                    </div>
                )
            default:
                return <div>
                    <p>Generate an album using Artificial Intelligence (audio not included)</p>
                    <button onClick={this.next}>Get Started</button>
                </div>
        }
    }
    
}