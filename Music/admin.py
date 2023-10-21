from django.contrib import admin
from .models import Music,Artist,Lyric,PlayList,MusicHistory,Profile,Poster


admin.site.register([Music,Artist,Lyric,PlayList,MusicHistory,Profile,Poster])
