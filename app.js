//BİSMİLLAHİRRAHMANİRRAHİM
let ulke = document.getElementById("countries")
let sehir = document.getElementById("cities")
let ilceler = document.getElementById("counties")

function GetTime() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let seconds = now.getSeconds();
    //let tarih=now.toLocaleDateString()

    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;
    if (seconds < 10) seconds = "0" + seconds;

    document.getElementById("current-time").innerText = `SAAT:
    ${hour}:${minute}:${seconds}`;

}
let countries = [], cities = [], counties = [];
let counter;

function getcountry() {
    return fetch("https://ezanvakti.herokuapp.com/ulkeler")
        .then(res => res.json())
        .then(data => {
            countries = data;
            let html = "";
            let indexTr = 0;
            for (let i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].UlkeID + '">' + data[i].UlkeAdi + '</option>';
                if (data[i].UlkeAdi == "TÜRKİYE") indexTr = i;
            }

            ulke.innerHTML = html;
            ulke.selectedIndex = indexTr;

            getcity(2);//2=türkiye
        })
}

function getcity(countryId) {
    return fetch("https://ezanvakti.herokuapp.com/sehirler/" + countryId)
        .then(res => res.json())
        .then(data => {
            cities = data;
            let html = "";
            let indexIst = 0;

            for (let i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].SehirID + '">' + data[i].SehirAdi + '</option>';
                if (data[i].SehirAdi == "İSTANBUL") indexIst = i;
            }

            sehir.innerHTML = html;
            if (countryId == 2) {
                sehir.selectedIndex = indexIst;
                getilce(539);// 539 istanbul
            } else {
                sehir.selectedIndex = 0;
                getilce(data[0].SehirID)
            }

        })
}

function getilce(cityId) {
    return fetch("https://ezanvakti.herokuapp.com/ilceler/" + cityId)
        .then(res => res.json())
        .then(data => {
            counties = data;
            let html = "";

            for (let i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].IlceID + '">' + data[i].IlceAdi + '</option>';

            }
            ilceler.innerHTML = html;
        })
}

function getvakit(countyId) {
    return fetch("https://ezanvakti.herokuapp.com/vakitler/" + countyId)
        .then(res => res.json())
        .then(data => {
            let currentDate = new Date();
            let saat = currentDate.toLocaleTimeString();
            let day = (currentDate.getDate() < 10) ?
                "0" + currentDate.getDate() :
                currentDate.getDate();

            let month = ((currentDate.getMonth() + 1) < 10) ?
                "0" + (currentDate.getMonth() + 1) :
                (currentDate.getMonth() + 1);

            let year = currentDate.getFullYear();

            currentDate = `${day}.${month}.${year}`;


            let index = data.findIndex(d => d.MiladiTarihKisa == currentDate);
            let selectData = data[index];

            let aksamVakti = document.getElementById("akşam")
            document.getElementById("tarih").innerText = `TARİH:
                ${selectData.MiladiTarihUzun}`;
            document.getElementById("hicri").innerText = `HİCRİ:
                ${selectData.HicriTarihUzun}`
            document.getElementById("imsak").innerText = `İMSAK : ${selectData.Imsak}`;
            document.getElementById("güneş").innerText = `GÜNEŞ : ${selectData.Gunes}`;
            document.getElementById("öğle").innerText = `ÖĞLE : ${selectData.Ogle}`;
            document.getElementById("ikindi").innerText = `İKİNDİ : ${selectData.Ikindi}`;
            aksamVakti.innerText = `AKŞAM : ${selectData.Aksam}`;
            document.getElementById("yatsı").innerText = `YATSI : ${selectData.Yatsi}`;


            clearInterval(counter); //yeni konuma göre sıfırlar
            counter = setInterval(function () {
                //bir sonraki namaz vaktine kalan süre
                if (saat < selectData.Imsak && saat > 0) {
                    namazaKalan(selectData.Imsak);
                }
                else if (saat < 24 && saat > selectData.Yatsi) {
                    namazaKalan(selectData.Imsak);
                }
                else if (saat < selectData.Gunes && saat > selectData.Imsak) {
                    namazaKalan(selectData.Sabah);
                }
                else if (saat < selectData.Ogle && saat > selectData.Gunes) {
                    namazaKalan(selectData.Ogle);
                }

                else if (saat < selectData.Ikindi && saat > selectData.Ogle) {
                    namazaKalan(selectData.Ikindi);
                }
                else if (saat < selectData.Aksam && saat > selectData.Ikindi) {
                    namazaKalan(selectData.Aksam);
                }
                else if (saat < selectData.Yatsi && saat > selectData.Aksam) {
                    namazaKalan(selectData.Yatsi);
                }

                iftarKalan(selectData.Aksam)//iftara kalan süre

            }, 1000);

        })
}
function namazaKalan(aksam) {
    let now = new Date().getTime();
    let endDate = new Date();
    let h = aksam.substr(0, 2);
    endDate.setHours(h);
    let m = aksam.substr(3, 2);
    endDate.setMinutes(m);
    endDate.setSeconds("0");

    let t = endDate - now;
    if (t > 0) {
        let hour = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minute = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        let second = Math.floor((t % (1000 * 60)) / 1000);

        document.getElementById('time-left').innerText = ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2);
    }
    else {
        document.getElementById('time-left').innerText = "00:00:00";
    }

}

function iftarKalan(vakit) {
    let anlik = new Date().getTime();
    let son = new Date();
    let hr = vakit.substr(0, 2);
    son.setHours(hr);
    let min = vakit.substr(3, 2);
    son.setMinutes(min);
    son.setSeconds("0");
    // console.log(son)

    let z = son - anlik
    // console.log(son - anlik)
    let hours = Math.floor((z % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((z % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((z % (1000 * 60)) / 1000);

    let iftar=document.getElementById('time-iftar')
    iftar.innerText = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);

}


function changeCountry() {
    let country = ulke.value;
    getcity(country)
}
function changeCity() {
    let city = sehir.value;
    getilce(city);

}

function ChangeLocation() {
    let countryInput = ulke.options[ulke.selectedIndex].text;
    let cityInput = sehir.options[sehir.selectedIndex].text;
    let ilceInput = ilceler.options[ilceler.selectedIndex].text;

    document.getElementById("country").innerText = countryInput;
    document.getElementById("city").innerText = cityInput;
    document.getElementById("county").innerText = ilceInput;

    console.log(ilceInput)
    getvakit(ilceler.value)

}


setInterval(() => {
    GetTime()
}, 1000)

getcountry()
getvakit(9541)

