import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CurrencyConverter.css";

export default class InputCurrency extends Component {
    constructor(props) {
        super(props);

        this.updateDisplayValue = this.updateDisplayValue.bind(this);
        this.onInputDisplayedChanged = this.onInputDisplayedChanged.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.props = props;
        this.state = {
            displayValue: "",
            numericValue: 0.0
        }
    }

    updateDisplayValue() {
        let newValue =  this.props.symbol + " " + this.state.numericValue.toString();
        this.setState({ displayValue: newValue });
    }

    onInputDisplayedChanged(e) {
        console.log(e.target.value);
    }

    onKeyUp(e) {
        console.log("key pressed: " + e.key);
    }

    componentDidMount() {
        this.updateDisplayValue();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.symbol !== this.props.symbol)
        {
            console.log(prevProps.symbol + " changed to " + this.props.symbol);
            this.updateDisplayValue();
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <input type="text" className="form-control" 
                    value={this.state.displayValue} 
                    onChange={this.onInputDisplayedChanged}
                    onKeyUp={this.onKeyUp}/>
            </div>
        );
    }
}