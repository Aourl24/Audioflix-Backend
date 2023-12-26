from django.urls import path
from .views import musicApiView, playListView, playListDetail, homeView ,musicHistoryApi, likeSongApi, playListApi, exploreView, searchView,searchApi,addToHistoryView,posterView,likeSong, profileApi, createPlayList,playListsView,addToPlayList

urlpatterns = [
	path('musicapi',musicApiView,name="MusicApiUrl"),
	path('playlistviewapi',playListView,name="PlayListApiUrl"),
	path('playlistdetail<int:id>',playListDetail,name="PlayListDetailUrl"),
	path('home',homeView,name="HomeUrl"),
	path('history',musicHistoryApi,name="HistoryApi"),
	path('likesongs',likeSongApi,name="LikeSongApi"),
	path('playlistapi',playListApi,name="PlayListApi"),
	path('explore',exploreView,name="ExploreUrl"),
	path('search',searchView,name="SearchUrl"),
	path('searchapi/<str:param>',searchApi,name="SearchApi"),
	path('addtohistory/<int:id>',addToHistoryView),
	path('poster',posterView),
	path('likesong<int:id>',likeSong),
	path('checklike<int:id>/<str:check_like>',likeSong),
	path('playlist<int:id>/<str:api>',playListDetail,name="PlayListUrl"),
	path('profile',profileApi,name="ProfileApi"),
	path('createplaylist',createPlayList,name="CreatePlayListUrl"),
	path('myplaylist',playListsView,name="PlayListView"),
	path('addtoplaylist/<int:id>',addToPlayList,name="AddToPlayList")
]