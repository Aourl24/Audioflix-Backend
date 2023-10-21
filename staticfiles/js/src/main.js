//import logo from './logo.svg';
// import React from 'react';
// import music from './music.mp3';
// import asake from './asake.mp3';
// import './css/bootstrap5/css/bootstrap.min.css';
// import './css/fontawesome_5/css/all.min.css';
// import './css/acss/acss.css';
// import './App.css';
// //import './css/acss/acss_dark.css';
// import avatar from './avatar.jpeg';
// import wife from './wifeMaterial.mp3';
// import newmusic from './newmusic.jpg';
// import axios from 'axios';

const PlayerContext = React.createContext();

function PlayerContextProvider({children}){

let audioRefs = React.useRef([])
let currentAudioRef = React.useRef()
let [currentTrack, setCurrentTrack] = React.useState(null);
let [isPlaying,setIsPlaying] = React.useState(false);
let [audioDuration,setAudioDuration] = React.useState()
let [currentTime,setCurrentTime] = React.useState()
let [playingSign,setPlayingSign] = React.useState(false)

const readableAudioDuration = (x) =>{
var minutes = Math.floor(x.duration /60)
var seconds = Math.floor(x.duration %60)
return(`${minutes}:${seconds < 10 ? '0':''}${seconds}`)
}

const readableAudioCurrentTime = (x)=>{
var minutes = Math.floor(x.currentTime /60)
var seconds = Math.floor(x.currentTime %60)
return(`${minutes}:${seconds < 10 ? '0':''}${seconds}`)
}

const nextPlay =(x)=>{
var audio = document.getElementById('audio' + x.id)
audio.play()
audio.currentTime = audio.duration
}

const letPlay=(x,loop=false)=>{
    
    //let audio = audioRefs.current[x.id]
    var audio = document.getElementById('audio' + x.id)
    var audios = document.querySelectorAll('audio')
    if (audio == null){
      
    }
    
    let check = audio.paused
    
    if (check){
          audios.forEach((x)=>{x.pause();})
          audio.play()
          setPlayingSign(true)
    }
    else if(loop){
        audio.play()
        setPlayingSign(true)
    }
    else{
      audio.pause()
      setPlayingSign(false)
    }

    //check ? audio.play() : audio.pause()
    setIsPlaying(x)
    audio.addEventListener('timeupdate',()=>setCurrentTime(readableAudioCurrentTime(audio)))
  
    setAudioDuration(readableAudioDuration(audio))
   /* if (currentAudioRef.previous){
    let prev = currentAudioRef.previous[x.id]
    prev.pause()}
    console.log(x)
    //console.log(x)
    /*let audio = document.getElementById(x.id);
    console.log(x)
    ;
    console.log('tel ' + isPlaying)
*/
  }


return(
      <PlayerContext.Provider value = {{currentTrack, setCurrentTrack, isPlaying , setIsPlaying, letPlay, audioRefs, audioDuration,setAudioDuration,currentTime,setCurrentTime, nextPlay,playingSign,setPlayingSign}} >
        {children}
      </PlayerContext.Provider>
  )
}


function usePlayer(){
  return React.useContext(PlayerContext)
}


function SearchBar(props){
  let searchBar = React.useRef()
  const showSearchBar=()=>{
    searchBar.current.classList.toggle('display-sm-none' )
  }
  return(
      <form action="">
              <i onClick={()=>showSearchBar()} class='fas fa-search display-md-none color-p'></i >
        <div ref={searchBar} class='display-sm-none position-absolute color-bg-s  shadow p-2 col-md-2' style={{left:'0',right:'0',zIndex:'10000'}}>
        <br /> 
        <input  type='search' class="form-control sz-16 color-black color-p " placeholder="search music" />
        <br />
        </div>

      </form>
  )
}

const PlaySign = ()=> <i class="fas fa-play"></i>
const PauseSign = ()=> <i class="fas fa-pause"></i>


