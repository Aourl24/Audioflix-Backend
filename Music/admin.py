from django.contrib import admin
from .models import Music,Artist,Lyric,PlayList,MusicHistory,Profile


admin.site.register([Music,Artist,Lyric,PlayList,MusicHistory,Profile])
