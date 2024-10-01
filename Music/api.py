import requests
import base64

spotify_secret = "f19fe3a6954743aeb33310246f95371c"
client_id = 'e242c464da324bd99b7ddeea9bd418c9'
client_secret = 'f19fe3a6954743aeb33310246f95371c'

# Encode the client_id and client_secret in base64
auth_str = f"{client_id}:{client_secret}"
auth_bytes = auth_str.encode('ascii')
auth_base64 = base64.b64encode(auth_bytes).decode('ascii')

# Set up the request details
auth_url = 'https://accounts.spotify.com/api/token'
headers = {
    'Authorization': f'Basic {auth_base64}',
}
data = {
    'grant_type': 'client_credentials',
}

# Send the POST request to get the token
# response = requests.post(auth_url, headers=headers, data=data)

# # Check the response and extract the token
# if response.status_code == 200:
#     res = response.json()
#     print(res)
#     token = res.get('access_token')
#     print('Access Token:', token)
# else:
#     print('Error:', response.status_code, response.text)


access_token = "BQCm3ukzt5wqJlCEcKRm0eYuGhguYxSadHCa_aIS_UHAEZj7IYxOyQMSJkE_0ACWdaRB4ug_gwrPUFK9QjY37JjYLKQZDj3DXVQNeNDKcNobxelPrlg"

api_headers = {
      "Authorization": 'Bearer ' + access_token
    }

base_endpoints = " https://api.spotify.com."


"""Playlists"""

playlists_endpoints = "https://api.spotify.com/v1/browse/categories/{category_id}/playlists"
#playlists_response = {"href":"","items":[{"href":"","id":"","images":[{"url":""}]},"name":"","id":""],"total":""}

"""playlist detail"""

playlist_endpoints = "https://api.spotify.com/v1/playlists/{playlist_id}"
#playlists_response = {"id":"","images":[],"name":"","track":{[]},"uri":""}

"""tracks"""

track_endpoints = "https://api.spotify.com/v1/tracks"
#track_response = {"artist":[{'name'}],"id":"","href":"","name":"","preview_url":"","uri":"","album":{"images":[{"url":}]}}
