class CurrencyConverter {
    constructor(containerId) {
        this.container = $(`#${containerId}`);
        this.init();
    }

    TLToText(amount) {
        const fullPart = Math.floor(amount);
        const pennyPart = Math.round((amount - fullPart) * 100);

        function numberToText(number) {
            const digits = ['', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz'];
            const tens = ['', 'On', 'Yirmi', 'Otuz', 'Kırk', 'Elli', 'Altmış', 'Yetmiş', 'Seksen', 'Doksan'];

            let text = '';

            if (number >= 1000000000) {
                text += `${numberToText(Math.floor(number / 1000000000))} Milyar `;
                number %= 1000000000;
            }

            if (number >= 1000000) {
                const millions = Math.floor(number / 1000000);
                text +=  `${numberToText(millions)} Milyon `;
                number %= 1000000;
            }

            if (number >= 1000) {
                const thousands = Math.floor(number / 1000);
                text += (thousands > 1) ? `${numberToText(thousands)} Bin ` : 'Bin ';
                number %= 1000;
            }

            if (number >= 100) {
                const hundreds = Math.floor(number / 100);
                text += (hundreds > 1) ? `${digits[hundreds]} Yüz ` : 'Yüz ';
                number %= 100;
            }

            if (number >= 10) {
                text += `${tens[Math.floor(number / 10)]} `;
                number %= 10;
            }

            if (number > 0) {
                text += `${digits[number]} `;
            }

            return text.trim();
        }

        function pennyToText(penny) {
            if (penny === 0) {
                return '';
            } else {
                return `${numberToText(penny)} Kuruş`;
            }
        }

        let text = '';

        if (fullPart !== 0) {
            text += `${numberToText(fullPart)} Lira`;

            if (pennyPart !== 0) {
                text += `, ${pennyToText(pennyPart)}`;
            }
        } else if (pennyPart !== 0) {
            text += `${pennyToText(pennyPart)}`;
        } 

        return `${text.charAt(0).toUpperCase()}${text.slice(1)} Türk Lirası`;
    }
    
    init() {
        const selectElement = this.createSelectElement();
        const amountInput = this.createAmountInput();
        const calculateButton = this.createCalculateButton();

        const formContent = $("<div>").append(selectElement, amountInput, calculateButton);
        const form = $("<form>").append(formContent);

        const resultDiv = $("<div>").attr("id", "result").addClass("mt-2");
        const frameDiv = $("<div>").append(form, resultDiv);

        this.container.append(frameDiv);
    }

    createSelectElement() {
        const selectElement = $("<select>").addClass("form-select").attr("id", "currencyType");
        const currenciesOptGroup = $("<optgroup>").attr("label", "Para Birimleri");
        const goldOptGroup = $("<optgroup>").attr("label", "Altın Birimleri");

        // Loop through CurrencyEnum keys and add options to the currencies optgroup
        for (const key in CurrencyEnum) {
            $("<option>")
                .addClass("dropdown-item")
                .attr("value", CurrencyEnum[key])
                .text(key)
                .appendTo(currenciesOptGroup);
        }

        // Loop through GoldEnum keys and add options to the gold optgroup
        for (const key in GoldEnum) {
            $("<option>")
                .addClass("dropdown-item")
                .attr("value", GoldEnum[key])
                .text(key)
                .appendTo(goldOptGroup);
        }

        // Append both optgroups to the select element
        selectElement.append(currenciesOptGroup).append(goldOptGroup);

        // Wrap the select element in a div with the form-group class
        return $("<div>").addClass("form-group mb-3").append(selectElement);
    }

    createAmountInput() {
        const amountInput = $("<input>")
            .addClass("form-control")
            .attr({
                "type": "number",
                "id": "amount",
                "min": "0",
                "step": "0.01",
                "placeholder": "Miktarı girin"
            });
        return $("<div>").addClass("form-group mb-3").append(amountInput);
    }

    createCalculateButton() {
        const calculateButton = $("<button>")
            .addClass("btn btn-primary me-2")
            .text("Hesapla")
            .on("click", this.calculateCurrency.bind(this)); // Event listener bağlama
        return $("<div>").addClass("form-group").append(calculateButton);
    }

    calculateCurrency(event) {
        event.preventDefault();

        const selectedCurrency = $("#currencyType").val();
        let amount = $("#amount").val().trim();

        if (amount === null || amount === "") {
            this.showAlert("UYARI!", "Miktar değeri boş olamaz!", "warning");
            return;
        } else if (amount < 0) {
            amount *= -1;
            $("#amount").val(amount);
        }

        let type = 'forex';

        if (selectedCurrency === GoldEnum["22 AYAR GRAM ALTIN"] || selectedCurrency === GoldEnum["24 AYAR GRAM ALTIN"]) {
            type = 'gold';
        }

        $.ajax({
            type: "GET",
            url: `/getInfoWithCode?type=${type}&code=${selectedCurrency}`,
            success: (data) => {
                try {
                    let result;
                    if (data.error) {
                        this.displayResult(`Hata: ${data.error}`);
                    } else {
                        const info = data.info;
                        if (type === "forex") {
                            const forexBuying = parseFloat(info.ForexBuying);
                            result = parseFloat(amount) * forexBuying;
                        } else if (type === "gold") {
                            const unitPrice = parseFloat(info.alis.replace(",", "."));
                            result = parseFloat(amount) * unitPrice;
                        }
                        this.displayResult(`Sonuç : <b>${result}</b> TL (<b>${this.TLToText(result)}</b>)`);
                    }
                } catch (ex) {
                    this.showAlert("HATA!", `${ex.message} \r\n ${ex.stack}`, "error");
                }
            },
            error: (xhr, status, error) => {
                console.error('Bir hata oluştu:', error);
                this.displayResult('Bir hata oluştu');
            }
        });
    }

    showAlert(title, message, icon) {
        Swal.fire(title, message, icon);
    }

    displayResult(resultText) {
        $("#result").html(resultText);
    }
}
