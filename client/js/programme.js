class Programme {
    constructor() {
        const dataRetriever = new DataRetriever('/currencyData');

        new CurrencyConverter("currencyConverter");

        dataRetriever.fetchData()
            .then(data => {
                dataRetriever.displayForexData(data.forexData);
                dataRetriever.displayGoldData(data.goldData);
            })
            .catch(err => {
                console.error('Currency data retrieval error:', err);
            });
    }
}