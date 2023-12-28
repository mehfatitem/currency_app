// Kur verileri alma işlevselliği için arayüz (Interface)
// Arayüz (Interface) - ITCMBCurrencyDataProvider
class ITCMBCurrencyDataProvider {
    async getGoldInfo(code) {}
    async getCurrencyInfo(code) {}
    async fetchGoldData() {}
    async fetchForexData() {}
}
module.exports = ITCMBCurrencyDataProvider;


