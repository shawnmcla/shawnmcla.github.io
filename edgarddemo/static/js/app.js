var MONTH = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
};

var EDGARD_RATE = 0.25;
var timeRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInMiles(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (earthRadiusKm * c) * 0.62137;
}

function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

var MOCK_DATA = {
    airports: [
        new Airport("CYDO", "Dolbeau", 48.7784996, -72.375),
        new Airport("CYEY", "Amos", 48.56389999, -78.24970245),
        new Airport("CYFJ", "La Macaza", 46.40940094, -74.77999878),
        new Airport("CYGL", "La Grande-Rivière", 53.62530136, -77.70420074),
        new Airport("CYGP", "Gaspé", 48.77529907, -64.47859955),
        new Airport("CYGR", "Îles-de-la-Madeleine", 47.42470169, -61.77809906),
        new Airport("CYGW", "Kuujjuarapik", 55.2818985, -77.76529694),
        new Airport("CYHF", "Hearst", 49.71419907, -83.68609619),
        new Airport("CYHH", "Nemiscau", 51.69110107, -76.13559723),
        new Airport("CYHU", "Saint-Hubert", 45.51750183, -73.41690063),
        new Airport("CYJN", "St-Jean-sur-Richelieu", 45.29439926, -73.28109741),
        new Airport("CYKL", "Schefferville", 54.80530167, -66.80529785),
        new Airport("CYKQ", "Waskaganish", 51.47330093, -78.75830078),
        new Airport("CYLQ", "La Tuque", 47.40969849, -72.78890228),
        new Airport("CYME", "Matane", 48.85689926, -67.45330048),
        new Airport("CYML", "Charlevoix", 47.59749985, -70.22389984),
        new Airport("CYMX", "Mirabel", 45.67950058, -74.03869629),
        new Airport("CYNC", "Wemindji", 53.01060104, -78.83110046),
        new Airport("CYND", "Gatineau", 45.52170181, -75.56359863),
        new Airport("CYNM", "Matagami", 49.76169968, -77.80280304),
        new Airport("CYOO", "Oshawa", 43.922798, -78.894997),
        new Airport("CYOW", "Ottawa", 45.32249832, -75.66919708),
        new Airport("CYQB", "Québec", 46.7911, -71.393303),
        new Airport("CYRC", "Chicoutimi", 48.52080154, -71.05059814),
        new Airport("CYRI", "Rivière-du-loup", 47.76440048, -69.58470154),
        new Airport("CYRJ", "Roberval", 48.52000046, -72.26560211),
        new Airport("CYRQ", "Trois-Rivières", 46.35279846, -72.67939758),
        new Airport("CYSB", "Sudbury", 46.625, -80.79889679),
        new Airport("CYSC", "Sherbrooke", 45.43859863, -71.69139862),
        new Airport("CYSG", "St Georges", 46.096401, -70.714699),
        new Airport("CYTF", "Alma", 48.50889969, -71.64189911),
        new Airport("CYTS", "Timmins", 48.56969833, -81.37670136),
        new Airport("CYUL", "Montréal", 45.47060013, -73.74079895),
        new Airport("CYUY", "Rouyn-Noranda", 48.20610046, -78.83560181),
        new Airport("CYVB", "Bonaventure", 48.07109833, -65.46029663),
        new Airport("CYVO", "Val-d'Or", 48.05329895, -77.78279877),
        new Airport("CYVP", "Kuujjuaq", 58.09609985, -68.42690277),
        new Airport("CYXK", "Rimouski", 48.47809982, -68.49690247),
        new Airport("CYYB", "North Bay", 46.36360168, -79.42279816),
        new Airport("CYYY", "Mont-Joli", 48.60860062, -68.20809937),
        new Airport("CYYZ", "Toronto", 43.67720032, -79.63059998),
        new Airport("CYZV", "Sept-Îles", 50.22330093, -66.26560211),
    ].sort(compare),
    flights: [],
    passengers: [
        new Passenger("John", "Doe", "john@doe.com"),
        new Passenger("Joanne", "Prime", "jprime@gmail.com"),
        new Passenger("Valerie", "Rose", "vrose@tele.com"),
        new Passenger("Kais", "Thomas", "kthomas@karaoke.com"),
        new Passenger("Simon", "Laporte", "slap@hotmail.ca"),
        new Passenger("Katerine", "Simmoneaux", "k.sim@telus.net"),
        new Passenger("Jeremie", "Paul", "jerejere@rogers.com"),
        new Passenger("Anne", "LaBanane", "alab@hotmail.com"),
        new Passenger("Shawn", "McLaughlin", "shawnmcdev@gmail.com"),
    ]

};

