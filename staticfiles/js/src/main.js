const defautPlaying = {
    "id": 0,
    "artist": "Now Playing",
    "title": "Now Playing",
    "cover_photo": "/media/20231213_182247.jpg",
    "file": "/media/spotifydown.com_-_Cornelia_Street.mp3",
    "featured_artist": [],
    "like": [
        1
    ]
}

const PlayerContext = React.createContext();

function PlayerContextProvider({children}){

let audioRefs = React.useRef([])
let currentAudioRef = React.useRef()
let [currentTrack, setCurrentTrack] = React.useState(null);
let [isPlaying,setIsPlaying] = React.useState(defautPlaying);
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
    
    var audio = document.getElementById('audio' + x.id)
    var audios = document.querySelectorAll('audio')
    
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

    setIsPlaying(x)
    audio.addEventListener('timeupdate',()=>setCurrentTime(readableAudioCurrentTime(audio)))
  
    setAudioDuration(readableAudioDuration(audio))
  }

React.useEffect(()=>{
console.log('from the context ' + isPlaying)
console.log('currentTrack ' + currentTrack)
},[isPlaying])

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


function Like(props){
let [like,setLike] = React.useState()
let [trigger,setTrigger] = React.useState(null)

React.useEffect(()=>{
let fetchData = async()=>{
let response = await axios.get(`checklike${props.id}/checklike`)
console.log(response.data.like)
setLike(response.data.like);}
fetchData()}
,[])

let likeSong = async()=>{

  let response = await axios.get(`likesong${props.id}`);
  console.log(response.data.like)
setLike(response.data.like)

}

return(
  <div>
    <i class={`fas fa-heart no-decoration ${like ? 'color-p': 'color-grey'}`} onClick={()=>likeSong()}></i>
</div>
  )
}


const PlaySign = ()=> <i class="fas fa-play-circle"></i>
const PauseSign = ()=> <i class="fas fa-pause-circle"></i>


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
<div class="container-fluid position-fixed h-100 p-3 w-100 color-bg-white" style={{top:'0',backgroud:`url(${props.items.cover_photo})`,objectPosition:'',reeat:'no-repeat',lef:'0',right:'0',zIndex:'1000000',filter:'blur(0.1)'}}>

<div class="row mb-3">
<div class="col-1">
    <button class="btn btn-link no-decoration color-black  sz-18" onClick={()=>props.toggleFullScren()}> <i class="fas fa-caret-down"></i> </button>
  </div>
<div class=" col center sz-14" style={{textAlign:'right'}}>Playing From <br /> <span class="bold">Audio-Flix</span></div>
</div>
   <div class="row"> <div class="col-12 center py-2" style={{background:`url(${props.items.cover_photo})`,repeat:'no-repeat'}}><img src={props.items.cover_photo} class="img-fluid rounded shadow-lg" style={{width:'350px',height:'350px',objectFit:'cover'}}/> </div></div>
   <br />
  <div class="row my-2 align-items-center">
  <div class="col sz-20 bold color-p"> {props.items.title}
   <div class="color-black sz-14"> {props.items.artist} </div>
   </div>
   <div class="col-2 sz-18" style={{textAlign:'right'}}> <Like id={props.items.id}/> </div>
   </div>
  
  <br class=""/>
  <br class="display-md-none" />
  <br class="display-md-none" /> 
   <audio ref={currentAudioRef} ><source src={props.items.file} /></audio>
    <div class="row ">
    <div class="col-12 p-2"><div class="color-bg-grey rounded w-100" style={{height:'3px',backgroundColor:'silver'}} ></div><div class="contair color-bg-p rounded position-relative" style={{height:'3px',marginTop:'-3px',width:audioPercent,backgroundClor:'white',borderRigh:'px solid blue'}} ></div> </div>
    </div>
   <div class="row">
    <div class="col sz-12 color-grey" style={{textAlign:'left'}}>{currentTime} </div>
    <div class="col sz-12 color-grey" style={{textAlign:'right'}}>{audioDuration}</div>
    </div>
    
