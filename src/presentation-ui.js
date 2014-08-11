(function() {
    var $searchForm = $('.search-song');
    var $selectForm = $('.select-song');
    var $analyzeForm = $('.analyze-form');

    $searchForm.on('submit', function(e) {
        e.preventDefault();

        var input = $('#input').val();
        bl.searchForSongs(input);

    });

    $selectForm.on('submit', function(e) {
        e.preventDefault();

        var selection = $('input[name=song]:checked').val();
        bl.addSong(selection);
        $selectForm.hide();
        $('#input').val('');
    });

    $analyzeForm.on('submit', function(e) {
        e.preventDefault();
        var songIds = $('.analyze-form ul li').map(function (index, elem) {
            return $(elem).data('id');
        });
        console.log(songIds);
        bl.analyzeSongs(songIds)
         // $(".analyze-button").on('click', function(e) {
            $(".searchformbox").hide();
            $(".analyze-form-box").hide();
         //    });    
        
    });

    $('.comments').on('click', function(e) {
        e.preventDefault();
        var song = $('input[name=song]:checked').val();
        bl.sendSong(song);

    })



// $('.analyze ul li').map(function (idx, elem) { return $(elem).data('id') })
// [158827653, 119190675]


})();

