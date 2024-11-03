import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [bingoMax, setBingoMax] = useState(30);
  const [bingoLetters,setBingoLetters] = useState(["B", "I", "N", "G", "O"]);
  const [bingoCall, setBingoCall] = useState("");
  const [bingoHistory, setBingoHistory] = useState([]);
  const [isDone, setIsDone] = useState(true);
  const [showHistory, setShowHistory] = useState(false);


  const [inManualMode, setInManualMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chosenTime, setChosenTime] = useState(4);
  const [time, setTime] = useState(chosenTime);

  useEffect(() => {
    if (isDone || inManualMode) {
      setBingoHistory([]);
      setBingoCall("");
      setTime(chosenTime);
      return;
    }
    const intervalId = setInterval(() => {
      if(!isPaused && !isDone && !inManualMode){
        setTime((prevTime) => {
          if(prevTime <= 1) {
            getNewBingoCall();
            return chosenTime;
          }
          return prevTime - 1;
        });
      }
        
      
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isDone, inManualMode, isPaused, chosenTime]);



  const handleChosenTimeChange = (e) => {
    setChosenTime(e.target.value);
  }

  const handleManualChange = (e) =>{
    setInManualMode(e.target.checked);
    //setIsDone(e.target.checked);//STop the auto timer when switching to manual mode
  }
  const changeMax = (e) => {
    setBingoMax(e.target.value);
    console.log(e.target.value);
  }

  const handleStopStartClick = () => {
    setIsDone((prevIsDone) => !prevIsDone);
    setShowHistory(false);
  }

  function getNewBingoCall(){
    if (bingoMax <= 0) return;
    const randy = Math.floor(Math.random() * bingoMax) + 1;
    const randB = Math.floor(Math.random() * bingoLetters.length);
    const letter = bingoLetters[randB];
    const call = `${letter}${randy}`;

    if (!bingoHistory.includes(call)) {
      setBingoCall(call);
      //setBingoHistory([...bingoHistory, call]);
      setBingoHistory((prevHistory) => [...prevHistory, call]);// replaced line above
    } else if (bingoHistory.length < bingoMax * bingoLetters.length) {
      getNewBingoCall(); // Retry if call is already in history
    } else {
      setIsDone(true); // Stop if all combinations are exhausted
    }
  }
  return (
    <div className='home'>
      <section className='settings'>
        <div className='mode_section'>
          <p>{inManualMode ? "Manual Mode": "Auto Mode"}</p>
          <label className="switch">
            <input type="checkbox" onChange={handleManualChange} />
            <span className="slider round"></span>
          </label>
        </div>
              
        <div className='time_range_section'>
          <label htmlFor='time_range'>Call Time: {chosenTime}</label>
          <input type='range'  className="range_input" id="time_range" value={chosenTime} onChange={handleChosenTimeChange} min="1" max="10"/>
        </div>
      </section>
      
    
      <div className='header'>
        <label htmlFor="max_input">Enter Max Number </label>
        <input name='max_input' className="max_input" placeholder='Max Number' onChange={changeMax} value={bingoMax} type="number"/>
      </div>
      <div className='main_section'>
        {
          isDone ? (<></>):(
          <div className='call_section'>
            {inManualMode ? 
              (<button className="btn" onClick={()=>{getNewBingoCall()}}>New</button>):
              
              (<div className='timer_section'><p>Call in: {time} seconds</p><button className="btn" onClick={() => setIsPaused((prevPaused) => !prevPaused)}>{isPaused ? "Resume": "Pause"}</button></div>)
            }
            <div className='call'>
              {bingoCall}
            </div>
          </div>)
        }
        <button className="btn start_btn" onClick={()=>{handleStopStartClick()}}>{isDone ? "Start": "Stop"}</button>
      </div>
      <div className='history_container'>
        <div className='last_two_calls_section'>
          <p className='l'>{bingoHistory[bingoHistory.length - 2] || ""}</p>
          <p className='s'>{bingoHistory[bingoHistory.length - 3] || ""}</p>
        </div>
        <div className='history_list_container'>
          <button className="btn show_history" onClick={() => setShowHistory((prevShowHistory) => !prevShowHistory)}>
            {showHistory ? "Hide": "Show"} History</button>
          {
            showHistory ? (<ul className='history_list'>
              {bingoHistory.slice().reverse().map((call, index) =>
                <li className='history_item' key={index}>{call}</li>
              )}
            </ul>): (<></>)
          }
        </div> 
      </div>
    </div>
  )
}

export default App
