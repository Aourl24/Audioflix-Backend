from django.shortcuts import render
from .models import Music, PlayList, MusicHistory, Profile
from django.contrib.auth.models import User
from django.http import JsonResponse
from .serializers import MusicSerializer,PlayListSerializer, MusicHistorySerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Create your views here.

def template(x):
	return f"MusicTemplate/{x}"

def getUser(x):
	return Profile.objects.get(user=User.objects.get(username=x))

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

@api_view(['GET'])
def musicHistoryApi(request,user=None):
	if user is None:
		#history = MusicHistory.objects.filter(profile=getUser(request.user))
		history = Music.objects.filter(music_history__profile=getUser(request.user))
	else:
		history = MusicHistory.objects.fileter(profile=getUser(user))

	serializer = MusicSerializer(history,many=True)
	return Response(serializer.data)

@api_view(['GET'])
def likeSongApi(request,user=None):
	if user is None:
		likes = Music.objects.filter(like=getUser(request.user)).all()
	else:
		likes = Music.objects.filter(like=getUser(user)).all()
	serializer = MusicSerializer(likes,many=True)
	return Response(serializer.data)

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

#@api_view(['GET'])