import Setup from "../../game/main";
import React, { Component } from "react";

class Game extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        Setup();
    }

    render() { 
        return (
            <div>
                <div id="app"></div>
            </div>
        )
    }
}

export default Game;