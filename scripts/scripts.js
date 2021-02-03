let state = {
    current: 0,
    seconds: [1500, 300, 900],
    names: ['pomodoro', 'short break', 'long break'],
    pomodoroCount: 0,
    pause: false
}

const typicalPomodoro = {
    pomodoro: 1500,
    shortBreak: 300,
    longBreak: 900,
}

document.addEventListener('keydown', (e)=> {
    if (e.key === 'q') {
        state.seconds = [15,3,9]; 
        typicalPomodoro.pomodoro = 15; 
        typicalPomodoro.shortBreak = 3; 
        typicalPomodoro.longBreak = 9; 
    }
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
    playBtn: document.querySelector('.pomodoro__play--link')
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
    setInterval(() => {
        const og = Object.values(typicalPomodoro);
        console.log(og);
        updateDisplay(state);
    
        if (!state.pause) {
            switch (true) {
                case state.seconds[state.current] > 0 : 
                    state.seconds[state.current] -- ;
                    break; 
                case state.seconds[state.current] === 0 && state.current === 0 && state.pomodoroCount < 4 :
                    state.pomodoroCount ++;
                    state.current = 1; 
                    state.seconds = og;
                  
                    break;
                case state.seconds[state.current] === 0 && state.current === 1 : 
                    state.current = 0; 
                    state.seconds = og;
                   
                    
                    break; 
                case state.seconds[state.current] === 0 && state.current === 0 && state.pomodoroCount === 4 : 
                    state.current = 2; 
                    state.seconds = og;
                
                    
                    break; 
                case state.seconds[state.current] === 0 && state.current === 2 :
                    state.pomodoroCount = 0;
                    state.seconds = og; 
                    state.current = 0; 
           
                    
                    break;    
            }
    
        }
    
    
    }, 1000);
    display.playBtn.classList.add("disabled");
})

