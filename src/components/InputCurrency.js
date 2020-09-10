import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CurrencyConverter.css";

const bsKey = 8;
const delKey = 46;
const key0 = 48;
const key9 = 57;
const numpad0 = 96;
const numpad9 = 105;
const delVal = -1; // do backspace/del

export default class InputCurrency extends Component {
    constructor(props) {
        super(props);

        this.updateDisplayValue = this.updateDisplayValue.bind(this);
        this.onInputDisplayedChanged = this.onInputDisplayedChanged.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.props = props;
        this.state = {
            displayValue: "",
            numericValue: 0
        }
    }

    updateDisplayValue() {
        let intVal = (this.state.numericValue * 0.01).toFixed(2);
        let numVal = intVal === 0 ? "0.00" : intVal.toString();
        let newValue =  this.props.symbol + " " + numVal;
        this.setState({ displayValue: newValue });
    }

    updateNumericValue(updateVal) {
        let newVal = this.state.numericValue;
        if (updateVal >= 0 && updateVal <=9) {
            newVal = (newVal * 10) + updateVal;
        } else if (updateVal === delVal)
        {
            newVal = Math.floor(newVal / 10);
        }
        if (newVal !== this.state.numericValue) {
            this.setState({numericValue: newVal}, () => {
                this.updateDisplayValue();
            });
        }
    }

    onInputDisplayedChanged(e) {
        console.log(e.target.value);
    }

    onKeyUp(e) {
        let keyUp = e.keyCode;
        let updateVal = -2; // do nothing
        if (keyUp >= key0 && keyUp <= key9)
        {
            updateVal = keyUp - key0;
        }
        else if (keyUp >= numpad0 && keyUp <= numpad9)
        {
            updateVal = keyUp - numpad0;
        }
        else if (keyUp === bsKey || keyUp === delKey)
        {
            updateVal = delVal;
        }

        if (updateVal >= delVal && updateVal <= 9) {
            this.updateNumericValue(updateVal);
        }
        else {
            // Invalid key, do nothing
        }
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