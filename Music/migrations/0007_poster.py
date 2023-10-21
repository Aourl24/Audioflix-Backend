# Generated by Django 4.2.2 on 2023-10-19 21:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Music', '0006_playlist_cover_photo'),
    ]

    operations = [
        migrations.CreateModel(
            name='Poster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100000)),
                ('img', models.ImageField(upload_to='poster_images')),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]