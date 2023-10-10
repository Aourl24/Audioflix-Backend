function App(){
  let user = 'Awwal'
  let [historyMusic,setHistoryMusic] = React.useState() 
  React.useEffect(
    async ()=>{
      let response = await axios.get('/history')
    console.log(response.data);
    setHistoryMusic(response.data);
    }
    
    ,[])
  return(
    <PlayerContextProvider>
    <div>
    <h3>Welcome {user} </h3>
    <br />
        <MusicBox title="Recent Played" items={historyMusic} />
    </div>
    </PlayerContextProvider>
      )
}