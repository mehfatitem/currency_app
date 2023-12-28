const axios = require('axios');
const { DateTime } = require('luxon');
const { parseStringPromise } = require('xml2js');

// Genel Currency sınıfı ve alt sınıfları
class Currency {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.previous = 0;
    }

    getCurrentDate() {
        return DateTime.now().minus({ days: this.previous }).toFormat('yyyyLL');
    }

    getRequestedDate() {
        let requestedDate = DateTime.now().minus({ days: this.previous });

        if (requestedDate.weekday >= 6) {
            requestedDate = requestedDate.minus({ days: (requestedDate.weekday - 5) });
        }

        return requestedDate.toFormat('ddLLyyyy');
    }

    buildURL(type) {
        const currentDate = this.getCurrentDate();
        const requestedDate = this.getRequestedDate();
        const currentHour = new Date().getHours();

        let suffix =
            type !== 'forex'
                ? currentHour <= 10 ? '-1000.xml'
                  : currentHour < 15 ? `-${currentHour}00.xml`
                  : '-1500.xml'
                : '.xml';

        if(this.previous > 0 && type === "gold") {
            suffix = "-1500.xml";
        }

        return `${this.baseURL}${currentDate}/${requestedDate}${suffix}`;
    }

    async fetchData(type) {
        try {
            const url = this.buildURL(type);
            const response = await axios.get(url);
            const xmlData = response.data;
            return parseStringPromise(xmlData, { explicitArray: false });
        } catch (error) {
            console.error('An error occurred during the request.');
            if (this.previous >= 0) {
                this.previous++; // Increment 'previous' for the next retry
                return this.fetchData(type); // Retry by calling fetchData recursively
            } else {
                console.error('Data could not be fetched even after retries.');
                return null;
            }
        }
    }
}

// Altın sınıfı
class GoldCurrency extends Currency {
    constructor(baseURL) {
        super(baseURL);
    }

    async getGoldInfoByCode(jsonData, code) {
        const goldCurrencies = jsonData?.tcmbVeri?.doviz_kur_liste?.kur.filter(currency => currency['doviz_cinsi'] === code);
        return goldCurrencies.length > 0 ? goldCurrencies[0] : null;
    }
}

// Para birimi sınıfı
class ForexCurrency extends Currency {
    constructor(baseURL) {
        super(baseURL);
    }

    async getForexInfoByCode(jsonData, code) {
        const currency = jsonData?.Tarih_Date?.Currency.find(currency => currency['$'].Kod === code);
        if (currency) {
            return {
                Isim: currency.Isim,
                ForexBuying: currency.ForexBuying,
                ForexSelling: currency.ForexSelling,
                BanknoteBuying: currency.BanknoteBuying,
                BanknoteSelling: currency.BanknoteSelling
            };
        }
        return null;
    }
}

module.exports = {
    GoldCurrency,
    ForexCurrency
};