function Airport(code, name, lat, lon) {
    this.code = code;
    this.name = name;
    this.lat = lat;
    this.lon = lon;
}

function Flight(airportFrom, airportTo, departureDate, departureTime, returnDate, returnTime, maxPassengers, isNewFlight = true) {
    this.id = Flight.id++;
    this.departureDate = departureDate;
    this.departureTime = departureTime;
    this.returnDate = returnDate;
    this.returnTime = returnTime;
    this.isNewFlight = isNewFlight;
    this.airportFrom = airportFrom;
    this.maxPassengers = maxPassengers || 9;
    this.airportTo = airportTo;
    if (this.airportFrom && this.airportTo) {
        this.distance = distanceInMiles(this.airportFrom.lat, this.airportFrom.lon, this.airportTo.lat, this.airportTo.lon);
    } else {
        console.log("Error getting airports, got: " + JSON.stringify(airportFrom), JSON.stringify(airportTo));
        return null;
    }
    this.totalCost = this.distance * 9;
    this.totalCost += this.totalCost * EDGARD_RATE;
    this.totalCost *= 2;
    this.passengers = [];
    this.passengersToAdd = [];
}
Flight.prototype.currentPricePer = function() {
    return (this.totalCost / Math.max(this.passengers.length, 1)).toFixed(2);
};
Flight.prototype.priceAddedPassengers = function(amt) {
    amt = Math.max(amt, 1);
    console.log("Calculating price adding " + amt + " passengers");
    return (this.totalCost / Math.max(this.passengers.length + amt, 1)).toFixed(2);
};
Flight.prototype.priceIfFull = function() {
    return (this.totalCost / this.maxPassengers).toFixed(2);
};
Flight.prototype.getPassengerCount = function() {
    return this.passengers.length;
}
Flight.prototype.getStatus = function() {
    if (this.getPassengerCount() === this.maxPassengers) return Flight.STATUS.FULL;
    else if (this.getPassengerCount() >= this.maxPassengers - 2) return Flight.STATUS.ALMOST_FULL;
    else return Flight.STATUS.INITIATED;
}
Flight.STATUS = {
    "INITIATED": 0,
    "ALMOST_FULL": 1,
    "FULL": 2,
}
Flight.id = 0;

function Passenger(first, last, email) {
    this.first = first;
    this.last = last;
    this.email = email;
    this.id = Passenger.id++;
}
Passenger.id = 0;


/**
 * Mock Services
 */

var services = {
    airport: {
        getCityList: function() {
            return MOCK_DATA.airports.map(x => x.name);
        },
        getAirport: function(code) {
            return MOCK_DATA.airports.filter(x => x.code.toLowerCase() === code.toLowerCase())[0];
        }
    },
    flight: {
        getForMonth: function(month, location) {
            let flights = MOCK_DATA.flights.filter(x => x.departureDate.getUTCMonth() === month);
            let data = {};
            if (location) {
                console.log("Filtering for location: " + location);
                flights = flights.filter(f => {
                    console.log("Comparing " + f.airportFrom.name + " to " + location);
                    console.log(f.airportFrom.name == location);
                    return f.airportFrom.name === location;
                });
            }
            flights.forEach(f => {
                let date = f.departureDate.getUTCDate();
                if (data[date]) data[date].push(f);
                else data[date] = [f];
            });
            return data;
        },
        getById: function(id) {
            console.log("Fetching flight for id: " + id);
            return MOCK_DATA.flights.filter(x => x.id == id)[0];
        }
    },
    user: {

    },
};

