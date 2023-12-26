function App(){
let [musicList, setMusicList] = React.useState(null)
let [playList,setPlayList] = React.useState([])
let [poster, setPoster] = React.useState([])
let [count,setCount] = React.useState(0)

React.useEffect(
async()=>{
let response = await axios.get('/musicapi')
setMusicList(response.data);
let response_two = await axios.get('/playlistapi')
setPlayList(response_two.data);
let getPoster = await axios.get('/poster')
setPoster(getPoster.data);
},[])

React.useEffect(()=>
	{let time = setInterval(()=>{
	//count >= poster.length ? setCount(0) : setCount(count+=1)
	setCount((prevIndex)=>(prevIndex + 1) % poster.length)
	},2*60*1000)
	return () => clearInterval(time)
} 
	,[poster.length])

return(
	<PlayerContextProvider>
	<div>
	<div class="sticky-top p-2 color-bg-white">
		<h2 class="color-p color-p colo-white rounded">Explore All music </h2>
	</div>		

		{musicList ? <MusicBox items={musicList} title="Trending Songs" /> :'' }
		
		<div class="row" style={{overflow:'auto'}}>
		{playList && playList.map((x)=><div class="col-sm col-md-6"> <PlayList items={x} /></div>)}
		</div>
	</div>
	</PlayerContextProvider>
	)
}