function PlayerFullBox(props){
let {currentTrack, setCurrentTrack, isPlaying , setIsPlaying, letPlay, audioRefs, currentAudioRef,audioDuration,setAudioDuration,currentTime,setCurrentTime, nextPlay, playingSign, setPlayingSign} = usePlayer()
let [audioPercent,setAudioPercent] = React.useState('0%')
let [playSign,setPlaySign] = React.useState(true)

const toSeconds = (x) =>{
  var g = x.split(':')
  var minutes = +g[0] *60
  var seconds = +g[1]
  var time = minutes + seconds
  return time
}



React.useEffect(()=>{
  var t = audioDuration ? toSeconds(audioDuration) : ''
  var c = currentTime ? toSeconds(currentTime) : ''
  var percent = (c/t) * 100
  setAudioPercent(`${percent}%`)
},[currentTime])

React.useEffect(()=>{
  setPlaySign(false)
},[playingSign])
return(
<div class="container-fluid bg-light position-fixed h-100 p-3 w-100" style={{top:'0',backgrund:`url(${props.items.coverPhoto})`,objectPosition:'',repeat:'no-repeat',lef:'0',right:'0',zIndex:'1000000'}}>
<br />
   <div class="row"> <div class="col-12 center"><img src={props.items.cover_photo} class="img-fluid rounded" style={{width:'350px',height:'350px',objectFit:'cover'}}/> </div></div>
   <br />
  <div class="row my-2"><div class="col-12 sz-20 bold color-p"> {props.items.title}</div>
   <div class="col color-grey sz-14"> {props.items.artist} </div>
   </div>
   
   <audio ref={currentAudioRef} ><source src={props.items.file} /></audio>
    <div class="row ">
    <div class="col-12 p-2"><div class="color-bg-grey rounded w-100" style={{height:'3px',backgroundColor:'grey'}} ></div><div class="contair color-bg-p rounded position-relative" style={{height:'3px',marginTop:'-3px',width:audioPercent,backgroundClor:'white'}} ></div> </div>
    </div>
   <div class="row">
    <div class="col sz-12 color-grey" style={{textAlign:'left'}}>{currentTime} </div>
    <div class="col sz-12 color-grey" style={{textAlign:'right'}}>{audioDuration}</div>
    </div>
    <br />
    <div class="row justify-content-center align-items-center center">
    <div class="col-3"><button class="btn btn-link no-decoration color-grey  sz-18" onClick={()=>props.toggleFullScren()}> <i class="fas fa-compress"></i> </button></div>
   <div class="col-3"><button onClick={()=>letPlay(props.items)} class="btn btn-link no-decoration sz-24 color-p" style={{ackgroundColor:'white',colr:'white',widh:'50px',heiht:'50px'}}> {playingSign ? <PauseSign />:<PlaySign />} </button> </div>
   <div class="col-3"><button class="btn no-decoration color-grey sz-18 color-white" onClick={()=>nextPlay(props.items)}><i class="fas fa-step-forward color-grey"></i></button></div>
   </div>
   <div class='row my-3'>
   <div class='col  center'>
   <a href={props.items.file} download class='no-decoration color-white rounded color-bg-p p-2 sz-14'>Download this Music </a>
   </div>
   </div>
   
</div>

)
}

function PlayerSmallBox(props){
let {currentTrack, setCurrentTrack, isPlaying , setIsPlaying, letPlay, audioRefs, currentAudioRef, nextPlay, playingSign,setPlayingSign} = usePlayer()
return(
  <div id="fixed-bottom" class="fixed-bottom container-fluid p-2" style={{bottom:'60px',overflow:'hidden'}}>
    <div class="row align-items-center rounded bg-lig color-bg-p p-2 m-1 sh dow color-white">
          <div class="col-md-1 col-3"><img src={props.items.cover_photo} class="img-fluid rounded" style={{width:'50px',height:'50px',objectFit:'cover'}}/> </div>
          <div class="col bold btn-link no-decoration" onClick={props.onClick} >
          <div class="row"><div class="col-12 sz-14">{props.items.title} </div>
          <div class="col-12 color-silver sz-12">{props.items.artist} </div>
          </div>
          </div>

          <div class="col-2 col-md-1"><button onClick={()=>letPlay(props.items)} class="btn btn-link no-decoration color-dark-white sz-md-24 color-white"> {playingSign ? <PauseSign />:<PlaySign />} </button> </div>
          <div class="col-2 display-sm-none col-md-1"><button class="btn no-decoration color-dark-white color-white" onClick={()=>nextPlay(props.items)}><i class="fas fa-step-forward"></i></button></div>
          <div class="col-2 col-md-1"><button class="btn no-decoration color-dark-white color-white" onClick={()=>props.toggleFullScren()}> <i class="fas fa-expand"></i> </button> </div>
          
        <div class="row">
          <div class="col"><audio ref={currentAudioRef} ><source src={props.items.file} /></audio> </div>
        </div>
    </div>
  </div>
)
}

