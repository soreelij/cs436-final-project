import React from 'react';
import axios from 'axios';
export default class AlbumForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            albumTitle: "",
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
    }
    
    clickGenerateBtn() {
        let self = this;
        
        const regexp = /^\S*$/; 
        const { albumTitle } = this.state; 

        if (!regexp.test(albumTitle) || albumTitle === '') {
            // Do nothing if whitespace still entered;
            console.log("invalid input, aborting.");
            return;
        }
        
        self.setState({
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
                console.log(response);
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
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render(props, state) {
        return (
            <div>
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
                    <p>Now generating...</p>
                </div>
                :
                <div>
                        <p>Give me one word to inspire our album's title.</p>
                        <input pattern="/^\S*$/" type="text" name="albumTitle" value={this.state.albumTitle} onChange={this.handleChange} />
                        <div>
                            <button onClick={this.clickGenerateBtn}>Generate Some Titles</button>
                        </div>
                </div>}
            </div>
        )
    }
}