<br class="display-md-none" />
<br class="display-md-none" /> 
    <div class="row justify-content-center align-items-center center">
    
    
    <div class="col sz-18">
    <a href={props.items.file} download class='no-decoration color-p'><i class="fas fa-download"></i></a>
    </div>

   <div class="col">
   <button onClick={()=>letPlay(props.items)} class="no-decoration sz-36 color-p btn" style={{ackgroundColor:'white',colr:'white',widh:'50px',heiht:'50px',fontSize:'70px'}}> {playingSign ? <PauseSign />:<PlaySign />} </button> 
   </div>

   <div class="col">
   <button class="btn no-decoration color-grey sz-18 color-p" onClick={()=>nextPlay(props.items)}><i class="fas fa-step-forward color-black"></i></button>
   </div>
   

   </div>
   <div class='row my-3'>
   <div class='col  center'>
   <a href={props.items.file} download class='no-decoration color-white rounded color-bg-p p-2 sz-14 hide'>Download this Music </a>
   </div>
   </div>
   <div class="row hide">
      <div class="col"> Add to Playlist </div>
    </div>
   
</div>

)
}

function PlayerSmallBox(props){
let {playingSign,currentAudioRef,letPlay,nextPlay,isPlaying,setIsPlaying} = usePlayer()
return(
  <div id="fixed-bottom" class="fixed-bottom container-fluid p-0 playerBottom" style={{bottm:'60px',overflow:'hidden'}}>
    <div class="row align-items-center rounded bg-lig color-bg-p p-1 m-1 sh dow color-white">
          <div class="col-md-1 col-3"><img src={props.media.cover_photo} class="img-fluid rounded" style={{width:'50px',height:'50px',objectFit:'cover'}}/> </div>
          <div class="col btn-link no-decoration" onClick={props.onClick} >
          <div class="row"><div class="col-12 sz-14" style={{cursor:'pointer'}}>{props.media.title} </div>
          <div class="col-12 color-silver sz-12">{props.media.artist} </div>
          </div>
          </div>

          <div class="col-2 col-md-1"><button onClick={()=>letPlay(props.media)} class="btn btn-link no-decoration color-dark-white sz-m-24 color-white sz-36"> {playingSign ? <PauseSign />:<PlaySign />} </button> </div>
          <div class="col-2 display-sm-none col-md-1"><button class="btn no-decoration color-dark-white color-white" onClick={()=>nextPlay(props.media)}><i class="fas fa-step-forward"></i></button></div>
          <div class="col-2 col-md-1"><button class="btn no-decoration color-dark-white color-white" onClick={()=>props.toggleFullScren()}> <i class="fas fa-expand"></i> </button> </div>
          
        <div class="row">
          <div class="col"><audio ref={currentAudioRef} ><source src={props.media.file} /></audio> </div>
        </div>
    </div>
  </div>
)
}