function Player(props){
let playerItems = props.Items
let [fullscreen,setFullScreen] = React.useState(false) 
let {playingSign,setPlayinSign} = usePlayer()
let player = React.useRef()

const changeMode = () => {
setFullScreen(fullscreen ? false : true);
let removeFixed = document.getElementById('fixed-bottom')
//removeFixed.classList.toggle('fixed-bottom')
}

React.useEffect(()=>{
if(playingSign){
  player.current.classList.remove('hide')
}
},[playingSign])

return(
    <div class="hide" ref={player}>
        {fullscreen ? <PlayerFullBox items={props.Items} toggleFullScren={()=>changeMode()} /> : <PlayerSmallBox items={props.Items} toggleFullScren={()=>changeMode()}/> }
    </div>
)

}


function SideBar(props){
  let navItems = [{name:'Home',url:''},{name:'Discover',url:''},{name:'Radio',url:''},{name:'Artist',url:''},{name:'Library',url:''}]

  if (props.items){
    let navItems = props.items
  }
  
  return(
        <div class='container'>
        {navItems.map((x)=>
          <div class='row m-2'>
          <div class='col p-2 sz-20'>
            <a class="no-decoration color-dark-white" href={x.url}> {x.name} </a>
          </div>
          </div>
        )}
        </div>
    )
}


function OptionBar(props){
  return(
    <div id={`${props.items.id}optionbar`} class='alert col-4  position-absolute bg-light rounded p-2 hide' style={{lft:'0',right:'0'}}>
      <a href={props.items.url} class='color-p no-decoration sz-12' download>Download </a>
    </div>
    )
}


function MusicBox(props){
  let dummy = [{title:'Yoga',artist:'Asake',size:'3.40mb',file:'',cover_photo:'',id:1},{title:'Pallazo',artist:'Asake',size:'3.40mb',file:'',cover_photo:'',id:2}]
  //let dummy = {title:'',artist:'',url:'',coverPhoto:''}
  let musicList =props.items ? props.items : dummy 
  //let [nowPlaying,setNowPlaying]= React.useState(dummy) 
  let {currentTrack, setCurrentTrack, isPlaying , setIsPlaying, letPlay, audioRefs} = usePlayer()
  
  const showOptionBar = (x) =>{
    let obj = document.getElementById(`${x}optionbar`);
    obj.classList.toggle('hide')
  }
  
  let addToHistory = async (x)=>{
    let request = await axios.get(`addtohistory/${x}`)
  }

  React.useEffect(()=>{
    var audios = document.querySelectorAll('audio');
    audios.forEach((audio)=>{
        var getIndex = audio.getAttribute('index');
        var index = +getIndex
        var nextSong = musicList[index+1];
        if (nextSong == null){
          nextSong = musicList[0]
        }
        audio.addEventListener('play',()=>{document.querySelector(`.${audio.id}`).classList.add('show')});
        audio.addEventListener('pause',()=>{document.querySelector(`.${audio.id}`).classList.remove('show')});
        audio.addEventListener('ended',()=>{letPlay(nextSong,true)});
          //letPlay(musicList[index+1])
        })
    }
    ,[musicList.length])

  return(
    <div class="">
    <div class="row sz-16 color-p p-2">
    <div class='px-0 no-border'>
     <div class="col sz-18 p-2 bold "> {props.title ? props.title: ''}</div>
    {props.coverArt ? <img class='card-img-top img-fluid cover ' src={props.coverArt } alt='myImage' style={{height:'200px'}} /> :''} 
    
    </div>
    </div>
      <div class='row m-1'>
          {
            musicList.map((x,e)=>{
              return(
                    <div class="col-sm col-md-12 rounded borde p-2 my-2 m-md-1" key={x.id}>
                      <div class="row align-items-center">
                        <div class="col-3">
                        <img src={x.cover_photo} class="img-fluid rounded" style={{width:'50px',height:'50px',objectFit:'cover'}}/> 
                        </div>
                        
                        <div class="col  no-decoration" onClick={()=>letPlay(x)} >
                        <div class="row"> 
                        <div class="col-12 sz-12 bold">{x.title} </div>
                        <div class="col-12 sz-12 color-grey" style={{color:'#d7'}}>{x.artist} </div>
                        </div>
                        </div>
                        <div class={`col hide audio${x.id}`} id={'spinner'+ x.id }><div class="spinner-grow sz-12"></div></div>
                        <div class="col"><audio index={e} id={"audio"+x.id} onPlay={()=>addToHistory(x.id)}><source src={x.file} type="audio/mpeg" /></audio> </div>
                        <div class="col-2"><i class="fas fa-ellipsis-v passive color-grey " onClick={()=>showOptionBar(x.id)} ></i>
                        <OptionBar items ={x}/>
                        </div>
                    </div>
                    </div>
                )
            })
          }
          <Player Items={isPlaying} onClick={letPlay} /> 
    </div>
    </div>
  )
}

