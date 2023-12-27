// Kur verileri alma işlevselliği için arayüz (Interface)
// Arayüz (Interface) - CurrencyDataProvider
class ICurrencyDataProvider {
    async fetchData() { }
    async getFallbackData() { }
    async getGoldInfoByCode() { }
    async getCurrencyInfoByCode() { }
}

module.exports = ICurrencyDataProvider;


