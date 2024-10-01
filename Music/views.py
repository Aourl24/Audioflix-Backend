from django.shortcuts import render
from .models import Music, PlayList, MusicHistory, Profile, Poster
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from .serializers import MusicSerializer,PlayListSerializer, MusicHistorySerializer,PosterSerializer,ProfileSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.utils import timezone
from .forms import PlayListForm
from django.core.cache import cache
from django.core.paginator import Paginator
from .api import api_headers
import requests
# Create your views here.

# data = {
#     'grant_type': 'refresh',
# }

def template(x):
	return f"MusicTemplate/{x}"

def getUser(x):
	return Profile.objects.get(user=User.objects.get(username=x))


def getData(url):
    response = requests.post(url,headers = api_headers)
    if response.status_code == 200:
    	res = response.json()
    	return res
    else:
    	print('Error:', response.status_code, response.text)
    return

# @api_view(['GET'])
# def getUserView(request):
# 	user =lambda x: if request.user else 'Anonymous'
# 	return HttpResponse(user)

@api_view(['GET'])
def musicApiView(request,refresh=None):
	cache_key = "music_api"
	cached_data = cache.get(cache_key)
	if not refresh and cached_data:
		return Response(cached_data)
	# res = getData( 'http://api.spotify.com/v1/tracks?market=NG&ids=7ouMYWpwJ422jRcDASZB7P%2C4VqPOruhp5EdPBeR92t6lQ%2C2takcwOaAZWiXQijPHIx7B')
	# #{"artist":[{'name'}],"id":"","href":"","name":"","preview_url":"","uri":"","album":{"images":[{"url":}]}}
	# convert = [{"id":x["id"],"cover_photo": x["album"]["images"][0]["url"], "title": x["name"], "artist": x['artists'][0]["name"],"file": x["external_urls"]['spotify']} for x in res["tracks"]]


	music = Music.objects.all().order_by("?")[:7]
	serializer = MusicSerializer(music,many=True,context=request) 
	# all_music = list(serializer.data) + convert
	cache.set(cache_key,serializer.data,timeout=10 * 10)
	return  Response(serializer.data)

@api_view(['GET'])
def playListDetail(request,id,api=None):
	playlist = PlayList.objects.get(id=id)
	serializer = PlayListSerializer(playlist,context=request)
	if api:
		return Response(serializer.data)
	else:
		return render(request,template('playlist.html'),context=dict(id=id))


@api_view(['GET'])
def playListView(request,page):
	cache_key = f"playlist_api"
	cached_data = cache.get(cache_key)
	if cached_data:
		playlists = cached_data
	else:
		playlists = PlayList.objects.all().order_by("?")
		cache.set(cache_key,playlists,timeout = 10 * 10)
	paginator = Paginator(playlists,7)
	page_playlists = paginator.get_page(page)
	if page > paginator.num_pages:
		return Response({'data':[]})
	serializer = PlayListSerializer(page_playlists,many=True,context=request)
	return Response({'data':serializer.data,'page':page_playlists.number,'has_next':page_playlists.has_next(),'pages':paginator.num_pages})

@login_required
@api_view(['GET'])
def musicHistoryApi(request,user=None):
	if user is None:
		#history = MusicHistory.objects.filter(profile=getUser(request.user))
		#history = Music.objects.filter(music_history__profile=getUser(request.user)).order_by('-music_history__time')[1:10]
		histories = MusicHistory.objects.filter(profile=getUser(request.user)).order_by('-time')
		
	else:
		histories = MusicHistory.objects.filter(profile=getUser(user))

	music = [history.music for history in histories]
	serializer = MusicSerializer(music,many=True)
	return Response(serializer.data)

@login_required
@api_view(['GET'])
def likeSongApi(request,user=None):
	if user is None:
		likes = Music.objects.filter(like=getUser(request.user)).all()
	else:
		likes = Music.objects.filter(like=getUser(user)).all()
	serializer = MusicSerializer(likes,many=True)
	return Response(serializer.data)

@login_required
@api_view(['GET'])
def playListApi(request,user=None):
	if user is None:
		playlist = PlayList.objects.filter(profile=getUser(request.user))
	else:
		playlist = PlayList.objects.filter(profile=getUser(user))
	serializer = PlayListSerializer(playlist,many=True,context=request)
	return Response(serializer.data)

@login_required
def homeView(request):

	return render(request,template("home.html"))

def exploreView(request):
	return render(request,template('explore.html'))

def searchView(request):
	return render(request,template('search.html'))

#def playlistTemplate(request):
#	return render(request,template('playlist.html'))

@api_view(['GET'])	
def searchApi(request,param):
	title_search = Music.objects.filter(title__icontains=param)
	artist_search = Music.objects.filter(artist__name__icontains=param)
	music = title_search.union(artist_search)
	serializer = MusicSerializer(music,many=True,context=request)
	return Response(serializer.data)


@api_view(['GET'])
def addToHistoryView(request,id):
	if request.user.is_authenticated:
		music = Music.objects.get(id=id)
		
		try:
			history = MusicHistory.objects.get(profile=getUser(request.user),music=music)
		except:
			history = MusicHistory.objects.create(profile=getUser(request.user),music=music)

		
		history.time = timezone.now()
		history.save()

		#history,created = MusicHistory.objects.get_or_create(profile=getUser(request.user),music=music)
		#history.time = timezone.now()
		#history.save()

		return HttpResponse('Added to history succesfully')


@api_view(['GET'])
def posterView(request):
	poster = Poster.objects.all()
	serializer = PosterSerializer(poster,many=True)
	return Response(serializer.data)

@login_required
@api_view(['GET'])
def likeSong(request,id,check_like=None):
	music = Music.objects.get(id=id)
	#music.like.add(request.user)
	check = music.like.filter(id=request.user.profile.id).exists()

	if check_like:
		return Response(dict(like=check))
		
	if check:
		music.like.remove(request.user.profile.id)
		check=False
	else:
		music.like.add(request.user.profile.id)
		check=True
	print(check)
	return Response(dict(like=check))

@api_view(['GET'])
def profileApi(request,id=None):
	if request.user.is_authenticated:
		profile = getUser(request.user)
		serializer = ProfileSerializer(profile)
		response = serializer.data
		return Response(response)
	return Response(dict(user=None))


def createPlayList(request):
	form = PlayListForm()
	context = dict(form=form)
	if request.method == 'POST':
		form = PlayListForm(request.POST)
		if form.is_valid():
			a = form.save(commit=False)
			a.profile = getUser(request.user)
			a.save()

	return render(request,template('createplaylist.html'),context)



def playListsView(request):
	playlists = PlayList.objects.filter(profile=getUser(request.user))

	context = dict(playlists=playlists)

	return render(request,template('myplaylist.html'),context)


def addToPlayList(request,id):
	music = Music.objects.get(id=id)
	#playlists = Playlist.objects.get(id=id).music.add(music)
	musicPlaylist = music.playlist.all()
	playlist_name = [x.name for x in musicPlaylist]
	playlists = PlayList.objects.filter(profile=getUser(request.user)).exclude(name__in=playlist_name)
	if request.method == 'POST':
		playlist_name = request.POST.get('playlist')
		playlist_obj = PlayList.objects.get(id=playlist_name).music.add(music)
		#playlist_obj.save()
		return HttpResponse('Added to Playlist succesfully')
	context = dict(music=music,playlists=playlists)
	return render(request,template('addtoplaylist.html'),context)