function PlayList(props){

if(props.items.length==0){
  return null;
}
  return(
      <div>
          <div class="border card p-2 col-md-4 col-sm">
                <img src={props.items.cover_photo} class="img-fluid cover" style={{height:'150px',objectFit:'cover'}} />
                <div class="row mt-2">
                  <div class="col card-title sz-14">{props.items.name}</div>
                </div>
           </div>
      </div>
    )
}


// function HomePage(){
//   let user = "Awwal"
//   return(
//       <div>
//         <h3>Welcome {user} </h3>

//         <div> Your Like Songs </div>

//       </div>
//     )
// }


// function Explore() {
  
//   //let [nowPlaying, setNowPlaying] = React.useState(null)
//   //let [musicList, setMusicList] = React.useState(dummy)

// var myMusic = [{title:'Yoga',album:'',artist:'Asake',size:'3.40mb',file:asake,cover_photo:avatar,id:5},{title:'Pallazo',artist:'Asake',size:'3.40mb',file:music,cover_photo:avatar,id:6},{title:'Wife Material',artist:'Asake',size:'3.40mb',file:wife,cover_photo:avatar,id:7}]

// var [musics,setMusic] = React.useState([{title:'',artist:'',size:'',url:'',coverPhoto:'',id:''}])
// const options = {
//   method: 'GET',
//   url: 'https://spotify23.p.rapidapi.com/tracks/',
//   params: {
//     ids: '4WNcduiCmDNfmTEz7JvmLv'
//   },
//   headers: {
//     'X-RapidAPI-Key': 'b1539cf82fmsh9cecf507142d6a1p18f910jsn37b5e7b8bbd1',
//     'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
//   }
// };
// const fetchData = async () => {
//   try {
//     const response = await axios.get('http://127.0.0.1:8000/musicapi?format=json');
//     console.log(response.data)
//     setMusic(response.data);
//     // Rest of your code...
//   } catch (error) {
//     console.log('error occured')
//     // Handle the error here
//   }
// };

// React.useEffect(() => {
//     fetchData();
//   }, []); // The empty array [] ensures this effect runs only once when the component mounts

 
//   return (
//     <PlayerContextProvider>
//     <div className="container-fluid font-apple color-bg-s">
//       <header className="navbar sz-16 p-1 color-p stcky-top color-bg-s postion-relative " style={{backgrondColor:'#C0C0C0',left:'0',rigt:'0'}}>
//               <div class="navbar-brand bold color-p sz-16 font-great"><i class='fas fa-music'></i> AudioFlix </div>
//               <div class="navbar-brand color-black display-md-none"> <SearchBar /></div>
//       </header> 
      
//         <div class="row">
//         <div class="col-2 display-sm-none">
//         <SearchBar />
//         <SideBar />
//         </div>
//         <div class="col">
//         <div class='g-light'>
//         <MusicBox items={musics}  background coverAt={newmusic} title="Api Music"/>
//         </div>
//         <hr />
//         <MusicBox items={myMusic} title="Trending Song"/>
//         <hr />
//         <MusicBox />
//         </div>

//         </div>
//                 <br />
//         <br />
//         <br />
//         <nav class='nav navbar fixed-bottom color-bg-t  color-white sz-12 justify-content-center'>
//         <div class='navbar-brand col-5 color-white sz-12 center'>
//         <div class='col-12'>
//         <i class='fas fa-home sz-16'></i>
//        </div>
//        <div class='col-12'>
//         Home
//         </div>
//         </div>
//         <div class='navbar-brand col-5 center color-white sz-12'> 
//         <div class='col-12'><i class='fas fa-music'></i> </div>
//        <div class='col-12'>PlayList</div>
 
//         </div> 
        
//         </nav>
//     </div>
//     </PlayerContextProvider>
//   );
// }



// function App(){
// return(
//   <div className="container-fluid font-apple color-bg-s">
// <HomePage />
// </div>)
// }

// export default App;
