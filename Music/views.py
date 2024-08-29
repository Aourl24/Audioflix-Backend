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
# Create your views here.

def template(x):
	return f"MusicTemplate/{x}"

def getUser(x):
	return Profile.objects.get(user=User.objects.get(username=x))

# @api_view(['GET'])
# def getUserView(request):
# 	user =lambda x: if request.user else 'Anonymous'
# 	return HttpResponse(user)

@api_view(['GET'])
def musicApiView(request):
	music = Music.objects.all()
	serializer = MusicSerializer(music,many=True,context=request) 
	return Response(serializer.data)

@api_view(['GET'])
def playListDetail(request,id,api=None):
	playlist = PlayList.objects.get(id=id)
	serializer = PlayListSerializer(playlist)
	if api:
		return Response(serializer.data)
	else:
		return render(request,template('playlist.html'),context=dict(id=id))


@api_view(['GET'])
def playListView(request):
	playlists = PlayList.objects.all()
	serializer = PlayListSerializer(playlists,many=True)
	return Response(serializer.data)

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
	serializer = PlayListSerializer(playlist,many=True)
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
	music = Music.objects.filter(title__icontains=param)
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
