function App(){
  let user = 'Awwal'
  let [historyMusic,setHistoryMusic] = React.useState();
  let [likeSongs,setLikeSongs] = React.useState();
  let [playList,setPlayList] = React.useState([]);

  React.useEffect(
    async ()=>{
      let response = await axios.get('/history')
    setHistoryMusic(response.data);
    let response_data = await axios.get('/likesongs')
    setLikeSongs(response_data.data);
    let get_playlist = await axios.get('/playlist');
    console.log(get_playlist.data)
    setPlayList(get_playlist.data)
    
    }
    
    ,[])
  return(
    <PlayerContextProvider>
    <div>
    <h3 class="sz-24">Welcome {user} </h3>
  
        <MusicBox title="Recent Played" items={historyMusic} />
        <hr />
        <MusicBox title="Like Songs" items={likeSongs} />
        <hr />
        <div class="sz-18 color-p bold">Your PlayList </div>
        <br />
        {playList.map((x)=><PlayList items={x} />
          )
        }
        <br />
    </div>
    </PlayerContextProvider>
      )
}