// signals 

const startworking = new Audio(
    "startworking.mp3"
)

const shortbreak = new Audio(
    "shortbreak.mp3"
)

const longbreak = new Audio(
    "longbreak.mp3"
)

const end = new Audio(
    "endofcycle.mp3"
)

let state = {
    current: 0,
    seconds: [1500, 300, 900],
    names: ['pomodoro', 'short break', 'long break'],
    pomodoroCount: 0,
    pause: false,
    start: false
}

let settings = {
    pomodoroSettingsBtn: document.querySelector('.pomodoro__settings--link'),
    box: document.querySelector('.settings'),
    closeBtn: document.querySelector('.settings__close--link'),
    applyBtn: document.querySelector('.settings__apply--btn'),
    pomodoroChoice: document.querySelector('#pomodoro__time'),
    shortBreakChoice: document.querySelector('#short__break'),
    longBreakChoice: document.querySelector('#long__break')
}

const typicalPomodoro = {
    pomodoro: 1500,
    shortBreak: 300,
    longBreak: 900,
}

document.addEventListener('keydown', (e)=> {
    if (e.key === 'q') {
        state.seconds = [5,2,4]; 
        typicalPomodoro.pomodoro = 5; 
        typicalPomodoro.shortBreak = 2; 
        typicalPomodoro.longBreak = 4; 
    }
})

settings.pomodoroSettingsBtn.addEventListener('click', () => {
    settings.box.classList.remove('off');
})

settings.closeBtn.addEventListener('click', () => {
    settings.box.classList.add('off');
})

const display = {
    pomodoroTimeLabel: document.querySelector('#pomodoro__label'),
    shortBreakTimeLabel : document.querySelector('#short__label'),
    longBreakTime : document.querySelector('#long__label'),
    current : document.getElementsByName('current'), 
    countdownRing : document.querySelector('#ring'),
    readoutTime : document.querySelector('.countdown__time'),
    pause : document.querySelector('#pause'),
    pauseLabel : document.querySelector('#pause__label'),
    playBtn: document.querySelector('.pomodoro__play--link'),
    stopBtn: document.querySelector('.pomodoro__stop--btn')
}

display.pause.addEventListener('change', () => {
    if(display.pause.checked){
        state.pause = true;
        display.pauseLabel.textContent = 'continue'; 
    } else {
        state.pause = false;
        display.pauseLabel.textContent = 'pause'
    }
})

display.current.forEach(el => {
    el.addEventListener('click', (e)=> {
        e.preventDefault()
    })
});

function secondsToString(time) {
    let minutes = Math.floor(time / 60);
    let seconds = (time - (minutes*60)).toFixed(0);
    if(seconds < 10) seconds = `0${seconds}`;
    return `${minutes}:${seconds}`
}

function getSettings() {
    return {
        seconds: [settings.pomodoroChoice.value *60, settings.shortBreakChoice.value *60, settings.longBreakChoice.value*60]
    }
}

function updateSettings(choice) {
    for (const property in choice) {
        if (property in state) {
            state[property] = choice[property]; 
        }
    };
    typicalPomodoro.pomodoro = choice.seconds[0]; 
    typicalPomodoro.shortBreak = choice.seconds[1]; 
    typicalPomodoro.longBreak = choice.seconds[2]; 
}

settings.applyBtn.addEventListener('click', () => {

    const newSettings = getSettings();

    updateSettings(newSettings);

    updateDisplay(state);

    settings.box.classList.add('off');

})


function updateDisplay(state) {
    for (let i=0; i<3; i++) {
        display.current[i].checked = false;
    }
    display.current[state.current].checked = true;

    display.readoutTime.textContent = secondsToString(state.seconds[state.current]);

    const og = Object.values(typicalPomodoro)[state.current];
    const cur = state.seconds[state.current];
    display.countdownRing.style.strokeDashoffset = 250 - ((cur/og)*250);

    document.title = `${state.names[state.current]} : ${secondsToString(state.seconds[state.current])}`
}

display.playBtn.addEventListener('click', () => {
    display.playBtn.classList.add("disabled");
    
    state.start = true;

    const counter = setInterval(() => {
        const og = Object.values(typicalPomodoro);

        updateDisplay(state);
    
        if (state.start) {

            if(!state.pause) {
                switch (true) {
                    case state.seconds[state.current] > 0 : 
                        state.seconds[state.current] -- ;
                        break; 
                    case state.seconds[state.current] === 0 && state.current === 0 && state.pomodoroCount < 3 :
                        shortbreak.play();
                        state.pomodoroCount ++;
                        state.current = 1; 
                        state.seconds = og;
                      
                        break;
                    case state.seconds[state.current] === 0 && state.current === 1 : 
                        state.current = 0; 
                        state.seconds = og;
                        startworking.play();
                        
                        break; 
                    case state.seconds[state.current] === 0 && state.current === 0 && state.pomodoroCount === 3 : 
                        state.current = 2; 
                        state.seconds = og;
                        longbreak.play();
                        
                        break; 
                    case state.seconds[state.current] === 0 && state.current === 2 :
                        state.pomodoroCount = 0;
                        state.seconds = og; 
                        state.current = 0; 
                        state.seconds[state.current];
    
                        clearInterval(counter)
                        end.play();
                        display.playBtn.classList.remove("disabled");
                        document.title = `End of cycle`;
                        break;  
                         
                }
            }
            
    
        } else {
            clearInterval(counter)
        }
    
    
    }, 1000);
    
    
})

display.stopBtn.addEventListener('click', () => {
    state.start = false;
    display.playBtn.classList.remove('disabled');
    state.pomodoroCount = 0;
    state.current = 0;
    state.seconds[state.current] = Object.values(typicalPomodoro)[state.current];
    display.readoutTime.textContent = secondsToString(state.seconds[state.current]);
})
