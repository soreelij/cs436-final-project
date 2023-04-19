import React from 'react';

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
                    </div>
                    );
            default:
                return (
                    <div>
                        <p>Our new album is ready.</p>
                        <p>I did most of the heavy lifting, but I suppose you helped out too.</p>
                        <p>I'll let you put your name on it if you want.</p>
                        <form>
                            <label className="me-3">Your Name:</label>
                            <input type="text" name="userName" onChange={this.handleChange} value={this.state.userName}></input>
                        </form>
                        <button onClick={this.handleClick}>Show Me The Album</button>
                    </div>
                );
        }
        
    }
    
}