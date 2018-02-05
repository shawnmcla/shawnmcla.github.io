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


};

function Airport(code, name, lat, lon) {
    this.code = code;
    this.name = name;
    this.lat = lat;
    this.lon = lon;
}

function Flight(airportFrom, airportTo, departureDate, departureTime, returnDate, returnTime, maxPassengers = 16) {
    this.departureDate = departureDate;
    this.departureTime = departureTime;
    this.returnDate = returnDate;
    this.returnTime = returnTime;
    this.airportFrom = airportFrom;
    this.maxPassengers = maxPassengers;
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

function Passenger(first, last, email) {
    this.first = first;
    this.last = last;
    this.email = email;
}

Flight.prototype.currentPricePer = function() {
    return (this.totalCost / Math.max(this.passengers.length, 1)).toFixed(2);
};
Flight.prototype.priceAddedPassengers = function(amt) {
    return (this.totalCost / (Math.max(this.passengers.length, 1) + amt)).toFixed(2);
};
Flight.prototype.priceIfFull = function() {
    return (this.totalCost / this.maxPassengers).toFixed(2);
};

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
        getForMonth: function(month) {
            return MOCK_DATA.flights.filter(x => x.departureDate.getMonth() === month);
        }
    },
    user: {

    },
};

//MOCK_DATA.flights.push(new Flight("CYVO", "CYUL", new Date(), new Date()));

/**
 * VUE JS
 */
