const ip = document.getElementById("ip");
const btn = document.getElementById("btn");

let ipAddress;

async function ipApi() {
    const ipUrl = "https://api.ipify.org?format=json";
    try {
        let response = await fetch(ipUrl);
        let data = await response.json();
        console.log(data);
        ip.innerHTML = data.ip;
        ipAddress = data.ip;
    } catch (error) {
        alert(error);
        console.log(error);
    };
};

btn.addEventListener("click", () => {
    if (ipAddress) {
        document.cookie = `ipAddress=${ipAddress}; path=./detail.html`;
        window.location = "./detail.html";
    } else {
        window.location = "./index.html";
    }
});

document.addEventListener("DOMContentLoaded", ipApi);
