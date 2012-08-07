$(document).ready(function() {
    enablePlayerControls();
    loadMovies();
    loadXbmcShows();
    loadNowPlaying();

    $.get('/xbmc/Servers', function (data) {
        if (data==null) return;
        var servers = $('<select>').change(function() {
             $.get('/xbmc/Servers?server='+$(this).val(), function (data) {
                notify('XBMC','Server change '+data,'info');
                $('#movie-grid').empty();
                allMoviesLoaded = false;
                loadMovies();
                $('#show-grid').empty();
                allShowsLoaded = false;
                loadXbmcShows();
             });
        });
        $.each(data.servers, function (i, item) {
            var server = $('<option>').text(item).val(item);
            servers.append(server);
        });
        servers.val(data.current);
        $('#servers').append(servers);
    }, 'json');

    $(document).keydown(function (e) {
        arrow = {8: 'Back', 13: 'Select', 37: 'Left', 38: 'Up', 39: 'Right', 40: 'Down'};
        command = arrow[e.which];
        if (command) {
            e.preventDefault();
            xbmcControl(command);
        }
    });
    $('#xbmc-notify').click(function () {
        msg = prompt("Message");
        if (msg) sendNotification(msg);
    });
    $('#xbmc-restart').click(function () {
        $.get('/xbmc/System?action=Reboot', function(data){
            notify('Reboot','Rebooting...','warning');
        });
    });
    $('#xbmc-shutdown').click(function () {
        $.get('/xbmc/System?action=Suspend', function(data){
            notify('Shutdown','Shutting down...','warning');
        });
    });
    $('#xbmc-wake').click(function () {
        $.get('/xbmc/Wake', function(data){
            notify('Wake','Sending WakeOnLan packet...','warning');
        });
    });
    $('#back-to-shows').click(function () {
        $('#show-details').hide();
        $('#show-grid').show();
    });
    $.get('/xbmc/Subtitles', function (data) {
        if (data==null) return;
        current = data.currentsubtitle.index;
        if (data.subtitleenabled==false) current = 'off';
        var subtitles = $('#subtitles').empty();
        $.each(data.subtitles, function (i, item) {
            var link = $('<a>').attr('href','#').text(item.name).click(function(e) {
                e.preventDefault();
                $.get('/xbmc/Subtitles?subtitle='+item.index, function (data) {
                    notify('Subtitles','Change successful','info');
                });
            });
            if (item.index==current) link.prepend($('<i>').addClass('icon-ok'));
            subtitles.append($('<li>').append(link));
        });
    }, 'json');
    $.get('/xbmc/Audio', function (data) {
        if (data==null) return;
        current = data.currentaudiostream.index;
        var audio = $('#audio').empty();
        $.each(data.audiostreams, function (i, item) {
            var link = $('<a>').attr('href','#').text(item.name).click(function(e) {
                e.preventDefault();
                $.get('/xbmc/Audio?audio='+item.index, function (data) {
                    notify('Audio','Change successful','info');
                });
            });
            if (item.index==current) link.prepend($('<i>').addClass('icon-ok'));
            audio.append($('<li>').append(link));
        });
    }, 'json');
    $('#btn-clean-video-lib').click(function () {
        xbmcClean('video');
    });
    $('#btn-scan-video-lib').click(function () {
        xbmcScan('video');
    });
    $('#btn-clean-audio-lib').click(function () {
        xbmcClean('audio');
    });
    $('#btn-scan-audio-lib').click(function () {
        xbmcScan('audio');
    });

    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() >= $(document).height() - 10) {
            if ($('#movies').is(':visible')) {
                loadMovies({
                    sortorder: $('.active-sortorder').attr('data-sortorder'),
                    sortmethod: $('.active-sortmethod').attr('data-sortmethod')
                });
            }
            if ($('#shows').is(':visible')) {
                loadXbmcShows();
            }
        }
    });
    $('[data-sortmethod]').click(function () {
        $('#movie-grid').html('');
        lastMovieLoaded = 0;
        allMoviesLoaded = false;
        var clickItem = $(this);
        $('.active-sortmethod i').remove();
        $('.active-sortmethod').removeClass('active-sortmethod');
        clickItem.addClass('active-sortmethod').prepend($('<i>').addClass('icon-ok'));
        loadMovies({
            sortorder: $('.active-sortorder').attr('data-sortorder'),
            sortmethod: $('.active-sortmethod').attr('data-sortmethod')
        });
    });
    $('[data-sortorder]').click(function () {
        $('#movie-grid').html('');
        lastMovieLoaded = 0;
        allMoviesLoaded = false;
        var clickItem = $(this);
        $('.active-sortorder i').remove();
        $('.active-sortorder').removeClass('active-sortorder');
        clickItem.addClass('active-sortorder').prepend($('<i>').addClass('icon-ok'));
        loadMovies({
            sortorder: $('.active-sortorder').attr('data-sortorder'),
            sortmethod: $('.active-sortmethod').attr('data-sortmethod')
        });
    });
});
