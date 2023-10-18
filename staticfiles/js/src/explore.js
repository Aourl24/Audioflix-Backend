function App(){
let [musicList, setMusicList] = React.useState([{}])

React.useEffect(
async()=>{
let response = await axios.get('/musicapi')
setMusicList(response.data)
},[])
return(
	<PlayerContextProvider>
	<div>
		Explore All music Here
		<br />
		<MusicBox items={musicList} />
	</div>
	</PlayerContextProvider>
	)
}