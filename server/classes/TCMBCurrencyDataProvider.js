const axios = require('axios');
const { DateTime } = require('luxon');
const { parseStringPromise } = require('xml2js');
const ITCMBCurrencyDataProvider = require("./interfaces/ITCMBCurrencyDataProvider");
const { GoldCurrency, ForexCurrency } = require('./Currency');

// TCMB API'si üzerinden kur verileri sağlayan sınıf
class TCMBCurrencyDataProvider extends ITCMBCurrencyDataProvider {
    constructor(baseURL) {
        super(); // ICurrencyDataProvider sınıfının yapıcı fonksiyonunu çağırın
        this.goldCurrency = new GoldCurrency(baseURL);
        this.forexCurrency = new ForexCurrency(baseURL);
    }
    
    async getGoldInfo(code) {
        const jsonData = await this.fetchGoldData();
        return this.goldCurrency.getGoldInfoByCode(jsonData, code);
    }

    async getForexInfo(code) {
        const jsonData = await this.fetchForexData();
        return this.forexCurrency.getForexInfoByCode(jsonData, code);
    }

    async fetchGoldData() {
        return await this.goldCurrency.fetchData('gold');
    }

    async fetchForexData() {
        return await this.forexCurrency.fetchData('forex');
    }
}

module.exports = TCMBCurrencyDataProvider;
