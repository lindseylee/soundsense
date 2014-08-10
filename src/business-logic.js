SC.initialize({
    client_id: g.client_id,
    redirect_uri: 'http://google.com'
});

(function() {
    var DataStore = function () {
        var songCache = {};

        this.getSongsByTitle = function (songTitle, callback) {
            SC.get("/tracks", {q: songTitle, limit: 5 }, function(tracks) {
                console.log(tracks);
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
                        comment_count: tracks[i].comment_count,
                        permalink_url: tracks[i].permalink_url,
                        stream_url: tracks[i].stream_url
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
            var songCount = this.getSongById(songId).comment_count;
            var pageSize = 200;
            var pageCount = Math.floor(songCount / pageSize);
            var commentPromises = [];
            var allComments = [];
            var commentTimes = [];
            for (var i = 0; i < pageCount; i += 1) {
                var promise = new Promise(function(resolve, reject) {
                    SC.get('/tracks/'+songId+'/comments', { limit: pageSize, offset: pageSize * i }, function(comments) {
                        resolve(comments);
                    });
                    // console.log("Delivering promise");
                    // resolve("some value");
                });
                commentPromises.push(promise);
            }
            
            Promise.all(commentPromises).then(function(commentsArray) {
                // console.log('After all:', commentsArray);
                for (var i = 0; i < commentsArray.length; i++) {
                    // do stuff
                    for (var j = 0; j < commentsArray[i].length; j++) {
                        allComments.push(commentsArray[i][j].body);
                        commentTimes.push(commentsArray[i][j].timestamp)
                    }
                }
            songCache[songId]['comment_string'] = bl.filter(allComments);
            // console.log(allComments);
            songCache[songId]['comment_times'] = bl.timeStamp(commentTimes);
            // console.log(commentTimes);
            });
        };
    };

    window.store = new DataStore();

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
            store.getCommentsBySong(songId);
            $('.analyze-list').append('<li data-id="'+song.id+'">'+song.title+"</li>");
            // console.log(song);
        };

        this.analyzeSongs = function(songIds) { 
            var songObjects = [];
            for (var i = 0; i < songIds.length; i++) {
                songObjects.push(store.getSongById(songIds[i]));
            }
            // send songObjects to charts view
            console.log(songObjects);
            bl.barChartData(songObjects);
        };

        this.sendSong = function(songId) {
            store.getCommentsBySong(songId);
        };

        this.filter = function(com) {
            var filter = com.join(" ");
            filter2 = filter.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
            filter3 = filter2.replace(/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/ig, '');
            // console.log(filter3);
            return filter3;

        };

        this.timeStamp = function(comments) {
            var commentTimes = {
                15: 0,
                30: 0,
                45: 0,
                60: 0,
                75: 0,
                90: 0,
                105: 0,
                120: 0,
                135: 0,
                150: 0,
                165: 0,
                180: 0,
                195: 0,
                210: 0,
                225: 0,
                240: 0,
                255: 0,
                270: 0,
                285: 0,
                300: 0
            };
            for (var i = 0; i < comments.length; i++) {
                switch(true) {
                    case (comments[i] < 15000):
                        commentTimes['15'] += 1;
                        break;
                    case (comments[i] > 15000 && comments[i] < 30000):
                        commentTimes['30'] += 1;
                        break;
                    case (comments[i] > 30000 && comments[i] < 45000):
                        commentTimes['45'] += 1;
                        break;
                    case (comments[i] > 45000 && comments[i] < 60000):
                        commentTimes['60'] += 1;
                        break;
                    case (comments[i] > 60000 && comments[i] < 75000):
                        commentTimes['75'] += 1;
                        break;
                    case (comments[i] > 75000 && comments[i] < 90000):
                        commentTimes['90'] += 1;
                        break;
                    case (comments[i] > 90000 && comments[i] < 105000):
                        commentTimes['105'] += 1;
                        break;
                    case (comments[i] > 105000 && comments[i] < 120000):
                        commentTimes['120'] += 1;
                        break;
                    case (comments[i] > 120000 && comments[i] < 135000):
                        commentTimes['135'] += 1;
                        break;
                    case (comments[i] > 135000 && comments[i] < 150000):
                        commentTimes['150'] += 1;
                        break;
                    case (comments[i] > 150000 && comments[i] < 165000):
                        commentTimes['165'] += 1;
                        break;
                    case (comments[i] > 165000 && comments[i] < 180000):
                        commentTimes['180'] += 1;
                        break;
                    case (comments[i] > 180000 && comments[i] < 195000):
                        commentTimes['195'] += 1;
                        break;
                    case (comments[i] > 195000 && comments[i] < 210000):
                        commentTimes['210'] += 1;
                        break;
                    case (comments[i] > 210000 && comments[i] < 225000):
                        commentTimes['225'] += 1;
                        break;
                    case (comments[i] > 225000 && comments[i] < 240000):
                        commentTimes['240'] += 1;
                        break;
                    case (comments[i] > 240000 && comments[i] < 255000):
                        commentTimes['255'] += 1;
                        break;
                    case (comments[i] > 255000 && comments[i] < 270000):
                        commentTimes['270'] += 1;
                        break;
                    case (comments[i] > 270000 && comments[i] < 285000):
                        commentTimes['285'] += 1;
                        break;
                    case (comments[i] > 285000 && comments[i] < 300000):
                        commentTimes['300'] += 1;
                        break;
                    default:
                        commentTimes['300'] += 1;
                        break;
                }
            }
            // console.log(commentTimes);
            return commentTimes;
        };

        this.embedSong = function(track_url) {
            // track_url = song
            song = SC.oEmbed(track_url, function(oEmbed) {
                console.log('response:' + oEmbed);
            });
            return song;
        };

        this.barChartData = function(songs) {
            var barData = {
                labels: ["jan", "feb", "march", "april", "may", "june", "july"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,0.8)",
                        highlightFill: "rgba(151,187,205,0.75)",
                        highlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            };
            var ctx = document.getElementById("plays").getContext('2d');
            var chart = new Chart(ctx).Bar(barData);
            // return barData;
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



