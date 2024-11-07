import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [bingoMax, setBingoMax] = useState(30);//the highest number that can be called
  const [bingoLetters] = useState(["B", "I", "N", "G", "O"]);
  const [bingoCall, setBingoCall] = useState("");//current call
  const [bingoHistory, setBingoHistory] = useState([]);//array of past calls for current session
  const [isDone, setIsDone] = useState(true);//if user stops current session
  const [showHistory, setShowHistory] = useState(false);//shows list of past calls for current session
  const [customBingo, setCustomBingo] = useState(true);//used to switch between custom bingo and standard
  const [possCombos] = useState([                   //This is for standard bingo
    "B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14","B15",
    "I16","I17","I18","I19","I20","I21","I22","I23","I24","I25","I26","I27","I28","I29","I30",
    "N31","N32","N33","N34","N35","N36","N37","N38","N39","N40","N41","N42","N43","N44","N45",
    "G46","G47","G48","G49","G50","G51","G52","G53","G54","G55","G56","G57","G58","G59","G60",
    "O61","O62","O63","O64","O65","O66","O67","O68","O69","O70","O71","O72","O73","O74","O75"
  ]);
  const [inManualMode, setInManualMode] = useState(false);//user manually pulls calls
  const [isPaused, setIsPaused] = useState(false);//game is paused
  const [chosenTime, setChosenTime] = useState(5);//time between each call when in auto mode(used as const)
  const [time, setTime] = useState(chosenTime);//time used in timer to display

  let bingoHistorySet = new Set(possCombos);
  let thisi = 0;
  if(thisi = 0){console.log(bingoHistorySet);
     thisi++;}
  
  useEffect(() => {
    if(!customBingo) setBingoMax(75);//if user changes to standard, set max number to 75
    else setBingoMax(30);//otherwise set max to 30

    if (isDone || inManualMode) {//if user clicks stop or change to manual mode
      setBingoHistory([]);       //clear the history array
      setBingoCall("");          //clear the current call
      setTime(chosenTime);       //reset the time to whatever the input says
      bingoHistorySet.clear();
      bingoHistorySet = new Set(possCombos);
      return;
    }
    const intervalId = setInterval(() => {   //timer
      if(!isPaused && !isDone && !inManualMode){  //while not paused, stopped or switched to manual mode 
        setTime((prevTime) => {                   //keep counting down until time is less than 1 second
          if(prevTime <= 1) {                     //then get a new call
            getNewBingoCall();
            return chosenTime;
          }
          return prevTime - 1;
        });
      }
        
      
    }, 1000);

    return () => clearInterval(intervalId);       //stop timer instance
  }, [isDone, inManualMode, isPaused, chosenTime, customBingo]);

useEffect(() => {

}, [customBingo])

  const handleChosenTimeChange = (e) => { //set timer seconds 
    setChosenTime(e.target.value);
  }

  const handleModeChange = (e) => { //switch between custom bingo and standard
    setCustomBingo(e.target.checked);
  }
  const handleManualChange = (e) =>{//switch between manual and auto
    setInManualMode(e.target.checked);
    //setIsDone(e.target.checked);//Stop the auto timer when switching to manual mode
  }
  const changeMax = (e) => { //change max call number
    setBingoMax(e.target.value);
    //console.log(e.target.value);
  }

  const handleStopStartClick = () => {  //stops current session
    setIsDone((prevIsDone) => !prevIsDone);
    //setBingoHistory([]);
    //setBingoCall("");
    setShowHistory(false);
  }

  function getNewBingoCall(){ 
    if (bingoMax <= 0) return;

    const randB = Math.floor(Math.random() * bingoLetters.length);
    const letter = bingoLetters[randB];
    let call;

    if(customBingo){
      const randy = Math.floor(Math.random() * bingoMax) + 1;      
      call = `${letter}${randy}`;

      if (!bingoHistory.includes(call)) {
        setBingoCall(call);
        setBingoHistory((prevHistory) => [...prevHistory, call]);
      } else if (bingoHistory.length < bingoMax * bingoLetters.length) {
        //console.log("Copy"); 
        getNewBingoCall(); // Retry if call is already in history
      } else {
        setIsDone(true); // Stop if all combinations are exhausted
      }

    }else{
      let randy;
      //console.log("75-ball, Letter: " + letter);
      switch(letter){
        case "B": randy = Math.floor(Math.random() * 15) + 1;
          break;
        case "I": randy = Math.floor(Math.random() * 15) + 16;
          break;
        case "N": randy = Math.floor(Math.random() * 15) + 31;
          break;
        case "G": randy = Math.floor(Math.random() * 15) + 46;
          break;
        case "O": randy = Math.floor(Math.random() * 15) + 61;
          break;
      }
      call = `${letter}${randy}`;
      if(bingoHistorySet.has(call)){
        //console.log(call + " is not in the call history\n" + bingoHistory);
        setBingoCall(call);
        setBingoHistory((prevHistory) => [...prevHistory, call]);
        bingoHistorySet.delete(call);
        //console.log("Deleted: ", call);
      }else if(bingoHistorySet.size >= 1){
        //console.log(call + " was not in the set. Getting a new call");
        getNewBingoCall();
      }else{
        //console.log("We went through the whole list");
        setIsDone(true);
      }
    }
    
  }
  return (
    <div className='home'>
      <section className='settings'>
        <div className='mode_section'>
          <div>
            <p>{inManualMode ? "Manual Mode": "Auto Mode"}</p>
            <label className="switch">
              <input type="checkbox" onChange={handleManualChange} />
              <span className="slider round"></span>
            </label>
          </div>
          <div>
            <p>{customBingo ? "Custom Bingo": "75-Ball Bingo"} </p>
            <label className="switch">
              <input type="checkbox" checked={customBingo ? true : false} onChange={handleModeChange} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
              
        <div className='time_range_section'>
          <label htmlFor='time_range'>Call Time: {chosenTime} seconds</label>
          <input type='range' className="range_input" id="time_range" value={chosenTime} onChange={handleChosenTimeChange} min="1" max="10"/>
        </div>
      </section>
      
    
      <div className='header'>
        {
          customBingo ? (
            <div>
              <label htmlFor="max_input">Enter Max Number </label>
              <input name='max_input' className="max_input" placeholder='Max Number' onChange={changeMax} value={bingoMax} type="number"/>
            </div>):(<></>)
        }
      </div>
      <div className='main_section'>
        <div className='call_controls'>
        {
          isDone ? (<></>):(
            
          <div className='call_section'>
            
            {inManualMode ? 
              (<button className="btn" onClick={()=>{getNewBingoCall()}}>New</button>):
              
              (<div className='timer_section'><p>Call in: {time} seconds</p><button className="btn" onClick={() => setIsPaused((prevPaused) => !prevPaused)}>{isPaused ? "Resume": "Pause"}</button></div>)
            }
          </div>)
        }
        <button className="btn start_btn" onClick={()=>{handleStopStartClick()}}>{isDone ? "Start": "Stop"}</button>
        </div>
        <div className='call'>
          {bingoCall}
        </div>
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
