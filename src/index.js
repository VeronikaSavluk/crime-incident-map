import './css/common.css';

import events from '../events.json';
import names from '../names.json';

const refs = {
    totalStatistic: document.querySelector(".total-statistic"),
    range: document.querySelector("#range"),
    btn: document.querySelector("#btn"),
    histogram: document.querySelector(".histogram"),
    mapUkrain: document.querySelector(".map"),
};
console.log(btn);
const dataNames = names.en;
const affectedType = dataNames.affected_type;

const disappearance = events.filter(event => event.qualification == 10);
const rape = events.filter(event => event.qualification == 23);
const death = events.filter(event => event.qualification == 7 || event.qualification == 16);
const wounded = events.filter(event => event.qualification == 8 || event.qualification == 11 || event.qualification == 17);
const violationOfOtherRights = events.filter(event => event.qualification != 7
    && event.qualification != 8
    && event.qualification != 10
    && event.qualification != 11
    && event.qualification != 16
    && event.qualification != 17
    && event.qualification != 23
);

const statisticItems = `<li>
                    <span class="number">${new Intl.NumberFormat().format(death.length)}</span>
                    <p>${affectedType[2]}</p>
                </li>
                <li>
                    <span class="number">${new Intl.NumberFormat().format(wounded.length)}</span>
                    <p>${affectedType[3]}</p>
                </li><li>
                    <span class="number">${new Intl.NumberFormat().format(rape.length)}</span>
                    <p>${affectedType[4]}</p>
                </li>
                <li>
                    <span class="number">${new Intl.NumberFormat().format(disappearance.length)}</span>
                    <p>${affectedType[6]}</p>
                </li>`;

refs.totalStatistic.innerHTML = "";
refs.totalStatistic.insertAdjacentHTML("beforeend", statisticItems);

localStorage.clear();

for (let date = Date.parse('2022-06-20'); date <= Date.parse('2022-09-28'); date += 86400000) {
    events.filter(({ from, lat, lon }) => {
        if (Date.parse(from) === date) {
        const obj = { lt: lat, ln: lon };
        const LS = localStorage.getItem(new Date(from));
        const parsedLS = JSON.parse(LS);
        if (!LS) {
            localStorage.setItem(new Date(from), JSON.stringify([obj]));
        } else
            if (LS && !parsedLS.includes(obj)) {
                localStorage.setItem(new Date(from), JSON.stringify([...parsedLS, obj]));
            };
        };
    });
};

refs.histogram.innerHTML = "";
for (let date = Date.parse('2022-06-20'); date <= Date.parse('2022-09-28'); date += 86400000) {
if (localStorage.getItem(new Date(date))) {
    const totalEventsOfDay = JSON.parse(localStorage.getItem(new Date(date))).length;
        refs.histogram.insertAdjacentHTML("beforeend", `<li><div style="background-color:#292929; margin-left:2px; width:8px; height:${Number.parseInt(totalEventsOfDay)}px;"></div></li>`);
    } else {
        refs.histogram.insertAdjacentHTML("beforeend", `<li><div style="margin-left:2px; width:8px;"></div></li>`);
    }
}

refs.range.addEventListener("input", (e) => {
    e.preventDefault();
    let inputValue = new Date(Number(e.currentTarget.value));
    if (localStorage.getItem(inputValue)) {
        const eventsOfDay = JSON.parse(localStorage.getItem(inputValue));
        refs.mapUkrain.innerHTML = "";
        const incidents = eventsOfDay.map(({ lt, ln }) =>
            `<circle style="position:absolute; background-color:#C00000; border-radius:50%; width:3px; height:3px; top:${Number.parseInt(lt)}%; right:${Number.parseInt(ln)}%;"></circle>`
        ).join("");
        refs.mapUkrain.insertAdjacentHTML("beforeend", incidents);
    };
});