import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CurrencyConverter.css";

export default class SelectCurrency extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.props = props;

        this.currencyKeys = [];

        this.state = {}
    }

    onChange(e) {
        let currencyKeys = Object.keys(this.props.currencyList);
        const BreakException = {};
        var changedCurrency = {};
        try {
            currencyKeys.forEach(currency => {
                if (this.props.currencyList[currency].name === e.target.value) {
                    changedCurrency = this.props.currencyList[currency];
                    throw BreakException;
                }
            });
        } catch (e){
            if (e !== BreakException) throw e;
        }
        if (this.props.onChange && changedCurrency !== {} )
        {
            this.props.onChange(changedCurrency, this.props.labelName);
        }
    }
    
    currencyOptions() {
        let returnValue = [];
        let currencyKeys = Object.keys(this.props.currencyList);
        currencyKeys.forEach(currency => {
            returnValue.push(<option key={currency}>{this.props.currencyList[currency].name}</option>)
        });
        return returnValue;
    }

    render() {
        return (
            <div className={this.props.className}>
                <label>Select {this.props.labelName} Currency</label>
                <select ref="userInput" className="form-control"
                    onChange={ this.onChange }>
                    { this.currencyOptions() }
                </select>
            </div>
        );
    }
}