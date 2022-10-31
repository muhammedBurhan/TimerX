let plusButton = document.querySelector('.add-timer');
let addButton = document.querySelector('.play-cf');
let currentName = document.querySelector('.current-name');
let currentHour = document.querySelector('.hour');
let currentMinute = document.querySelector('.minute');
let currentSecond = document.querySelector('.second');
let content = document.querySelector('.content');
let colorSelector = document.querySelector('.timer-colors');
let resetButton = document.querySelector('.reset');
let pauseCf = document.querySelector('.pause-cf');
let saveIt = document.querySelector('.save-it')
let getSave = document.querySelector('.get-save')
let config = document.getElementById('config');
let timerNumber = 1;
let timers = [];
let timers2 = [];
let defColor = document.querySelector('.color-1');
let defColorTo = document.querySelector('#c-1');
defColorTo.checked = true;
let currentColor = defColor.getAttribute('data-color');
let isPausedStart = false;
let isSaved = false;

currentName.style.border = "1px solid #999";

addButton.addEventListener('click', addTimer);
content.addEventListener('click', contentClick);
resetButton.addEventListener('click', resetBoxes);
saveIt.addEventListener('click', saveStatus);
getSave.addEventListener('click', getSaved);
pauseCf.addEventListener('click', () => {
    if (isPausedStart==false) {
        pauseCf.style.backgroundColor = "rgba(255, 255, 0, 0.7)";
        pauseCf.style.boxShadow = "0 0 10px orange";
        isPausedStart = true;
    }
    else {
        pauseCf.style += "background-color: #ddd";
        pauseCf.style += "box-shadow: 0 0 10px rgba(0, 0, 0, 0.7)";
        isPausedStart = false;
    }
})
colorSelector.addEventListener('click', (e) => {
    let target = e.target;
    if (target.getAttribute('data-class') == 'color')
    {
        currentColor = target.getAttribute('data-color');
    }
})
plusButton.addEventListener('click', () => {
    pauseCf.style += "background-color: #ddd";
    pauseCf.style += "box-shadow: 0 0 10px rgba(0, 0, 0, 0.7)";
    isPausedStart = false;
    defColorTo.checked = true;
})

if(window.innerWidth < 400) {
    content.style.justifyContent = "center";
}

setInterval(loop, 1000);

function addTimer() {
    if (currentName.value == '' || currentName.value.indexOf(',')!=-1) {
        currentName.style.border = "1px solid red";
        return "";
    }
    
    let alreadyNames = document.querySelectorAll('.timer-box .name');
    let alreadyNameList = []
    alreadyNames.forEach(y => {alreadyNameList.push(y.getAttribute('title'))})
    if (alreadyNameList.indexOf(currentName.value)!=-1) {
        currentName.style.border = "1px solid red";
        return "";
    }
    currentHour.value = currentHour.value == '' ? 0:parseInt(currentHour.value)
    currentMinute.value = currentMinute.value == '' ? 0:parseInt(currentMinute.value)
    currentSecond.value = currentSecond.value == '' ? 0:parseInt(currentSecond.value)
    currentName.style.border = "1px solid #999";
    let html = `
        <div data-number="${timerNumber}" class="timer-box">
            <div title="${currentName.value}" class="name">
                ${currentName.value.length<27?currentName.value:currentName.value.substring(0,27)+"..."}
            </div>
            <div data-number="${timerNumber}" class="time">
                <span class="hour">${double(currentHour.value)}</span>.<span class="minute">${double(currentMinute.value)}</span>.<span class="second">${double(currentSecond.value)}</span>
            </div>
            <div class="buttons">
                <button title="Bitir" data-number="${timerNumber}" class="stop">🗑️</button>
                <button title="Durdur" data-number="${timerNumber}" class="pause">⏸️</button>
                <button title="Devam" data-number="${timerNumber}" class="play">▶</button>
            </div>
        </div>
`
    let hour = parseInt(currentHour.value);
    let minute = parseInt(currentMinute.value);
    let second = parseInt(currentSecond.value);
    let totalSeconds = hour*60*60 + minute*60 + second;
    let targetDate = new Date();
    targetDate.setHours(new Date().getHours()+hour);
    targetDate.setMinutes(new Date().getMinutes()+minute);
    targetDate.setSeconds(new Date().getSeconds()+second);
    timers.push({
        name : currentName.value,
        targetDate : targetDate,
        isPaused : isPausedStart,
        number : timerNumber,
        isFinish : false,
        totalSeconds : totalSeconds
    })
    timers2.push({
        name : currentName.value,
        hour : hour,
        minute : minute,
        second : second,
        color : currentColor,
        isBroke : false,
        totalSeconds : totalSeconds
    })
    content.innerHTML += html;
    content.querySelector(`.timer-box[data-number="${timerNumber}"]`).style.backgroundColor = currentColor;
    if (isPausedStart) {
        content.querySelector(`.pause[data-number="${timerNumber}"]`).style.backgroundColor = "rgba(255, 255, 0, 0.3)";
        content.querySelector(`.pause[data-number="${timerNumber}"]`).style.boxShadow = "0 0 10px orange";
    }
    else if (!isPausedStart) {
        content.querySelector(`.play[data-number="${timerNumber}"]`).style.backgroundColor = "rgba(0, 255, 0, 0.3)";
        content.querySelector(`.play[data-number="${timerNumber}"]`).style.boxShadow = "0 0 10px lime";
    }
    config.checked = false;
    timerNumber += 1;
    isSaved = false;
    saveIt.removeAttribute('data-checked');
    resetBoxes();
}

