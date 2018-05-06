
// var pS= new pageSwitch('pageAll', {
//         direction:'horizontal',
//         easing:'ease-in',
//         duration:300,
//         autoPlay:true,
//         loop:'false',
//         interval: 5000
//     });

var pS = new pageSwitch('pageAll', {
            duration: 1000,
            //int, page switch time

            direction: 0,
            //int, page switch direction，0-horizental，1-verticle

            start: 0,
            //int, default display page

            loop: true,
            //bool, rolling display or not

            ease: 'ease',
            //string|function Transition curve animation，details in below

            transition: 'scroll',
            //string|function, transition mode

            freeze: false,
            //bool, freeze the page or not（no response to the user after freezing，defreeze with  `.freeze(false)`）

            mouse: true,
            //bool, use mouse or not

            mousewheel: false,
            //bool, use mouse wheel or not

            arrowkey: false,
            //bool, use keyboard arrow or not

            autoplay: true,   
            //bool, aotuplay or not
            
            interval: 5000
            //bool, time interval of each page
});

    //action
    /* Interface
    *  showContent(obj) : obj is the name of the id you want show. ex: showContent('hiddenContent')
    *  hideContent(obj) : obj is the name of the id you want hide. ex: hideContent('hiddenContent')
    *  jumpContent(obj,img): obj is the name of the id you want jump out. img is the name of the staff you want cover. ex:jumpContent('jumpContent','image')
    *  jumpBack(obj,img): obj is the name of the id you want jump out. img is the name of the staff you want cover. ex:jumpBack('jumpContent','image')
    */
    function showContent(obj){
        $("#"+obj).fadeIn("slow");
    }
    function hideContent(obj){
        $("#"+obj).fadeOut("slow");
    }

    //fontsize: text size, 
    //vh:special unit，1% of window height ，
    //vw: special unit，1% of window width

    //this is the funciton that control jump animation when user click on the picture in the Rolling Screen
        var win_width = $("#"+img).width();
        $("#"+obj).animate({opacity: 0.9,height: win_height+"px",width:win_width+"px",top:0 +"px",left:0 +"px",fontSize:"3vh"},"fast");
        $("#"+obj).fadeIn(100);
        pS.pause();
	}

    //this is the funciton that control jump back animation when user click on the content in the Rolling Screen
    function jumpBack(obj,img){
        var win_height = $("#"+img).height();
        var win_width = $(window).width();
        $("#"+obj).animate({opacity: 0,height: 0+"px",width:0+"px",top:0.5*win_height+"px",left:0.5*win_width+"px" ,fontSize:"3vh"},"fast");
        pS.play();
    }
