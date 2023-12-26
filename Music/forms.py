from django import forms 
from .models import PlayList

class PlayListForm(forms.ModelForm):
	class Meta:
		model =PlayList
		exclude = ['profile','music']