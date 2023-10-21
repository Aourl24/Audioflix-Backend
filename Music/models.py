from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Profile(models.Model):
	user = models.OneToOneField(User,related_name='profile',on_delete=models.CASCADE)
	profile_picture = models.ImageField(upload_to='profile_pictures',null=True,blank=True,default='profile_pictures/profile.png')
	bio = models.TextField('Bio',null=True,blank=True)


	def __str__(self):
		return self.user.username

	def liked_music(self):
		music = Music.objects.get()



class Artist(models.Model):
	name = models.CharField(max_length=100000)

	def __str__(self):
		return self.name

class Poster(models.Model):
	title = models.CharField(max_length=100000)
	img = models.ImageField(upload_to='poster_images')
	date = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.title

class Music(models.Model):
	title = models.CharField(max_length=10000)
	artist = models.ForeignKey(Artist,related_name='music',on_delete=models.CASCADE)
	featured_artist = models.ManyToManyField(Artist,related_name='feature_music',blank=True)
	cover_photo = models.ImageField()
	file = models.FileField()
	like = models.ManyToManyField(Profile,related_name='music_like',blank=True)

	def __str__(self):
		return self.title

class Lyric(models.Model):
	music = models.OneToOneField(Music,related_name='lyrics',on_delete=models.CASCADE)
	body = models.TextField()

	def __str__(self):
		return self.music

class PlayList(models.Model):
	profile = models.ForeignKey(Profile,related_name='playlist',on_delete=models.CASCADE)
	name = models.CharField('PlayList Name', max_length=1000000,default="")
	music = models.ManyToManyField(Music,related_name="playlist",blank=True)
	cover_photo = models.ImageField(null=True,blank=True)

	def __str__(self):
		return f'{self.profile} playlist '

class MusicHistory(models.Model):
	profile = models.ForeignKey(Profile,related_name='music_history',on_delete=models.CASCADE)
	music = models.ForeignKey(Music,related_name="music_history",on_delete=models.CASCADE)
	time = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.profile} hsitory"