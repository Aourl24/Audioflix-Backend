# Generated by Django 4.2.2 on 2023-10-30 23:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Music', '0007_poster'),
    ]

    operations = [
        migrations.AlterField(
            model_name='musichistory',
            name='music',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='music_history', to='Music.music', unique=True),
        ),
    ]