/*
var PopupJoin = {
    template: `                <div class="popup popup-join">
     <div class="prompt">Joindre ce vol</div>
     <div class="btn-close"><i title="Fermer" class="fas fa-times"></i></div>
     <div class="departure">Départ <span class="date">le 15 février</span></div>
     <div class="departure-time"><input type="text" id="departureTime" placeholder="hr:mn" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" value="11:30" readonly/></div>
     <div class="departure-location"><input type="text" value="Aéroport régional de Rouyn-Noranda" readonly></div>
     <div class="locate-link-from"><a href="#">Localiser l'aéroport</a></div>
     <div class="destination-location"><input type="text" value="Montréal-Les Cèdres" readonly></div>
     <div class="locate-link-to"><a href="#">Localiser l'aéroport</a></div>
     <div class="divider"></div>
     <div class="divider-arrow"><i class="fas fa-caret-down"></i></div>
     <div class="return">Retour</div>
     <input type="date" class="returnDate" value="0" />
     <input type="text" class="returnTime" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" placeholder="hr:mn" value="19:30" readonly/>

     <table>
         <tr>
             <td>Personnes confirmées au vol</td>
             <td class="right-col">9/18</td>
         </tr>
         <tr>
             <td>Prix par personne actuellement</td>
             <td class="right-col">328.57$</td>
         </tr>
         <tr>
             <td>Prix par personne si vous confirmez</td>
             <td class="right-col">306.67$</td>
         </tr>
         <tr>
             <td>Prix total de l'avion</td>
             <td class="right-col">6656.79$</td>
         </tr>
     </table>
     <div class="share">Partagez <span class="share-icon"><i class="fas fa-share-alt"></i></span><span class="share-icon"><i class="fas fa-check-square"></i></span> </div>
     <div class="passengerCount">
         <div class="btn btn-minus disabled"><i class="fas fa-minus"></i></div>
         <div class="count">1&nbsp;&nbsp;&nbsp;<i class="fas fa-user"></i></div>
         <div class="btn btn-plus disabled"><i class="fas fa-plus"></i></div>
     </div>
     <div class="btn btn-warning btn-cancel">Annuler</div>
     <div class="btn btn-success btn-join-flight">Joindre ce vol</div>
     <svg class="arrow" width="21" height="18" viewBox="0 0 21 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Canvas" transform="translate(-21040 -6472)"><g id="Polygon"><use xlink:href="#path0_fill" transform="matrix(-1 -1.22465e-16 1.22465e-16 -1 21060.8 6490)" fill="#FFFFFF"/></g></g><defs><path id="path0_fill" d="M 10.3923 0L 20.7846 18L -5.18951e-08 18L 10.3923 0Z"/></defs></svg>
 </div>`,
    data: function() {
        return {

        };
    }
};

Vue.component('popup-initiate', {
    template: `<div class="popup popup-initiate">
    <div class="prompt">Initiez un vol</div>
    <div class="btn-close" @click="close"><i title="Fermer" class="fas fa-times"></i></div>
    <div class="departure">Départ <span class="date">le 20 février</span></div>
    <div class="departure-time"><input type="text" v-model="departureTime" id="departureTime" placeholder="hr:mn" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" value="11:30" /></div>
    <div class="departure-location"><input type="text" v-bind:value="airportName" readonly></div>
    <div class="locate-link-from"><a href="#">Localiser l'aéroport</a></div>
    <div class="destination-location">
    <select @change="destinationChanged" class="destination-dropdown" name="destinationCity">
    <option v-for="city in cities">{{ city }}</option>
    </select>
    </div>
    <div class="locate-link-to"><a href="#">Localiser l'aéroport</a></div>
    <div class="divider"></div>
    <div class="divider-arrow"><i class="fas fa-caret-down"></i></div>
    <div class="return">Retour</div>
    <input type="date" v-model="returnDate" class="returnDate" value="Febuary 28th 2017" />
    <input type="text" v-model="returnTime" class="returnTime" placeholder="hr:mn" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" value="19:30" />

    <table>
        <tr>
            <td>Personnes confirmées au vol</td>
            <td class="right-col">1/18</td>
        </tr>
        <tr>
            <td>Prix par personne actuellement</td>
            <td class="right-col">328.57$</td>
        </tr>
        <tr>
            <td>Prix par personne si vous confirmez</td>
            <td class="right-col">306.67$</td>
        </tr>
        <tr>
            <td>Prix total de l'avion</td>
            <td class="right-col">6656.79$</td>
        </tr>
    </table>
    <div class="share">Partagez <span class="share-icon"><i class="fas fa-share-alt"></i></span><span class="share-icon"><i class="fas fa-check-square"></i></span> </div>
    <div class="passengerCount">
        <div class="btn btn-minus disabled"><i class="fas fa-minus"></i></div>
        <div class="count">1&nbsp;&nbsp;&nbsp;<i class="fas fa-user"></i></div>
        <div class="btn btn-plus disabled"><i class="fas fa-plus"></i></div>
    </div>
    <div @click="close" class="btn btn-warning btn-cancel">Annuler</div>
    <div @click="initiate" class="btn btn-success btn-initiate-flight">Initiez votre vol</div>
    <svg class="arrow" width="21" height="18" viewBox="0 0 21 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Canvas" transform="translate(-21040 -6472)"><g id="Polygon"><use xlink:href="#path0_fill" transform="matrix(-1 -1.22465e-16 1.22465e-16 -1 21060.8 6490)" fill="#FFFFFF"/></g></g><defs><path id="path0_fill" d="M 10.3923 0L 20.7846 18L -5.18951e-08 18L 10.3923 0Z"/></defs></svg>
</div>`,
    data: function() {
        return {
            departureDate: date,
            departureTime: 0,
            destination: 0,
            returnDate: 0,
            returnTime: 0,
        };
    },
    //props: ['airportName', 'date', 'cities', 'show'],
    methods: {
        close: function() {
            console.log("Close");
            bus.$emit('close', "initiate");
        },
        initiate: function() {
            console.log("Initiating flight..");
            if (timeRegex.test(this.departureTime) && timeRegex.test(this.returnTime)) {
                console.log("Valid times");
                bus.$emit('initiate', this);
            } else {
                console.log("Invalid time(s) specified");
            }
        },
        destinationChanged: function() {
            console.log("Emitting destination change event..");
            bus.$emit('destinationChanged', document.getElementsByName("destinationCity")[0].selectedIndex);
        }
    }
});
*/
/** Global Event Bus */
var bus = new Vue();
var state = {
    step: 1,
    airports: MOCK_DATA.airports,
    cities: services.airport.getCityList(),
    popupJoin: false,
    popupInitiate: false,
    date: {},
    cityIndex: 0,
    destinationIndex: 0,
    destination: null,
    origin: null,
    flight: {},
    departureTime: "11:00",
    returnDate: new Date(2018, 01, 28),
    returnTime: "19:00",
    firstName: "Yannick",
    lastName: "Richard",
    initialPrice: 0,
    passengersToAdd: [{}],
};
var app = new Vue({
    el: "#app-root",
    data: state,
    methods: {
        calendarClick: function(event) {
            console.log(event);
            let target = event.target;
            if (!this.popupInitiate) {
                if (target.tagName != "TD") {
                    console.log("Clicked " + target.tagName);
                    target = target.parentNode;
                    if (target.tagName != "TD") {
                        console.log("Clicked: " + target.tagName);
                        return false;
                    }
                }
                let date = target.getAttribute('data-date');
                if (!date) return false;
                this.date = new Date("02/" + date + "/2018");
                this.popupInitiate = true;
            }
        },
        cityChanged: function() {
            this.cityIndex = document.getElementsByName("city")[0].selectedIndex;
            console.log("City changed to index " + this.cityIndex);
        },
        getOrigin: function() {
            return this.airports[this.cityIndex];
        },
        getDestination: function() {
            console.log("Getting destination airport object for index " + this.destinationIndex);
            return this.airports[this.destinationIndex];
        },
        getMonthName: function(index) {
            return ["janvier", "février", "mars", "avril", "may", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"][index];
        },
        closePopup: function(which) {
            if (which === "initiate") this.popupInitiate = false;
            else if (which === "join") this.popupJoin = false;
        },
        destinationChanged: function() {
            this.destinationIndex = document.getElementsByName("destinationCity")[0].selectedIndex;
        },
        initiateFlight: function() {
            console.log("Initiating flight..");
            if (timeRegex.test(this.departureTime) && timeRegex.test(this.returnTime)) {
                console.log("Valid times");
                this.flight = new Flight(this.getOrigin(), this.getDestination(), new Date(this.date), this.departureTime, this.returnDate, this.returnTime);
                this.flight.passengersToAdd.push(...this.passengersToAdd);
                console.log("Initiated flight:" + JSON.stringify(this.flight));
                this.step = 2;
            } else {
                console.log("Invalid time(s) specified");
            }
        },
        addPassenger: function() {
            console.log("adding passenger");
            if (this.passengersToAdd.length < this.flight.maxPassengers)
                this.passengersToAdd.push({});
        },
        removePassenger: function() {
            console.log("removing passenger");
            if (this.passengersToAdd.length > 1) this.passengersToAdd.pop();
        },
        pricePerPerson: function() {
            if (!this.flight.currentPricePer) return "--.--$";
            else return this.flight.currentPricePer() + "$";
        },
        pricePerPersonUpdated: function() {
            if (!this.flight.currentPricePer) return "--.--$";
            else return this.flight.priceAddedPassengers(this.passengersToAddCount - 1) + "$";
        },
        priceIfFull: function() {
            if (!this.flight.priceIfFull) return "--.--$";
            else return this.flight.priceIfFull() + "$";
        },
        cancel: function() {
            if (confirm("Annuler la création du vol?")) {
                location.href = "/";
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
        },
        done: function() {
            location.href = '/';
        }
    },
    computed: {
        airportName: function() {
            console.log("Getting name");
            return this.airports[this.cityIndex].name;
        },
        dateString: function() {
            return "le " + this.date.getDate() + " " + this.getMonthName(this.date.getMonth());
        },
        returnDateString: function() {
            let d = new Date(this.returnDate);
            return d.getDate() + " " + this.getMonthName(d.getMonth());
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
            return this.passengersToAdd.length;
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
            console.log("Initiating flight..");
            if (timeRegex.test(this.departureTime) && timeRegex.test(this.returnTime)) {
                console.log("Valid times");
                this.flight = new Flight(this.getOrigin(), this.getDestination(), new Date(this.date), this.departureTime, this.returnDate, this.returnTime);
                this.initialCost = this.flight.totalCost;
                console.log("Initiated flight:" + JSON.stringify(this.flight));
            } else {
                console.log("Invalid time(s) specified");
            }
        },

    },
    created: function() {},
    mounted: function() {
        document.getElementsByName("city")[0].selectedIndex = 27;
        this.cityIndex = 27;
    }
});