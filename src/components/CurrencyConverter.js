import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CurrencyConverter.css";
import SelectCurrency from "./SelectCurrency";
import InputCurrency from "./InputCurrency";

const request = require('request');
const curListUri = "https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json";
const ratesUri = "https://api.exchangeratesapi.io/latest?base=";
const colTextCenter = "col text-center";

var fx = require("money");

export default class CurrencyConverter extends Component {
    constructor(props){
        super(props);

        this.onChangeSelectedCurrency = this.onChangeSelectedCurrency.bind(this);
        this.onChangeInputCurrency = this.onChangeInputCurrency.bind(this);

        this.isInvalidBase = false;
        this.state = {
            currencyList: {},
            baseCurrency: {},
            targetCurrency: {},
            inputValue: -1,
            outputDisplay: "",
        };
    }

    onChangeSelectedCurrency(changedCurrency, target) {
        console.log(target + " currency changed: " + changedCurrency.name);
        if (target === "Base")
        {
            this.setState({baseCurrency: changedCurrency});
        }
        else if (target === "Target")
        {
            this.setState({targetCurrency: changedCurrency});
        }
    }

    onChangeInputCurrency(changedValue) {
        if (changedValue !== this.state.inputValue){
            this.setState({inputValue: changedValue});
        }
    }

    getRates() {
        request.get(ratesUri + this.state.baseCurrency.code,
            (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    let parsedBody = JSON.parse(body);
                    this.isInvalidBase = false;
                    fx.base = parsedBody.base;
                    fx.rates = parsedBody.rates;
                    this.validateTargetCurrency();
                } else {
                    this.isInvalidBase = true;
                    let msg = "Error: Cannot get rates for " + this.state.baseCurrency.name;
                    alert(msg);
                    this.invalidOutput();
                }
            });
    }

    // called when rates changed, or when target currency change
    validateTargetCurrency() {
        let existRates = Object.keys(fx.rates);
        if (!existRates.includes(this.state.targetCurrency.code))
        {
            alert("Error: No rate conversion from " + this.state.baseCurrency.name + " to " + this.state.targetCurrency.name);
            this.invalidOutput();
        } else {
            // conversion rate exists
            this.computeOutput();
        }
    }

    computeOutput() {
        try {
            let converted = fx.convert(this.state.inputValue, {
                from: this.state.baseCurrency.code,
                to: this.state.targetCurrency.code
            });
            let displayVar = this.state.targetCurrency.symbol + " " + converted.toFixed(this.state.targetCurrency.decimal_digits);
            this.setState({outputDisplay: displayVar});
        } catch (err) {
            let msg = "Error encountered in converting " + this.state.baseCurrency.name + " to " + this.state.targetCurrency.name;
            alert(msg);
            this.invalidOutput();
        }
    }

    invalidOutput() {
        this.setState({outputDisplay: "invalid"});
    }

    componentDidMount() {
        request.get(curListUri, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                this.setState({
                    currencyList: JSON.parse(body)
                })
                console.log("Currency List obtained from " + curListUri);
                console.log(this.state.currencyList)
            }
        });
        this.setState({inputValue: 0.0});
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.baseCurrency !== this.state.baseCurrency) {
            this.getRates(prevState.baseCurrency);
        } else if (prevState.targetCurrency !== this.state.targetCurrency) {
            this.validateTargetCurrency();
        } else if (prevState.inputValue !== this.state.inputValue && !this.isInvalidBase) {
            this.computeOutput();
        }
    }

    render() {
        return (
        <div className="container-fluid">
            <div className="row top-pad"/>
            <div className="row mx-2">
                <SelectCurrency className={colTextCenter} labelName="Base" onChange={this.onChangeSelectedCurrency} currencyList={this.state.currencyList}/>
                <SelectCurrency className={colTextCenter} labelName="Target" onChange={this.onChangeSelectedCurrency} currencyList={this.state.currencyList}/>
            </div>
            <div className="row my-3 mx-2">
                <InputCurrency className={colTextCenter} symbol={this.state.baseCurrency.symbol} onChange={this.onChangeInputCurrency}/>
                <div className="col text-right">
                    <input type="userInput" className="form-control" readOnly={true} value={this.state.outputDisplay}/>
                </div>
            </div>
        </div>);
    }
}