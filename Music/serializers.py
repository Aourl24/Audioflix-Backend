from rest_framework import serializers
from .models import Music,Artist,Lyric,PlayList,MusicHistory,Profile,Poster
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	class Meta:
		model = Profile
		fields = '__all__'

class ArtistSerializer(serializers.ModelSerializer):
	class Meta:
		model = Artist
		fields= '__all__'


class MusicSerializer(serializers.ModelSerializer):
	artist = ArtistSerializer()
	class Meta:
		model = Music
		fields= '__all__'

	def to_representation(self,instance):
		rep = super().to_representation(instance)
		rep['artist'] = instance.artist.name
		return rep 

class PlayListSerializer(serializers.ModelSerializer):
	music = MusicSerializer(many=True)
	class Meta:
		model = PlayList
		fields = '__all__'

class MusicHistorySerializer(serializers.ModelSerializer):
	profile =ProfileSerializer()
	music = MusicSerializer()

	class Meta:
		model = MusicHistory
		fields = "__all__"

class PosterSerializer(serializers.ModelSerializer):
	class Meta:
		model = Poster
		fields = "__all__"
	# def to_representation(self,instance):
	# 	rep = super().to_representation(instance)
	# 	rep['profile'] = instance.user.username
	# 	return rep