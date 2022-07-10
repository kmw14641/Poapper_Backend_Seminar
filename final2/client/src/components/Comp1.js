import React, { Component } from "react";
import axios from "axios";

export default class Comp1 extends Component {
    constructor() {
        super();
        this.state = {
            current: 1,
            one: 0,
            two: 0,
            three: 0,
            four: 0,
            five: 0,
            word: "empty now",
            hidden: "hidden",
            answer: "",
            newword: "",
            newanswer: "",
            newimage: ""
        };
        axios.get(`http://localhost:8080/${this.state.current}`)
        .then(response => {
            this.setState({
                one: response.data.number[1],
                two: response.data.number[2],
                three: response.data.number[3],
                four: response.data.number[4],
                five: response.data.number[5],
                word: response.data.word,
                hidden: response.data.answer
            })
        })
    }

    next = () => {
        axios.get(`http://localhost:8080/${this.state.current}`)
        .then(response => {
            this.setState({
                one: response.data.number[1],
                two: response.data.number[2],
                three: response.data.number[3],
                four: response.data.number[4],
                five: response.data.number[5],
                word: response.data.word,
                hidden: response.data.answer,
                answer: ""
            })
            if(response.data.empty === "true") {
                this.setState({
                    word: "there isn't a card anymore",
                    hidden: ""
                })
            }
        })
    }

    getanswer = () => {
        this.setState({
            answer: this.state.hidden
        })
    }

    success = () => {
        if (this.state.current === 5) this.remove();
        else this.move();
    }

    move = () => {
        axios.put(`http://localhost:8080/`, {
            result: "success",
            boxnum: this.state.current
        })
    }

    remove = () => {
        axios.delete(`http://localhost:8080/`)
    }

    failed = () => {
        axios.put(`http://localhost:8080/`, {
            result: "failed",
            boxnum: this.state.current
        })
    }

    one = () => {
        this.setState({ current: 1 })
    }

    two = () => {
        this.setState({ current: 2 })
    }

    three = () => {
        this.setState({ current: 3 })
    }

    four = () => {
        this.setState({ current: 4 })
    }

    five = () => {
        this.setState({ current: 5 })
    }

    createnewword = () => {
        axios.post(`http://localhost:8080/`, {
            word: this.state.newword,
            answer: this.state.newanswer,
        })
    }

    createnewimage = () => {
        const formData = new FormData();
        formData.append("image", this.state.newimage);
        formData.append("answer", this.state.newanswer);
        axios.post(`http://localhost:8080/image`, formData);
    }

    render() {
        return (
            <div>
                <h1> Current state : {this.state.current} </h1>
                <h1> [1] {this.state.one} / 10 </h1>
                <h1> [2] {this.state.two} / 20</h1>
                <h1> [3] {this.state.three} / 30</h1>
                <h1> [4] {this.state.four} / 40</h1>
                <h1> [5] {this.state.five} / 50</h1>
                <h1> Word: {this.state.word} </h1>
                <h1> Image: </h1>
                <img src={this.state.word} alt="" style={{
                    width: "600px",
                    height: "600px"
                }} />
                <h1> Answer: {this.state.answer} </h1>
                <h1> Buttons: </h1>
                <button onClick={this.getanswer}>getanswer</button>
                <button onClick={this.success}>success</button>
                <button onClick={this.failed}>failed</button>
                <button onClick={this.next}>next</button>
                <h1> Change to : </h1>
                <button onClick={this.one}>1</button>
                <button onClick={this.two}>2</button>
                <button onClick={this.three}>3</button>
                <button onClick={this.four}>4</button>
                <button onClick={this.five}>5</button>
                <h1> Create WordCard: </h1>
                <form>
                    <h1> Word: </h1>
                    <input type="text" name="word" onChange={ (e) => {
                        this.setState({
                            newword: e.target.value
                        })
                        console.log(this.state.newword);
                    } }/>
                    <h1> Answer: </h1>
                    <input type="text" name="answer" onChange={ (e) => {
                        this.setState({
                            newanswer: e.target.value
                        })
                        console.log(this.state.newanswer);
                    } }/>
                    <button type="button" onClick={this.createnewword}> create </button>
                </form>
                <h1> Create ImageCard: </h1>
                <form>
                    <h1> Image: </h1>
                    <input type="file" name="image" onChange={ (e) => {
                        this.setState({
                            newimage: e.target.files[0]
                        })
                        console.log(this.state.newimage);
                    } }/>
                    <h1> Answer: </h1>
                    <input type="text" name="answer" onChange={ (e) => {
                        this.setState({
                            newanswer: e.target.value
                        })
                        console.log(this.state.newanswer);
                    } }/>
                    <button type="button" onClick={this.createnewimage}> create </button>
                </form>
            </div>
        )
    }
}