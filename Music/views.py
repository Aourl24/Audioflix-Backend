from django.shortcuts import render
from .models import Music, PlayList, MusicHistory, Profile, Poster
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from .serializers import MusicSerializer,PlayListSerializer, MusicHistorySerializer,PosterSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
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
	serializer = MusicSerializer(music,many=True) 
	return Response(serializer.data)

@api_view(['GET'])
def playListDetail(request,id):
	playlist = PlayList.objects.get(id=id)
	serializer = PlayListSerializer(playlist)
	return Response(serializer.data)


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
		history = Music.objects.filter(music_history__profile=getUser(request.user)).order_by('-music_history__time')[1:10]
	else:
		history = MusicHistory.objects.fileter(profile=getUser(user))

	serializer = MusicSerializer(history,many=True)
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


def homeView(request):
	return render(request,template("home.html"))

def exploreView(request):
	return render(request,template('explore.html'))

def searchView(request):
	return render(request,template('search.html'))

@api_view(['GET'])	
def searchApi(request,param):
	music = Music.objects.filter(title__icontains=param)
	serializer = MusicSerializer(music, many=True)
	return Response(serializer.data)

@api_view(['GET'])
def addToHistoryView(request,id):
	if request.user.is_authenticated:
		music = Music.objects.get(id=id)
		history = MusicHistory.objects.create(profile=getUser(request.user),music=music)
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
		music.like.add(request.user.profile.id)
		check=True
	else:
		music.like.remove(request.user.profile.id)
		check=False

	return(Response(dict(like=check)))
