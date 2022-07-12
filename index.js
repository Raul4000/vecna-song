var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const cors = require('cors');
const fs = require('fs')

// This file is copied from: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js

let token = fs.readFileSync("TOKEN.txt", "utf-8");

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '5daa4170bbf94ed89669d0838e05a47f',
  clientSecret: '15fe865b58a2486691a7937b2f424dd5',
  redirectUri: 'http://localhost:5500/callback'
});

const app = express();

app.use(cors());

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
  res.redirect('file:///C:/Users/Alex/Desktop/strainger%20things/information.html');
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      //Save the token in JSON
      const fs = require('fs');

      fs.writeFileSync('TOKEN.txt', access_token);
      token = access_token;

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.redirect('file:///C:/Users/Alex/Desktop/strainger%20things/information.html');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.get('/lista', (req, res) => {
  const client = new SpotifyWebApi();
  client.setAccessToken(token)
  // client.getMe().then(me => client.getUserPlaylists(me.body.id)).then(playlists => {
  //   res.setHeader('content-type', 'application/json')
  //   res.send(playlists)
  // })
  client.getMyRecentlyPlayedTracks({
    limit: 5
  }).then(function (data) {
    res.send()
    res.send(data.body);
    // Output items
    // res.write("Tus canciones recien escuchadas son \n");
    // data.body.items.forEach(item => res.write(item.track['name']+'\n'));
    // res.end();
  }, function (err) {
    res.send('Something went wrong!', err);
  });
  // console.log(me.body);
  // getUserPlaylists(me.body.id);
})

app.listen(PORT, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:'+PORT+'/login in your browser.'
  )
);

const Koa = require('koa')
const KoaCors = require('koa-cors')
const KoaJson = require('koa-json')
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('/lista', async ctx => {
  const client = new SpotifyWebApi();
  client.setAccessToken(token)
  const getmeResponse = await client.getMe();
  const recommendationsResponse = await client.getRecommendations({
    limit: 5,
    min_energy: 0.4,
    seed_artists: ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'],
    min_popularity: 50
  })
  const recommended = []
  for (const item of recommendationsResponse.body.tracks) {
    recommended.push(item.name);
  }

  const recentResponse = await client.getMyRecentlyPlayedTracks({
    limit: 5,
  })
  const recent = []
  for (const item of recentResponse.body.items) {
    recent.push(item.track.name);
  }

  const topTracksResponse = await client.getMyTopTracks({
    limit: 6,
  })
  const top = []
  for (const item of topTracksResponse.body.items) {
    top.push(item.name)
  }

  ctx.response.body = {
    profile_name: getmeResponse.body.display_name,
    profile_image: getmeResponse.body.images[0].url,
    profile_spotify: getmeResponse.body.external_urls.spotify,
    recent: recent,
    recommended: recommended,
    top: top,
  };
})

const koa = new Koa();
koa.use(KoaCors())
koa.use(KoaJson())
koa.use(router.allowedMethods())
koa.use(router.routes())

const PORT = process.env.PORT