var mock_flight_data = JSON.parse("{\"departureDate\":\"2018-02-21T05:00:00.000Z\",\"departureTime\":\"11:00\",\"returnDate\":\"2018-02-22\",\"returnTime\":\"19:00\",\"airportFrom\":{\"code\":\"CYUY\",\"name\":\"Rouyn-Noranda\",\"lat\":48.20610046,\"lon\":-78.83560181},\"maxPassengers\":9,\"airportTo\":{\"code\":\"CYTF\",\"name\":\"Alma\",\"lat\":48.50889969,\"lon\":-71.64189911},\"distance\":330.8099229903399,\"totalCost\":7443.223267282648,\"passengers\":[{\"first\":\"Bob\",\"last\":\"Pogo\",\"email\":\"yrich@gmail.com\"},{\"first\":\"a\",\"last\":\"b\",\"email\":\"c\"}],\"passengersToAdd\":[]}");
var mock_flight = new Flight();
Object.keys(mock_flight_data).forEach(k => {
    mock_flight[k] = mock_flight_data[k];
});
mock_flight.departureDate = new Date(mock_flight.departureDate);
mock_flight.returnDate = new Date(mock_flight.returnDate);
mock_flight.isNewFlight = false;
//MOCK_DATA.flights.push(new Flight("CYVO", "CYUL", new Date(), new Date()));
//MOCK_DATA.flights.push(mock_flight);
let flight = new Flight(MOCK_DATA.airports[27], MOCK_DATA.airports[18], new Date(2018, 01, 23), "08:15", new Date(2018, 01, 23), "23:00", 9, false);
flight.passengers = MOCK_DATA.passengers.slice(0);
MOCK_DATA.flights.push(flight);
flight = new Flight(MOCK_DATA.airports[27], MOCK_DATA.airports[23], new Date(2018, 01, 19), "01:00", new Date(2018, 01, 19), "21:00", 9, false);
flight.passengers = MOCK_DATA.passengers.slice(2);
MOCK_DATA.flights.push(flight);
flight = new Flight(MOCK_DATA.airports[27], MOCK_DATA.airports[0], new Date(2018, 01, 19), "03:45", new Date(2018, 01, 19), "20:00", 9, false);
flight.passengers = MOCK_DATA.passengers.slice(5);
MOCK_DATA.flights.push(flight);

function CalendarFlight(flight, i) {
    let div = document.createElement("div");
    div.classList.add("calendar-flight");
    switch (flight.getStatus()) {
        case Flight.STATUS.FULL:
            div.classList.add("full");
            break;
        case Flight.STATUS.ALMOST_FULL:
            div.classList.add("almost-full");
            break;
        default:
            break;
    }
    div.setAttribute("data-flightid", flight.id);
    let locations = document.createElement("div");
    locations.classList.add("locations");
    div.appendChild(locations);
    locations.innerText = flight.airportFrom.name + " > " + flight.airportTo.name;
    if (i === 0) {
        div.classList.add("first");
        let passengerCount = document.createElement("div");
        passengerCount.classList.add("passengerCount");
        let infoBtn = document.createElement("div");
        infoBtn.classList.add("infoBtn");
        passengerCount.innerHTML = "<span>" + flight.passengers.length + "/" + flight.maxPassengers + "</span> <i class='fas fa-user'></i>";
        infoBtn.innerHTML = "<i class='fas fa-info-circle'></i>";
        div.appendChild(passengerCount);
        div.appendChild(infoBtn);
    } else {
        div.style = "top: " + (60 + (i - 1) * 14) + "px";
    }
    return div;
}
/**
 * VUE JS
 */
