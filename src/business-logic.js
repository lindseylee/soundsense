SC.initialize({
    client_id: g.client_id,
    redirect_uri: 'http://google.com'
});

(function() {
    var DataStore = function () {
        var songCache = {};

        this.getSongsByTitle = function (songTitle, callback) {
            // First check songCache for songTitle
            // If present, just pass it to callback
            // Else, make API call, store results and pass to callback

            SC.get("/tracks", {q: songTitle, limit: 5 }, function(tracks) {
                // console.log(tracks);
                var results = []
                for (i = 0; i < 5; i++) {
                    var track = {
                        id: tracks[i].id,
                        title: tracks[i].title,
                        user_id: tracks[i].user_id,
                        username: tracks[i].user.username,
                        playback_count: tracks[i].playback_count,
                        favoritings_count: tracks[i].favoritings_count,
                        duration: tracks[i].duration,
                        comment_count: tracks[i].comment_count
                    }
                    songCache[tracks[i].id] = track;
                    results.push(track)
                }
                callback(results);
            });
        };

        this.getSongById = function(songId) {
            return songCache[songId];
        };

        this.getArtistInfo = function(songId, artistId, callback) {
            SC.get('/users/'+artistId, function(user) {
                songCache[songId]['followers'] = user.followers_count;
            });
        };

        this.getCommentsBySong = function(songId) {
            var all = [];
            SC.get('/tracks/'+songId+'/comments', function(comments) {
                for (var i = 0; i < 100; i++) {
                    all.push(comments[i].body);
                }
            bl.filter(all);
            });
        };
    };

    var store = new DataStore();

    var BusinessLogic = function() {


        this.searchForSongs = function(songTitle) {
            var songOptionsHTML = "";
            store.getSongsByTitle(songTitle, function(tracks) {
                for (var i in tracks) {
                    songOptionsHTML += '<input type="radio" name="song" value="'+tracks[i].id+'">' + tracks[i].title + '<br />';
                }
                $('.options').html(songOptionsHTML);
                $('.select-song').show();
            });
        };

        this.addSong = function(songId) {
            var song = store.getSongById(songId);
            store.getArtistInfo(songId, song.user_id); 
            $('.analyze-list').append('<li data-id="'+song.id+'">'+song.title+"</li>");
            console.log(song);
        };

        this.analyzeSongs = function(songIds) {
            // store.getSongById
            var songObjects = [];
            for (var i = 0; i < songIds.length; i++) {
                songObjects.push(store.getSongById(songIds[i]));
            }
            // send songObjects to charts view
            console.log(songObjects);
        };

        this.sendSong = function(songId) {
            store.getCommentsBySong(songId);
        };

        this.filter = function(com) {
            var filter = com.join(" ");
            console.log(filter);

        };

    };

    window.bl = new BusinessLogic();
})();
// SC.get("/tracks", { q: 'sad machine'}, function(tracks) {
//     for (i = 0; i < 10; i++) {
//         console.log(tracks[i].title);
//     }
//     // console.log(tracks);
// });
// var comments = [];

// SC.get("/tracks/131713700/comments", function(tune) {
//     console.log(tune);
//     console.log(tune[111].body);
//     console.log(tune.length);
//     for (var i = 0; i < 100; i++ ) {
//         console.log(tune[i].body);
//         comments.push(tune[i].body);
//     }
//         console.log(comments);
// });



