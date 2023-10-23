from django.urls import path
from .views import musicApiView, playListView, playListDetail, homeView ,musicHistoryApi, likeSongApi, playListApi, exploreView, searchView,searchApi,addToHistoryView,posterView,likeSong

urlpatterns = [
	path('musicapi',musicApiView,name="MusicApiUrl"),
	path('playlistapi',playListView,name="PlayListApiUrl"),
	path('playlistdetail<int:id>',playListDetail,name="PlayListDetailApiUrl"),
	path('home',homeView,name="HomeUrl"),
	path('history',musicHistoryApi,name="HistoryApi"),
	path('likesongs',likeSongApi,name="LikeSongApi"),
	path('playlist',playListApi,name="PlayListApi"),
	path('explore',exploreView,name="ExploreUrl"),
	path('search',searchView,name="SearchUrl"),
	path('searchapi/<str:param>',searchApi,name="SearchApi"),
	path('addtohistory/<int:id>',addToHistoryView),
	path('poster',posterView),
	path('likesong<int:id>',likeSong),
	path('checklike<int:id>/<str:check_like>',likeSong),
]