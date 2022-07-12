const fs = require('fs');
const SpotifyWebApi = require('spotify-web-api-node');
const token = fs.readFileSync("TOKEN.txt", "utf-8");
const TOKEN = token;

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(TOKEN);


//GET MY PLAYLISTS
/*async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}
*/
spotifyApi.getMyRecentlyPlayedTracks({
  limit: 5
}).then(function (data) {
  // Output items
  console.log("Tus canciones recien escuchadas son");
  data.body.items.forEach(item => console.log(item.track['name']));
}, function (err) {
  console.log('Something went wrong!', err);
});
spotifyApi.getMyTopTracks()
  .then(function (data) {
    let topTracks = data.body.items;
    console.log("Tu Playlst Upsidedown es:")
    for (prop in topTracks) {
      let toptracks = topTracks[prop].name;
      console.log(topTracks[prop].name);
    }
  }, function (err) {
    console.log('Something went wrong!', err);
  });

// Get Recommendations Based on Seeds
spotifyApi.getRecommendations({
  min_energy: 0.4,
  seed_artists: ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'],
  min_popularity: 50
})
  .then(function (data) {
    let recommendations = data.body['name'];
    console.log("Recomentations");

    console.log(recommendations);

  }, function (err) {
    console.log("Something went wrong!", err);
  });
