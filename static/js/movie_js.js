function format_time(var_ctime){
    let minutes = Math.floor(var_ctime / 60);
    let seconds = Math.floor(var_ctime - minutes * 60)
    let x = minutes < 10 ? "0" + minutes : minutes;
    let y = seconds < 10 ? "0" + seconds : seconds;
    let format = x + ":" + y;
    return format
};
const movie_id = document.getElementById('movie_id').innerHTML;
const session = document.getElementById('session').innerHTML;
const movie_name = document.getElementById('movie_name').innerHTML;
const description = document.getElementById('description').innerHTML;
const genre = document.getElementById('genre').innerHTML;
const rated = document.getElementById('rated').innerHTML;
const m_year = document.getElementById('m_year').innerHTML;


if (document.querySelector('.vjs-title-bar') != null){
document.querySelector('.vjs-title-bar').classList.remove('vjs-hidden');
document.querySelector('.vjs-title-bar').classList.add('fade-out');
}
let player = videojs('my-video');
player.hotkeys({
    volumeStep: 0.1,
    seekStep: 5
});
let SeekBar = videojs.getComponent('SeekBar');


overlay_content = `<div style="padding-left:20px; text-align:left">
                        <p style="color:#9a9a9a;">You are Watching</p>
                        <span style="font-size:48px; letter-spacing: 2px;"><b>`+movie_name+`</b></span>
                        <br>
                        <p style='font-style:italic;'>`+m_year+` ● `+genre+`<p>
                        <p style="width:200%;">`+description+`
                  </div>`;
player.overlay({
  overlays: [{
    start: 'loadstart',
    content: overlay_content,
    end: 'playing',
    align: 'left',
    showBackground:false,
  }, {
    start: 'pause',
    content: overlay_content,
    end: 'playing',
    align: 'left',
    showBackground:false,
    attachToControlBar:true,
    }]
});



var current_time, is_playing, is_bar_dragged;
var ini_cur_time;

async function reloaded(){
    let sync_control_func = await fetch('/fetch_db/'+movie_id+'/'+session);
    sync_control = await sync_control_func.json();
    data = sync_control.control_dict;
    ini_cur_time = data['cur_time'];
    player.currentTime(data['cur_time']);
}
reloaded();

fetch('/set_db/'+movie_id+'/'+'False/False'+'/'+ini_cur_time+'/'+ session);

const interval = setInterval(async function() {
   let sync_control_func = await fetch('/fetch_db/'+movie_id+'/'+session);
   sync_control = await sync_control_func.json();
   data = sync_control.control_dict;

//   console.log(data);
   cur_time_str = data['cur_time'];
   is_playing_str = data['is_playing'];
   is_bar_dragged_str = data['is_bar_dragged']

    if (Math.abs(parseFloat(player.currentTime()) - parseFloat(cur_time_str)) > 10.0){
        player.pause();
        await new Promise(r => setTimeout(r, 500));
        player.play();
    }
    if (is_playing_str == 'False'){
        player.pause();

            player.currentTime(cur_time_str);

    }
    else{

        if (is_bar_dragged_str == 'True' ){
            player.currentTime(cur_time_str);
            player.play();
            console.text(player.paused())
        }
        else{
            if (player.paused){
                player.play();;
            }
        }
    }

 }, 1500);


SeekBar.prototype.getPercent = function getPercent() {
    const time = this.player_.currentTime()
    const percent = time / this.player_.duration()
    return percent >= 1 ? 1 : percent
}

SeekBar.prototype.handleMouseMove = function handleMouseMove(event) {
    let newTime = this.calculateDistance(event) * this.player_.duration()
    if (newTime === this.player_.duration()) {
        newTime = newTime - 0.1
    }
    this.player_.currentTime(newTime);
    this.update();
    is_bar_dragged = true;
    let currentTime = player.currentTime();
    move_ctime = format_time(currentTime);
    player.controlBar.currentTimeDisplay.el_.innerHTML = move_ctime;
    console.log('Update=>'+ move_ctime)
    fetch('/set_db/'+movie_id+'/'+is_playing+'/'+is_bar_dragged+'/'+currentTime+'/'+ session);
}


videojs('my-video').ready(function(){
    var myPlayer = this;

//    if (document.querySelector('.olay-obj').classList.contains('vjs-hidden')){
//    console.log('yes');
//    }
//    myPlayer.on('timeupdate',function(){
//        console.log(myPlayer.currentTime());
//    });

    myPlayer.on("play", function() {
            is_playing = true;
            is_bar_dragged = false;
            myPlayer.on('timeupdate',function(){
                current_time = myPlayer.currentTime();
            });
            play_ctime = format_time(current_time);
            if (play_ctime == 'NaN:NaN'){
                current_time = 0;
                play_ctime = '00:00';

            }

            var styles = `video[poster]{
                            filter: blur(0px);
                           }`
            var styleSheet = document.createElement("style")
            styleSheet.innerText = styles
            document.head.appendChild(styleSheet)

            console.log(is_playing + '=>'+play_ctime);

            document.querySelector('.vjs-title-bar').classList.add('vjs-hidden');

            fetch('/set_db/'+movie_id+'/'+is_playing+'/'+is_bar_dragged+'/'+current_time+'/'+ session);
//            console.log('triggered:\n'+ '/set_db/'+movie_id+'/'+is_playing+'/'+play_ctime+'/'+ session)

    });

    myPlayer.on("pause", function() {
            is_playing = false;
            is_bar_dragged = false;
            current_time = myPlayer.currentTime();
            paused_ctime = format_time(current_time);
            console.log(is_playing + '=>'+paused_ctime);

//            vjs-title-bar
            var styles = `video[poster]{
                            filter: blur(4px)
                           }`
            var styleSheet = document.createElement("style")
            styleSheet.innerText = styles
            document.head.appendChild(styleSheet)
            document.querySelector('.vjs-title-bar').classList.remove('vjs-hidden');
            document.querySelector('.vjs-title-bar').classList.add('fade-out');
            document.getElementById('vjs-title-bar-title-28').innerHTML = rated;

            fetch('/set_db/'+movie_id+'/'+is_playing+'/'+is_bar_dragged+'/'+current_time+'/'+ session);
//            console.log('triggered:\n'+ '/set_db/'+movie_id+'/'+is_playing+'/'+paused_ctime+'/'+ session)
    });

});


//var player = videojs('player_example_1);
//player.nuevo({
//logo: '//domain.com/path/to/logo.png.
//logourl: '//domain.com',
//});
//player.hotkeys({
//volumeStep: 0.1,
//seekStep: 5
//});
//);