/*

/** Global Event Bus */
var bus = new Vue();
var state = {
    step: 1,
    airports: MOCK_DATA.airports,
    cities: services.airport.getCityList(),
    popupJoin: false,
    popupInitiate: false,
    popupAddPassenger: false,
    date: {},
    cityIndex: 0,
    destinationIndex: 0,
    destination: null,
    origin: null,
    flight: {},
    departureTime: "11:00",
    returnDate: new Date(2018, 01, 28),
    returnTime: "19:00",
    services: services,
    monthFlights: {},
    user: {
        id: 0,
        firstName: "Yannick",
        lastName: "Richard",
        email: "yrich@gmail.com"
    },
    passengerFirstName: "",
    passengerLastName: "",
    passengerEmail: "",
    initialPrice: 0
};
var app = new Vue({
    el: "#app-root",
    data: state,
    methods: {
        calendarClick: function(event) {
            console.log(event);
            let target = event.target;
            if (!this.popupInitiate && !this.popupJoin) {
                if (target.tagName === "TD") { //clicked calendar cell
                    let date = target.getAttribute('data-date');
                    if (!date) return false;
                    this.date = new Date("02/" + date + "/2018");
                    this.popupInitiate = true;
                    this.updateFlight();
                    return;
                }
                if (target.hasAttribute("data-flightid")) {
                    this.setFlight(services.flight.getById(target.getAttribute("data-flightid")));
                    return;
                } else {
                    target = target.parentNode;
                    if (target.tagName === "TD") { //clicked calendar cell
                        let date = target.getAttribute('data-date');
                        if (!date) return false;
                        this.date = new Date("02/" + date + "/2018");
                        this.popupInitiate = true;
                        this.updateFlight();
                        return;
                    }
                    if (target.hasAttribute("data-flightid")) {
                        this.setFlight(services.flight.getById(target.getAttribute("data-flightid")));
                        return;
                    }
                    return;
                }

            }
        },
        cityChanged: function() {
            this.cityIndex = document.getElementsByName("city")[0].selectedIndex;
            console.log("City changed to index " + this.cityIndex);
            this.populateCalendar();
        },
        getOrigin: function() {
            return this.airports[this.cityIndex];
        },
        getDestination: function() {
            console.log("Getting destination airport object for index " + this.destinationIndex);
            return this.airports[this.destinationIndex];
        },
        getMonthName: function(index) {
            return ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"][index];
        },
        closePopup: function(which) {
            this.flight = {};
            if (which === "initiate") this.popupInitiate = false;
            else if (which === "join") this.popupJoin = false;
        },
        destinationChanged: function() {
            this.destinationIndex = document.getElementsByName("destinationCity")[0].selectedIndex;
            this.updateFlight();
        },
        joinFlight: function() {
            console.log("Joining flight..");
            this.step = 2;
        },
        initiateFlight: function() {
            console.log("Initiating flight..");
            if (timeRegex.test(this.departureTime) && timeRegex.test(this.returnTime)) {
                console.log("Valid times");
                this.flight = new Flight(this.getOrigin(), this.getDestination(), new Date(this.date), this.departureTime, this.returnDate, this.returnTime);
                this.flight.passengersToAdd.push(new Passenger(this.user.firstName, this.user.lastName, this.user.email));
                console.log("Initiated flight:" + JSON.stringify(this.flight));
                this.step = 2;
            } else {
                console.log("Invalid time(s) specified");
            }
        },
        addPassenger: function() {
            console.log("adding passenger");
            if (this.flight.passengersToAdd.length < this.flight.maxPassengers) {
                this.popupAddPassenger = true;
            }
        },
        setFlight: function(flight) {
            this.flight = flight;
            this.date = flight.departureDate;
            this.departureTime = flight.departureTime;
            //this.returnDate = "" + this.flight.returnDate.getUTCDate() + " " + this.getMonthName(this.flight.returnDate.getMonth()) + " " + this.flight.returnDate.getFullYear();
            this.returnDate = this.flight.returnDate;
            this.returnTime = flight.returnTime;
            this.origin = flight.airportFrom;
            this.destination = flight.airportTo;
            this.flight.passengersToAdd.push(new Passenger(this.user.firstName, this.user.lastName, this.user.email));
            this.popupJoin = true;
        },
        closeAddPassenger: function() {
            console.log("Cancelling passenger..");
            this.popupAddPassenger = false;
            this.passengerLastName = "";
            this.passengerFirstName = "";
            this.passengerEmail = "";
        },
        confirmPassenger: function() {
            this.flight.passengersToAdd.push(new Passenger(this.passengerFirstName, this.passengerLastName, this.passengerEmail));
            this.closeAddPassenger();
        },
        removePassenger: function(index) {
            console.log("removing passenger", index);
            if (index !== 0) this.flight.passengersToAdd.splice(index, 1);
        },
        pricePerPerson: function() {
            if (!this.flight.currentPricePer) return "--.--$";
            else return this.flight.currentPricePer() + "$";
        },
        pricePerPersonUpdated: function() {
            if (!this.flight.currentPricePer) return "--.--$";
            else return this.flight.priceAddedPassengers(this.passengersToAddCount) + "$";
        },
        priceIfFull: function() {
            if (!this.flight.priceIfFull) return "--.--$";
            else return this.flight.priceIfFull() + "$";
        },
        cancel: function() {
            if (confirm("Annuler et retourner à la page d'accueil?")) {
                location.href = "./";
            }
        },
        goBack: function() {
            this.step = this.step - 1 || 1;
        },
        goForward: function() {
            if (this.step < 4) this.step++;
        },
        confirm: function() {
            this.flight.passengers.push(...this.flight.passengersToAdd);
            this.step = 4;
            if (this.flight.isNewFlight)
                MOCK_DATA.flights.push(this.flight);
        },
        done: function() {
            //location.href = './initiez.html';
            this.flight = {};
            this.popupInitiate = false;
            this.popupJoin = false;
            this.step = 1;
        },
        updateFlight: function() {
            this.flight = new Flight(this.getOrigin(), this.getDestination(), new Date(this.date), this.departureTime, this.returnDate, this.returnTime);
        },
        clearCalendar: function() {
            document.querySelectorAll(".calendar-flight")
                .forEach(elem => {
                    elem.parentNode.removeChild(elem);
                });
        },
        populateCalendar: function() {
            console.log("Clearing calendar..");
            this.clearCalendar();
            this.monthFlights = {};
            console.log("Populating calendar..");
            this.monthFlights = this.services.flight.getForMonth(1, this.getOrigin().name);
            document.querySelectorAll("[data-date]").forEach(elem => {
                let first = true;
                let flights = this.monthFlights[elem.getAttribute("data-date")];
                if (flights)
                    flights.forEach((f, i) => {
                        elem.appendChild(CalendarFlight(f, i));
                        first = false;
                    });
            });
        }
    },
    computed: {
        airportName: function() {
            console.log("Getting name");
            return this.airports[this.cityIndex].name;
        },
        dateString: function() {
            return "le " + this.date.getUTCDate() + " " + this.getMonthName(this.date.getUTCMonth());
        },
        returnDateString: function() {
            let d = new Date(this.returnDate);
            console.log(JSON.stringify(d));
            return d.getUTCDate() + " " + this.getMonthName(d.getUTCMonth());
        },
        totalCost: function() {
            if (!this.flight.totalCost) return "--.--$";
            else return this.flight.totalCost.toFixed(2) + "$";
        },
        passengerCount: function() {
            if (!this.flight.passengers) return 0;
            else return this.flight.passengers.length;
        },
        passengersToAddCount: function() {
            return this.flight.passengersToAdd.length;
        },
        departureLocationLink: function() {
            return this.getOrigin() ? `https://www.google.com/maps?ll=${this.getOrigin().lat},${this.getOrigin().lon}&z=13` : "#";
        },
        destinationLocationLink: function() {
            return this.getDestination() ? `https://www.google.com/maps?ll=${this.getDestination().lat},${this.getDestination().lon}&z=13` : "#";
        }
    },
    watch: {
        returnDate: function() {
            if (this.flight.isNewFlight) {
                console.log("Initiating flight..");
                if (timeRegex.test(this.departureTime) && timeRegex.test(this.returnTime)) {
                    console.log("Valid times");
                    this.updateFlight();
                    this.flight.returnDate = new Date(this.date);
                    this.initialCost = this.flight.totalCost;
                    console.log("Initiated flight:" + JSON.stringify(this.flight));
                } else {
                    console.log("Invalid time(s) specified");
                }
            }
        },
        step: function() {
            console.log("Step changed..");
            if (this.step === 1) {
                let _this = this;
                Vue.nextTick()
                    .then(function() {
                        document.getElementsByName("city")[0].selectedIndex = 27;
                        _this.populateCalendar();
                    });
            }
        }
    },
    created: function() {},
    mounted: function() {
        document.getElementsByName("city")[0].selectedIndex = 27;
        this.cityChanged();
    }
});