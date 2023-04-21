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

        let capsTitles = []

        for (let i in titles) {
            const next = titles[i].toLowerCase()
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ');
            capsTitles.push(next);
        }

        self.setState({
            songTitles: capsTitles
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
                return (<div className="mt-3">
                    <br />
                    <AlbumForm
                        clickTitleBtn={this.clickTitleBtn}
                    />
                </div>);
            case 2:
                return (
                    <div>
                        <ImageDisplay
                            prompt={this.state.albumTitle}
                            clickImgBtn={this.clickImgBtn}
                            albumTitle={this.state.albumTitle}
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
                    <a href="https://forms.gle/VPn7um81uko29tXc7">Before proceeding, please follow the directions on the survey.</a>
                    <br/>
                    <button className="mt-4" onClick={this.next}>Get Started</button>
                    <footer className="mt-lg-4">
                        <p>Made in 2023 by Eli Sorensen & Natalie Hahle.</p>
                    </footer>
                </div>
        }
    }
    
}