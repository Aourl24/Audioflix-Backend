function toTitle(x){
  let firstLetter = x.slice(0,1)
  let otherLetter = x.slice(1)
  console.log(firstLetter)
  console.log(otherLetter)
  return`${firstLetter.toUpperCase()}${otherLetter.toLowerCase()}`
}

function App(){
	let [playlist, setPlayList] = React.useState(null)
	React.useState(
		()=>{
			let id = document.getElementById('playlist_id').value
			let getData = async () =>{
				let response = await axios.get(`playlist${id}/api`)
				console.log(response.data)
				setPlayList(response.data)
			}
			getData()
		}
		,[])
	
	if(playlist==null){
		return null
	}

	return(
			<div>
			<div class="row m-1 my-3">
                  {playlist.music.slice(0,4).map((x)=>{
                    return(
                      
                          <img src={x.cover_photo} class="col ig-fluid w-100 m-0 p-0" style={{height:'200px',objectFit:'cover'}} />
                    
                  )})}
                </div>

				<h2 class="my-3 sz-md-36 sz-sm-24 color-p">{toTitle(playlist.name)}</h2>

				<MusicBox items={playlist.music} />

			</div>
		)
}