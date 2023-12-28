const express = require('express');
const app = express();
const path = require('path');

const TCMBCurrencyDataProvider = require('./classes/TCMBCurrencyDataProvider'); // TCMBCurrencyDataProvider sınıfı

const forexDataProvider = new TCMBCurrencyDataProvider('https://www.tcmb.gov.tr/kurlar/');
const goldDataProvider = new TCMBCurrencyDataProvider('https://www.tcmb.gov.tr/reeskontkur/');


app.use(express.static('public')); // Public klasörü içindeki dosyaların sunucudan servis edilmesi

app.get(`/main.js`, (req, res) => {
    res.sendFile(path.join(__dirname, `../client/js/main.js`));
});

app.get(`/currency.js`, (req, res) => {
    res.sendFile(path.join(__dirname, `../client/js/currency.js`));
});

app.get(`/dataRetriever.js`, (req, res) => {
    res.sendFile(path.join(__dirname, `../client/js/dataRetriever.js`));
});

app.get(`/enums.js`, (req, res) => {
    res.sendFile(path.join(__dirname, `../client/js/enums.js`));
});

app.get(`/programme.js`, (req, res) => {
    res.sendFile(path.join(__dirname, `../client/js/programme.js`));
});

app.get(`/currency.ico`, (req, res) => {
    res.sendFile(path.join(__dirname, `../client/img/currency.ico`));
});

app.get(`/main.css`, (req, res) => {
    res.sendFile(path.join(__dirname, `../client/css/main.css`));
});


app.get('/getInfoWithCode', async (req, res) => {
    try {
        const { type, code } = req.query;

        let info;

        if (type === 'forex')
            info = await forexDataProvider.getForexInfo(code);
        else if (type === 'gold') 
            info = await goldDataProvider.getGoldInfo(code);
        else
            return res.status(400).json({ error: 'Geçersiz istek' });

        if (!info) 
            return res.status(404).json({ error: 'Bilgi bulunamadı' });

        return res.status(200).json({ info });
    } catch (error) {
        console.error('Bir hata oluştu:', error);
        return res.status(500).json({ error: 'Bir hata oluştu' });
    }
});

app.get('/currencyData', async (req, res) => {
    try {
        // Döviz kurları ve altın verilerini al
        const forexData = await forexDataProvider.fetchForexData();
        const goldData = await goldDataProvider.fetchGoldData();

        // Verileri JSON formatında gönder
        res.json({ forexData, goldData });
    } catch (error) {
        console.error('İstek sırasında bir hata oluştu:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// index.html dosyasını göndermek için bir route oluştur
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});