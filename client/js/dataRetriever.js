class DataRetriever {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    formatCustomDate(dateString) {
        const formattedDate = luxon.DateTime.fromFormat(dateString, 'dd.MM.yyyy');

        // Türkçe dilinde gün ve ay adlarını al
        const day = formattedDate.setLocale('tr').toLocaleString({ weekday: 'long' });
        const month = formattedDate.setLocale('tr').toLocaleString({ month: 'long' });

        // Belirtilen formatta tarihi oluştur
        const formattedString = `${formattedDate.day} ${month} ${formattedDate.year} ${day}`;

        return formattedString;
    }

    fetchData() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.endpoint,
                method: 'GET',
                success: (response) => {
                    resolve(response);
                },
                error: (err) => {
                    reject(err);
                }
            });
        });
    }

    displayCurrencyData(currencyData) {
        if(currencyData == "" || currencyData == undefined) {
            Swal.fire("UYARI!" , "Kur bilgileri getirilemedi!" , "warning");
            return;
        }
        $("#date-info").html(`${this.formatCustomDate(currencyData.Tarih_Date.$.Tarih)} tarihinin kur bilgileridir.`);
        currencyData.Tarih_Date.Currency.forEach((currency) => {
            $('#currencyTableBody').append(`
        <tr>
          <td>${currency.Isim}</td>
          <td>${currency.ForexBuying ? currency.ForexBuying + ' TL' : ''}</td>
          <td>${currency.ForexSelling ? currency.ForexSelling + ' TL' : ''}</td>
          <td>${currency.BanknoteBuying ? currency.BanknoteBuying + ' TL' : ''}</td>
          <td>${currency.BanknoteSelling ? currency.BanknoteSelling + ' TL' : ''}</td>
        </tr>
      `);
        });

        $('#currency-table').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/tr.json'
            }
        });
    }

    displayGoldData(goldData) {
        if(goldData == "" || goldData == undefined) {
            Swal.fire("UYARI!" , "Kur bilgileri getirilemedi!" , "warning");
            return;
        }
        goldData.tcmbVeri.doviz_kur_liste.kur.forEach((gold) => {
            if (gold.doviz_cinsi === GoldEnum["22 AYAR GRAM ALTIN"] || gold.doviz_cinsi === GoldEnum["24 AYAR GRAM ALTIN"]) {
                const type = gold.doviz_cinsi === 'XAU' ? 'Gram Altın (22 Ayar)' : 'Gram Altın (24 Ayar)';
                $('#goldDetails').append(`
          <div>
            <h3>${type}</h3>
            <p>Alış: ${gold.alis} TL</p>
          </div>
        `);
            }
        });
    }
}