function double(data) {
    if (data < 10) {
        return `0${data}`
    }
    else 
    {
        return data
    }
}

function contentClick(e) {
    let target = e.target;
    if (target.className == 'play') {
        let timerNum = target.getAttribute('data-number');
        timers.forEach(element=>{if(element.number==timerNum){
            element.isPaused = false;
            target.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
            target.style.boxShadow = "0 0 10px lime";
            target.parentNode.querySelector('.pause').style += "background-color: #ddd";
            target.parentNode.querySelector('.pause').style += "box-shadow: 0 0 10px rgba(0, 0, 0, 0.7)";
        }})
    }
    else if (target.className == 'pause') {
        let timerNum = target.getAttribute('data-number');
        timers.forEach(element=>{if(element.number==timerNum){
            element.isPaused = true;
            target.parentNode.querySelector('.play').style += "background-color: #ddd";
            target.parentNode.querySelector('.play').style += "box-shadow: 0 0 10px rgba(0, 0, 0, 0.7)";
            target.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
            target.style.boxShadow = "0 0 10px orange";
        }})
    }
    else if (target.className == 'stop') {
        isSaved = false;
        saveIt.removeAttribute('data-checked');
        let timerNum = target.getAttribute('data-number');
        content.removeChild(content.querySelector(`.timer-box[data-number='${timerNum}']`));
        timers.forEach(element=>{
            if(element.number == timerNum)
            {
                element.isFinish = true;
                timers2.forEach(x=>{
                    if (element.name == x.name) {
                        x.isBroke = true;
                    }
                })
            }
        })
    }
}

function loop() {
    timers.forEach(element=>{
        if (element.isPaused==true && !element.isFinish) {
            element.targetDate.setSeconds(element.targetDate.getSeconds()+1);
        }
        else if (element.isPaused==false && !element.isFinish) {
            //let sure = (element.targetDate.getTime() - new Date().getTime())/1000;
            element.totalSeconds = element.totalSeconds - 1;
            let sure = element.totalSeconds;
            if (sure>=0) {
                let hours = Math.floor(sure/(60*60));
                let minutes = Math.floor(sure/60)%60;
                let seconds = Math.floor(sure%60);
                let targetTimer = document.querySelector(`.timer-box[data-number="${element.number}"]`);
                targetTimer.querySelector('.hour').innerHTML = double(hours);
                targetTimer.querySelector('.minute').innerHTML = double(minutes);
                targetTimer.querySelector('.second').innerHTML = double(seconds);
            }
            else {
                let finishedTimer = content.querySelector(`.timer-box[data-number='${element.number}']`);
                finishedTimer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                finishedTimer.style.color = 'white';
                element.isFinish = true;
            }
        }
    })
}

function resetBoxes() {
    currentName.value = '';
    currentHour.value = 0;
    currentMinute.value = 0;
    currentSecond.value = 0;
    defColorTo.checked = true;
    currentColor = defColor.getAttribute('data-color');
    pauseCf.style += "background-color: #ddd";
    pauseCf.style += "box-shadow: 0 0 10px rgba(0, 0, 0, 0.7)";
    isPausedStart = false;
}

