import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CurrencyConverter.css";
import SelectCurrency from "./SelectCurrency";

const request = require('request');
const curListUri = "https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json";

export default class CurrencyConverter extends Component {
    constructor(props){
        super(props);

        this.onChangeSelectedCurrency = this.onChangeSelectedCurrency.bind(this);

        this.state = {
            currencyList: {},
            baseCurrency: {},
            targetCurrency: {}
        }
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
    }

    onChangeSelectedCurrency(changedCurrency, target) {
        if (target === "Base")
        {
            this.setState({baseCurrency: changedCurrency});
        }
        else if (target === "Target")
        {
            this.setState({targetCurrency: changedCurrency});
        }
    }

    render() {
        return (
        <div className="container-fluid">
            <div className="row top-pad"/>
            <div className="row">
                <SelectCurrency className="col text-center" labelName="Base" onChange={this.onChangeSelectedCurrency} currencyList={this.state.currencyList}/>
                <SelectCurrency className="col text-center" labelName="Target" onChange={this.onChangeSelectedCurrency} currencyList={this.state.currencyList}/>
            </div>
        </div>);
    }
}