import React, { Component } from "react";
import './App.css';
import './fonts.css';

class RandomImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        randomImage: "/icons/ditto.png",
        imageOptions: [
            "/icons/image1.png",
            "/icons/image2.png",
            "/icons/image3.png",
            "/icons/image4.png",
            "/icons/image5.png",
            "/icons/image6.png",
            "/icons/image7.png",
            "/icons/image8.png",
            "/icons/image9.png",
            "/icons/image10.png",
            "/icons/image11.png",
            "/icons/image12.png",
            "/icons/image13.png",
            "/icons/image14.png",
        ],
        };
    }

    handleMouseEnter = () => {
        const randomIndex = Math.floor(Math.random() * this.state.imageOptions.length);
        const randomImagePath = this.state.imageOptions[randomIndex];
        this.setState({ randomImage: randomImagePath });
    };

    handleMouseLeave = () => {
        this.setState({ randomImage: "/icons/ditto.png" }); // Limpiar la imagen cuando el mouse se va
    };

    render() {
        return (
        <div
            className="image-container"
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
        >
            <img
            id="random-image"
            src={this.state.randomImage}
            alt="Pokemon"
            className="ProfileButton"
            />
        </div>
        );
    }
}

export default RandomImage;




