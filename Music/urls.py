from django.urls import path
from .views import musicApiView, playListView, playListDetail, homeView ,musicHistoryApi
urlpatterns = [
	path('musicapi',musicApiView,name="MusicApiUrl"),
	path('playlistapi',playListView,name="PlayListApiUrl"),
	path('playlistdetail<int:id>',playListDetail,name="PlayListDetailApiUrl"),
	path('home',homeView,name="HomeUrl"),
	path('history',musicHistoryApi,name="HistoryApi")
]