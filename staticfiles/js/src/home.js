function toTitle(x){
  let firstLetter = x.slice(0,1)
  let otherLetter = x.slice(1)
  console.log(firstLetter)
  console.log(otherLetter)
  return`${firstLetter.toUpperCase()}${otherLetter.toLowerCase()}`
}

function App(){
  let [user,setUser] = React.useState({user:null})
  let [historyMusic,setHistoryMusic] = React.useState([{}]);
  let [likeSongs,setLikeSongs] = React.useState([{}]);
  let [playList,setPlayList] = React.useState([]);


  React.useEffect(
    async ()=>{
      let response = await axios.get('/history')
    setHistoryMusic(response.data);
    console.log(response.data)
    let response_data = await axios.get('/likesongs')
    setLikeSongs(response_data.data);
    let get_playlist = await axios.get('/playlistapi');
    setPlayList(get_playlist.data)
    let get_user = await axios.get('/profile')
    setUser(get_user.data)
    }
    
    ,[])
  if(user.user===null){
      return(<div class="center bold sz-24">Checking for Data </div>)
  }

  return(
    <PlayerContextProvider>
    <div>
    <div class="row align-items-center">
    <div class="col">
        <h2 class="my-2 sz-24">{user.user? `Hi, ${toTitle(user.user.username)}` : "Welcome to AudioFlix" } </h2>
        </div>
        <div class="col" style={{textAlign:'right'}}><i class="fas fa-user sz-24"></i></div>
        </div>
        <MusicBox title="Recent Played" items={historyMusic.slice(0,10)} />
        <br />
        <MusicBox title="Like Songs" items={likeSongs} />
        <br />
        <div class="sz-18 color-p bold my-2">Your PlayList </div>
        <div class="row">
        {playList.map((x)=><div class="col-sm col-md-6 p-3"><PlayList items={x} /></div>
          )
        }
        </div>
        <hr />
    </div>
    </PlayerContextProvider>
      )
}