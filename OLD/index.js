class Cycler {
    constructor(minimum, maximum) {
        this.current = minimum;
        this.minimum = minimum;
        this.maximum = maximum;
    }

    get next() {
        this.current++;
        if (this.current > this.maximum) {
            this.current = this.minimum;
        }
    }
    get previous() {
        this.current--;
        if (this.current < this.minimum) {
            this.current = this.maximum;
        }
    }
    set min(value) {
        if (this.current < value) {
            this.current = value;
        }
        if (this.maximum < value) {
            this.maximum = value;
        }
        this.minimum = value;
    }
    set max(value) {
        if (this.current > value) {
            this.current = value;
        }
        if (this.minimum > value) {
            this.minimum = value;
        }
        this.maximum = value;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let qs = document.querySelector.bind(document);

    let bckOverlay = qs("#background-overlay");
    let next = qs("#next");
    let previous = qs("#previous");

    let vehicleNodes = [{
            node: qs("#vehicle-index"),
            apiName: null,
            category: "Index: ",
            prefix: "",
            suffix: ""
        },
        {
            node: qs("#vehicle-name"),
            apiName: "name",
            category: "Name: ",
            prefix: "",
            suffix: ""
        },
        {
            node: qs("#vehicle-model"),
            apiName: "model",
            category: "Model: ",
            prefix: "",
            suffix: ""
        },
        {
            node: qs("#vehicle-manufacturer"),
            apiName: "manufacturer",
            category: "Manufacturer: ",
            prefix: "",
            suffix: ""
        },
        {
            node: qs("#vehicle-cost"),
            apiName: "cost_in_credits",
            category: "Cost: ",
            prefix: "Cr ",
            suffix: ""
        },
        {
            node: qs("#vehicle-length"),
            apiName: "length",
            category: "Length: ",
            prefix: "",
            suffix: " m"
        },
        {
            node: qs("#vehicle-speed"),
            apiName: "max_atmosphering_speed",
            category: "Speed: ",
            prefix: "",
            suffix: " ats"
        },
        {
            node: qs("#vehicle-crew"),
            apiName: "crew",
            category: "Crew: ",
            prefix: "",
            suffix: ""
        },
        {
            node: qs("#vehicle-passengers"),
            apiName: "passengers",
            category: "Passengers: ",
            prefix: "",
            suffix: ""
        },
        {
            node: qs("#vehicle-cargo-capacity"),
            apiName: "cargo_capacity",
            category: "Cargo capacity: ",
            prefix: "",
            suffix: " kg"
        },
        {
            node: qs("#vehicle-consumables"),
            apiName: "consumables",
            category: "Consumables(?): ",
            prefix: "",
            suffix: ""
        },
        {
            node: qs("#vehicle-class"),
            apiName: "vehicle_class",
            category: "Vehicle class: ",
            prefix: "",
            suffix: ""
        }
    ]

    let apiData = [];
    let indexCycler = new Cycler(1, 2);

    next.addEventListener("click", showNext);
    previous.addEventListener("click", showPrevious);

    start();

    function start() {
        getApiData(`https://swapi.dev/api/people?page=1`);
    }

    function getApiData(pageUrl) {
        fade(bckOverlay, 1, 0.8);

        fetch(pageUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                jsonData.results.forEach(res => {
                    apiData.push(res);
                });
                if (jsonData.next) {
                    getApiData(jsonData.next);
                } else {
                    indexCycler.max = jsonData.count;
                    showData();
                    // setTimeout(function(){
                    //     fade(bckOverlay, 0, 0);
                    // }, 999999);
                    fade(bckOverlay, 0, 0);
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    function showNext() {
        indexCycler.next;
        showData();
    }

    function showPrevious() {
        indexCycler.previous;
        showData();
    }

    function showData() {
        vehicleNodes.forEach(vehicleNode => {
            if (vehicleNode.apiName == null) {
                vehicleData(vehicleNode, `${indexCycler.current} / ${indexCycler.maximum}`);
            } else {
                vehicleData(vehicleNode, apiData[indexCycler.current - 1][vehicleNode.apiName]);
            }
        });
    }

    function vehicleData(vehicle, input) {
        let category = `<div class="vehicle-category">${vehicle.category}</div>`;
        let data = `<div class="vehicle-data">${vehicle.prefix}${input}${vehicle.suffix}</div>`;

        vehicle.node.innerHTML = category + data;
    }

    // function formatData(wrapper, jsonData){
    //     let data = JSON.stringify(jsonData);
    //     data = data.replace("\"", "");
    //     data = data.replace(/\\r\\n/g, "<br>");
    //     data = data.replace(/<br><br>/g, "</p><p>");
    //     data = `<${wrapper}>${data}</${wrapper}>`;
    //     return data;
    // }
})

function fade(element, scale, opacity) {
    element.style.transform = `scale(${scale})`;
    element.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
}