function resetAll() {
    currentName.value = '';
    currentHour.value = 0;
    currentMinute.value = 0;
    currentSecond.value = 0;
    defColorTo.checked = true;
    currentColor = defColor.getAttribute('data-color');
    pauseCf.style += "background-color: #ddd";
    pauseCf.style += "box-shadow: 0 0 10px rgba(0, 0, 0, 0.7)";
    isPausedStart = false;
    timers = [];
    timers2 = [];
    isSaved = false;
    saveIt.removeAttribute('data-checked');
    content.textContent = "";
    timerNumber = 1;
}
function saveStatus() {
    let sayac = 1;
    if(!isSaved && confirm('Bu görünüm programınız olarak kaydedilecek.')) {
        let num = localStorage.length
        for(i = 1; i < num+1; i++) {
            localStorage.removeItem(`timer${i}`)
        }
        timers2.forEach(element => {
            try {
                if (!element.isBroke) {
                    let cTimer = [
                        element.name,
                        element.color,
                        element.hour,
                        element.minute,
                        element.second
                    ]
                    localStorage.setItem(`timer${sayac}`, cTimer);
                    sayac++;
                }
            }
            catch(e) {
            }
        })
        isSaved = true;
        saveIt.setAttribute('data-checked', '');
    }
}
function getSaved() {
    if(confirm('Programınız getirilecek (Devam edilirse ekrandaki düzen sıfırlanır).')) {
        resetAll()
        let sNum = localStorage.length
        for (let k = 1; k < sNum+1; k++) {
            let currentTimerInfo = localStorage.getItem(`timer${k}`);
            let currentTimer = currentTimerInfo.split(',');
            currentTimer[2] = currentTimer[2] == '' ? 0:parseInt(currentTimer[2]);
            currentTimer[3] = currentTimer[3] == '' ? 0:parseInt(currentTimer[3]);
            currentTimer[4] = currentTimer[4] == '' ? 0:parseInt(currentTimer[4]);
            let html = `
                <div data-number="${timerNumber}" class="timer-box">
                    <div title="${currentTimer[0]}" class="name">
                        ${currentTimer[0].length<27?currentTimer[0]:currentTimer[0].substring(0,27)+"..."}
                    </div>
                    <div data-number="${timerNumber}" class="time">
                        <span class="hour">${double(currentTimer[2])}</span>.<span class="minute">${double(currentTimer[3])}</span>.<span class="second">${double(currentTimer[4])}</span>
                    </div>
                    <div class="buttons">
                        <button title="Bitir" data-number="${timerNumber}" class="stop">🗑️</button>
                        <button title="Durdur" data-number="${timerNumber}" class="pause">⏸️</button>
                        <button title="Devam" data-number="${timerNumber}" class="play">▶</button>
                    </div>
                </div>
        `
            let hour = parseInt(currentTimer[2]);
            let minute = parseInt(currentTimer[3]);
            let second = parseInt(currentTimer[4]);
            let totalSeconds = hour*60*60 + minute*60 + second;
            let targetDate = new Date();
            targetDate.setHours(new Date().getHours()+hour);
            targetDate.setMinutes(new Date().getMinutes()+minute);
            targetDate.setSeconds(new Date().getSeconds()+second);
            isPausedStart = true
            timers.push({
                name : currentTimer[0],
                targetDate : targetDate,
                isPaused : isPausedStart,
                number : timerNumber,
                isFinish : false,
                totalSeconds : totalSeconds
            })
            timers2.push({
                name : currentTimer[0],
                hour : hour,
                minute : minute,
                second : second,
                color : currentTimer[1],
                isBroke : false
            })
            content.innerHTML += html;
            content.querySelector(`.timer-box[data-number="${timerNumber}"]`).style.backgroundColor = currentTimer[1];
            if (isPausedStart) {
                content.querySelector(`.pause[data-number="${timerNumber}"]`).style.backgroundColor = "rgba(255, 255, 0, 0.3)";
                content.querySelector(`.pause[data-number="${timerNumber}"]`).style.boxShadow = "0 0 10px orange";
            }
            else if (!isPausedStart) {
                content.querySelector(`.play[data-number="${timerNumber}"]`).style.backgroundColor = "rgba(0, 255, 0, 0.3)";
                content.querySelector(`.play[data-number="${timerNumber}"]`).style.boxShadow = "0 0 10px lime";
            }
            timerNumber += 1;
            resetBoxes();
        }
        isPausedStart = false;
        isSaved = true;
    }
}

