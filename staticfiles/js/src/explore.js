function App(){
let [musicList, setMusicList] = React.useState([{}])
let [playList,setPlayList] = React.useState([])
React.useEffect(
async()=>{
let response = await axios.get('/musicapi')
setMusicList(response.data);
let response_two = await axios.get('/playlistapi')
setPlayList(response_two.data)
},[])
return(
	<PlayerContextProvider>
	<div>
		<div class="color-p">Explore All music Here</div>
		<br />
		<MusicBox items={musicList} />
		<br />
		<PlayList items={playList} />

	</div>
	</PlayerContextProvider>
	)
}