function App(){
let [musicList, setMusicList] = React.useState([{}])
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
	console.log(count)
	console.log('length is ' + poster.length )
	},2*60*1000)
	return () => clearInterval(time)
} 
	,[poster.length])

return(
	<PlayerContextProvider>
	<div>
		<div class="color-p bold sz-18">Explore All music Here</div>
		<br />

		{poster.length > 0 ? <img class="img-fluid w-100" style={{height:'300px',objectFit:'cover',objctPosition:'top'}} src={poster[count].img} />: null }
		<MusicBox items={musicList} />
		<br />
		{playList.map((x)=> <PlayList items={x} />)}
	</div>
	</PlayerContextProvider>
	)
}