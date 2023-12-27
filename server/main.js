// Kullanım örneği
const TCMBCurrencyDataProvider = require("./classes/TCMBCurrencyDataProvider");
const currencyBaseURL = 'https://www.tcmb.gov.tr/kurlar/';
const goldBaseUrl = 'https://www.tcmb.gov.tr/reeskontkur/';
const CurrencyEnum = require("./enums/CurrencyEnum");
const GoldEnum = require("./enums/GoldEnum");

const currencyDataProvider = new TCMBCurrencyDataProvider(currencyBaseURL);
const goldDataProvider = new TCMBCurrencyDataProvider(goldBaseUrl);

currencyDataProvider.fetchData("currency")
    .then((data) => {
        console.dir(currencyDataProvider.getCurrencyInfoByCode(data, CurrencyEnum["EURO"]));
    })
    .catch((err) => {
        console.error('Bir hata oluştu:', err);
    });

goldDataProvider.fetchData("gold")
    .then((data) => {
        console.dir(goldDataProvider.getGoldInfoByCode(data, GoldEnum["24 AYAR GRAM ALTIN"]));
    })
    .catch((err) => {
        console.error('Bir hata oluştu:', err);
    });

