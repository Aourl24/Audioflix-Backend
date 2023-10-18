function App(){
	let value = React.useRef()
	let [musicList,setMusicList] = React.useState([{}])
	
	let getResult = async()=>{
		let searchValue = value.current.value
		let response = await axios.get(`searchapi/${searchValue}`)
		setMusicList(response.data)
	}

	return(
	<PlayerContextProvider>
	<div>
	<form>
	<input class="form-control" onChange={()=>getResult()} ref={value} />
	</form>
	<br />
	Search Results
	<br />
	<MusicBox items={musicList} />
	</div>
	</PlayerContextProvider>
	)
}