function Player(props){
let [fullscreen,setFullScreen] = React.useState(false) 
let {isPlaying , setIsPlaying, playingSign,letPlay, currentTrack} = React.useContext(PlayerContext)
let [music,setMusic] = React.useState(isPlaying)

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

React.useEffect(()=>{

},[isPlaying,letPlay])

return(
  
    <div class="" ref={player}>
        {fullscreen ? <PlayerFullBox toggleFullScren={()=>changeMode()} items={props.items} /> : <PlayerSmallBox toggleFullScren={()=>changeMode()} media={props.items && props.items} /> }
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
  // getPlayListName = async ()=>{
  //     let response = await axios.get('playlistapi')

  // }
React.useEffect(()=>{
  let addtoPlaylist = document.getElementById(`direct${props.items.id}`)
  htmx.process(addtoPlaylist)
  //htmx.process(addtoPlaylist,{'hx-get':`addtoplaylist/${props.items.id}`,'hx-target':`#${props.items.id}optionbar`,'hx-swap':'innerHTML'})
},[])

  return(
    <div id={`${props.items.id}optionbar`} class='alert col-4  position-absolute' style={{lft:'0',right:'0'}}>
    <div id={`pop${props.items.id}`} class="bg-light shadow rounded p-2 popup">
    <div class="row mb-2">
      <a href={props.items.url} class='color-black col no-decoration' download>Download </a>
    </div>
      <div class="row mb-2">
      <a class="col no-decoration" id={`direct${props.items.id}`} href={`addtoplaylist/${props.items.id}`} hx-get={`addtoplaylist/${props.items.id}`} hx-trigger="click" hx-target={`#pop${props.items.id}`} hx-swap="beforeend"> Add to My PlayList
      </a>
      </div>
    </div>
    </div>
    )
}


function MusicBox(props){
  
  
  let musicList =props.items ? props.items : []  
  let {currentTrack, setCurrentTrack, isPlaying , setIsPlaying, letPlay, audioRefs} = usePlayer()
  let [menu,setMenu] = React.useState(props.items.map((x)=>({id:x.id,status:true})))

  const showOptionBar = (x,e) =>{
    setMenu(menu.map((i)=>i.id=== x ? {...i,status:i.status ? false:true} :{...i,status:true} ))
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
        audio.addEventListener('play',()=>{
          document.querySelector(`.${audio.id}`).classList.add('show')
        });
        audio.addEventListener('pause',()=>{
          document.querySelector(`.${audio.id}`).classList.remove('show')
        });
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
                        
                        <div class="col color-black no-decoration" onClick={()=>letPlay(x)} >
                        <div class="row"> 
                        <a class="col-12 sz-12 bold no-decoration color-black" style={{cursor:'pointer'}}>{x.title.slice(0,25)} </a>
                        <a class="col-12 sz-12 color-grey no-decoration" style={{color:'#d7'}}>{x.artist} </a>
                        </div>
                        </div>
                        <div class={`col-1 hide audio${x.id}`} id={'spinner'+ x.id }><div class="spinner-grow position-absolut" style={{fontSize:'2px'}}></div></div>
                        <div class="col">
                        <audio index={e} id={"audio"+x.id} onPlay={()=>addToHistory(x.id)}><source src={x.file} type="audio/mpeg" /></audio> 
                        </div>
                        <div class="col-2"> <i class={menu[e].status ? "fas fa-ellipsis-v passive color-grey":"fas fa-times-circle color-red"} onClick={()=>showOptionBar(x.id,e)}></i>
                          {menu[e].status ? '': <OptionBar items ={x}/>}                  
                        
                        </div>
                    </div>

                    </div>
                )
            })
          }
           
    </div>
    <Player items={isPlaying} />    
    </div>
  )
}

function PlayList(props){
if(props.items.length==0){
  return null;
}
  return(
      <div>
        <div class=" no-decoration no-border">
                {props.items.music.length !=0 ? 
                (<div class="row m-1 mx-md-2 rounded">
                  {props.items.music.slice(0,1).map((x)=>{
                    return(
                      
                          <img src={x.cover_photo} class="col ig-fluid w-100 m-0 p-0" style={{height:'200px',objectFit:'cover'}} />
                    
                  )})}
                </div>)
                :
                (
                  <div class="row m-1 border rounded">
                    <div class="col w-100 center d-flex align-items-center justify-content-center p-0 m-0" style={{height:'200px',objectFit:'cover'}}><i class="fas fa-music sz-24"></i></div>
                  </div>
                  )
              }
                <div class="row p-2" >
                <a  class="no-decoration" href={"/playlistdetail"+props.items.id}>
                  <div class="col card-title sz-18 px-md-3 mx-md-2" style={{marginTop:'-50px'}}>
                   <span class="color-bg-p color-white rounded p-2">{props.items.name} </span>
                  </div>
                </a>
                </div>
           </div>
      </div>
      
    )
}

function toTitle(x){
  let firstLetter = x.slice(0,1)
  let otherLetter = x.slice(1)
  console.log(firstLetter)
  console.log(otherLetter)
  return`${firstLetter.toUpperCase()}${otherLetter.toLowerCase()}`
}





function Media(){
  

  return(
<PlayerContextProvider><Player /></PlayerContextProvider>
    )
}

