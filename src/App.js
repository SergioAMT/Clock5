import './App.css';
import { useState } from 'react';
import Length from './components/length';

function App() {

  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setsessionTime] = useState(25 * 60);
  const [timeOn, settimeOn] = useState(false);
  const [onBreak, setonBreak] = useState(false);
  const [breakAudio] = useState(new Audio("./beep.mp3"));
  
  const playBreakSound = () => {
    breakAudio.currentTime = 0
    breakAudio.play()
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? '0' + minutes : minutes) + 
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    )
  }


  const changeTime = (amount, type) => {
    if(type === 'break') {
      if(breakTime <= 60 && amount < 0){
        return
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if(sessionTime <= 60 && amount < 0){
        return
      }
      setsessionTime((prev) => prev + amount)
      if(!timeOn){
        setDisplayTime(sessionTime + amount)
      }
    }
  }


  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second
    let onBreakVariable = onBreak;
    if(!timeOn){
      let interval = setInterval(() => {
        date = new Date().getTime();
        if(date > nextDate){
          setDisplayTime(prev => {
              if(prev <= 0 && !onBreakVariable){
                playBreakSound();
                onBreakVariable = true
                setonBreak(true)
                return breakTime
              } else if (prev <= 0 && onBreakVariable){
                playBreakSound();
                onBreakVariable = false
                setonBreak(false)
                return sessionTime
              }
            return prev - 1 ;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear()
      localStorage.setItem('interval-id', interval)
    }
    if(timeOn){
      clearInterval(localStorage.getItem('interval-id'))
    }
    settimeOn(!timeOn)
  }


  const resetTime = () => {
    setDisplayTime(25*60)
    setBreakTime(5*60)
    setsessionTime(25*60)
  }

  return (
    <div className='center-align'>
    <h1>Pomodoro Clock</h1>
          <div className='dual-container'>
              <Length 
                title={'break length'}
                changeTime={changeTime}
                type={'break'}
                time={breakTime}
                formatTime={formatTime}
              ></Length>

              <Length 
                title={'session length'}
                changeTime={changeTime}
                type={'session'}
                time={sessionTime}
                formatTime={formatTime}
              ></Length>
            </div>

      <h3>{onBreak ? 'break' : 'session'}</h3>
      <h1>{formatTime(displayTime)}</h1>
      <button className='btn-large deep-purple lighten-2'
      onClick={controlTime}>
        {timeOn ?
        <i className='material-icons'>pause_circle_filled</i>
        :<i className='material-icons'>play_circle_filled</i>}
      </button>
      <button className='btn-large deep-purple lighten-2'
      onClick={resetTime}>
        <i className='material-icons'>autorenew</i>
      </button>
    </div>
  );
}

export default App;
