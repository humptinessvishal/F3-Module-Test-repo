const ip = document.getElementById("ip-address");

const lat = document.getElementById("lat");
const long = document.getElementById("long");
const city = document.getElementById("city");
const region = document.getElementById("region");
const organization = document.getElementById("Organization");
const hostName = document.getElementById("hostname");

const map = document.getElementById("map");

const timeZone = document.getElementById("timeZone");
const date = document.getElementById("date");
const pinCode = document.getElementById("pincode");
const message = document.getElementById("msg");

const search = document.getElementById("search");

const cont = document.getElementById("offices-container");


const myIpAddress = getCookie('ipAddress');

function getCookie(key) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(key + '=')) {
            return cookie.substring(key.length + 1);
        };
    }
    return null;
};

function render(data) {
    ip.innerHTML = data.ip;
    lat.innerText = data.latitude;
    long.innerText = data.longitude;
    city.innerText = data.city;
    region.innerText = data.region;
    organization.innerText = data.org;
    hostName.innerText = data.network;
    timeZone.innerText = data.timezone;
    date.innerText = new Date().toLocaleString("en-US", { timeZone: `${data.timezone}` });
    pinCode.innerText = data.postal;
    searchPost(data.postal);
};

async function getApiDAta() {
    const url = `https://ipapi.co/${myIpAddress}/json/`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        render(data);
    } catch (error) {
        console.log("Your Error is: ", error);
    };
};

async function searchPost(pin) {
    const value = search.value;
    let url = `https://api.postalpincode.in/pincode/${value ? value : pin}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        message.innerText = data[0].Message;

        if (value.length !== 6 && data[0].Status === "Error") {
            cont.innerHTML = "";
            cont.innerHTML = `<h1>Loading...</h1>`;
        } else if (value.length === 6 && data[0].Status === "Error") {
            cont.innerHTML = "";
            cont.innerHTML = `<h1>Enter Valid Pincode</h1>`;
        } else {
            cont.innerHTML = "";
            for (let i = 0; i < data[0].PostOffice.length; i++) {
                cont.innerHTML += `
                <div class="card">
                    <p>Name: <span>${data[0].PostOffice[i].Name}</span></p>
                    <p>Branch type: <span>${data[0].PostOffice[i].BranchType}</span></p>
                    <p>Delivery Status: <span>${data[0].PostOffice[i].DeliveryStatus}</span></p>
                    <p>District: <span>${data[0].PostOffice[i].District}</span></p>
                    <p>Division: <span>${data[0].PostOffice[i].Division}</span></p>
                </div>`;
            };
        };
    } catch (error) {
        console.log(error);
        cont.innerHTML = "";
        cont.innerHTML = `<h1>Enter Valid Pincode</h1>`;
    };
};

function fetchLocationData() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            map.src = `https://maps.google.com/maps?q=${latitude}, ${longitude}&z=16&output=embed`;
        }, function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            };
        });
    } else {
        alert("Geolocation is not supported in this browser.");
    };
};

document.addEventListener("DOMContentLoaded", () => {
    getApiDAta();
    fetchLocationData();
});

search.addEventListener("keyup", searchPost);
