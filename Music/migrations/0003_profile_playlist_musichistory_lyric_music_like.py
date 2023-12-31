# Generated by Django 4.2.2 on 2023-10-05 20:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Music', '0002_alter_music_featured_artist'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_picture', models.ImageField(blank=True, default='profile_pictures/profile.png', null=True, upload_to='profile_pictures')),
                ('bio', models.TextField(blank=True, null=True, verbose_name='Bio')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PlayList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('music', models.ManyToManyField(related_name='playlist', to='Music.music')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='playlist', to='Music.profile')),
            ],
        ),
        migrations.CreateModel(
            name='MusicHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('music', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='music_history', to='Music.music')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='music_history', to='Music.profile')),
            ],
        ),
        migrations.CreateModel(
            name='Lyric',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField()),
                ('music', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='lyrics', to='Music.music')),
            ],
        ),
        migrations.AddField(
            model_name='music',
            name='like',
            field=models.ManyToManyField(related_name='music_like', to='Music.profile'),
        ),
    ]
