class CurrencyConverter {
    constructor(containerId) {
        this.container = $(`#${containerId}`);
        this.init();
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
            Swal.fire("UYARI!", "Miktar değeri boş olamaz!", "warning");
            return;
        } else if (amount < 0) {
            amount *= -1;
            $("#amount").val(amount);
        }

        let type = 'currency';

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
                        $("#result").text(`Hata: ${data.error}`);
                    } else {
                        const info = data.info;
                        if (type === "currency") {
                            const forexBuying = parseFloat(info.ForexBuying);
                            result = parseFloat(amount) * parseFloat(forexBuying);
                        } else if (type === "gold") {
                            const unitPrice = parseFloat(info.alis.replace(",", "."));
                            result = parseFloat(amount) * parseFloat(unitPrice);
                        }
                        $("#result").html(`Sonuç : <b>${result}</b> TL`);
                    }
                } catch(ex) {
                    Swal.fire("HATA!" , `${ex.message} \r\n ${ex.stack}`, "error");
                }
            },
            error: (xhr, status, error) => {
                console.error('Bir hata oluştu:', error);
                $("#result").text('Bir hata oluştu');
            }
        });
    }
}
