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
        const BreakException = {};
        var changedCurrency = {};
        try {
            this.currencyKeys.forEach(currency => {
                if (this.props.currencyList[currency].name === e.target.value) {
                    changedCurrency = this.props.currencyList[currency];
                    throw BreakException;
                }
            });
        } catch (err){
            if (err !== BreakException) throw err;
        }
        if (this.props.onChange && changedCurrency !== {} )
        {
            this.props.onChange(changedCurrency, this.props.labelName);
        }
    }
    
    currencyOptions() {
        let returnValue = [];
        this.currencyKeys.forEach(currency => {
            returnValue.push(<option key={currency}>{this.props.currencyList[currency].name}</option>)
        });
        return returnValue;
    }

    componentWillReceiveProps(nextProps) {
        let changedCurrency = {};
        if (nextProps.currencyList !== this.props.currencyList) {
            this.currencyKeys = Object.keys(nextProps.currencyList);
            changedCurrency = nextProps.currencyList[this.currencyKeys[0]];
            if (this.props.onChange && changedCurrency !== {}) {
                this.props.onChange(changedCurrency, this.props.labelName);
            }
        }
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