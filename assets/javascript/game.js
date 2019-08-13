
$(document).ready(function() {

//Global variables, setup objects
var incrementor, gamePlaying, selection, enemyNo, enemyHPCont, enemyAPCont, playerAPCont, playerHPCont; 

var DOM = {   
    $imgCont: $(".image-container"),
    $enemyPop: $("#enemyPop"),
    $playerPop: $("#playerPop"),
    $ready: $("#ready"),
    $playBtn: $(".play"),
    $playPop: $("#play"),  
    $whatsNext: $(".whatsNext")
};

var setup = {
    init: function() {
            gamePlaying = false;
            selection = false;    
            enemyNo = 1;           
            $(".HP").each( function() {$(this).text(setup.getRandom(5, 20))});    
            $(".AP").each( function() {$(this).text(setup.getRandom(1, 5))});                  
            incrementor = [];  
            DOM.$imgCont.removeClass("activePlayer").removeClass("enemy-chosen").removeClass("enemy").appendTo("#allFruits"); 
            $("#winlose").empty(); 
            $(".attackText").text("attack");
            },
    delayInit:  function() { 
                setTimeout(function(){
                setup.init();
                }, 3000)},
        
    getRandom: function(x, y) {
                min = Math.ceil(x);
                max = Math.floor(y);
                return Math.floor(Math.random() * (max - min + 1)) + min; 
                },
    getValues: function() {
                enemyHPCont =  parseInt($(".enemy-chosen .HP").text());
                enemyAPCont = parseInt($(".enemy-chosen .AP").text()); 
                playerHPCont = parseInt($(".activePlayer .HP").text());
                playerAPCont = parseInt($(".activePlayer .AP").text()); 
                }
};
  
//Instruction popups
    DOM.$imgCont.on("mouseenter", function(){    
        if(!selection) {
            DOM.$playerPop.css({"visibility": "visible"});    
        } else if(!gamePlaying) {
            DOM.$enemyPop.css({"visibility": "visible"});    
        };     
    });

    DOM.$imgCont.on("mouseleave", function(){    
        if(!selection) {
            DOM.$playerPop.css({"visibility": "hidden"}); 
        } else if(!gamePlaying) {
            DOM.$enemyPop.css({"visibility": "hidden"}); 
        };          
    });

    DOM.$playBtn.on("mouseenter", function(){    
           DOM.$playPop.css({"visibility": "visible"}); 
    });

    DOM.$playBtn.on("mouseleave", function(){         
            DOM.$playPop.css({"visibility": "hidden"});      
    });

    //what's next button instructions for mobile devices
    DOM.$whatsNext.on("click", function(){
        if(!selection) {
            //display player popup for 2 seconds  
            DOM.$playerPop.css({"visibility": "visible"})          
                setTimeout(function(){
                    DOM.$playerPop.css({"visibility": "hidden"});
                }, 1500);
        } else if(!gamePlaying) {
            //display enemy popup for 2 seconds
            DOM.$enemyPop.css({"visibility": "visible"})          
                setTimeout(function(){
                    DOM.$enemyPop.css({"visibility": "hidden"});
                }, 1500);
        } else {
            //display play popup
            DOM.$playPop.css({"visibility": "visible"})          
                setTimeout(function(){
                    DOM.$playPop.css({"visibility": "hidden"});
                }, 3000);
        }        
    });

        
// Event listeners
    // choose player, move player to attack zone
    DOM.$imgCont.on("click", function(){
        if(!selection){            
            // $("#attackZone").css("background-color", "rgba(255, 255, 255, 0.5)");
            $(this).appendTo("#left-well");
            $(this).addClass("activePlayer");
            DOM.$imgCont.not(this).addClass("enemy");  
            DOM.$playerPop.css({"visibility": "hidden"}); 
            selection = true;       
            }
        });    

    //Choose enemy, move enemy to attack zone, change attack power to counter attack power, set values for battling variables
    DOM.$imgCont.on("click", function(){
        if(!gamePlaying && $(this).hasClass("enemy")){        
            DOM.$enemyPop.css({"visibility": "hidden"});
            $(this).appendTo("#right-well");
            $(this).addClass("enemy-chosen");
            $(this).removeClass("enemy");   
            $(".enemy-chosen .attackText").text("counter attack");
            gamePlaying = true;   
            setup.getValues();         
        } 
    });

    // * Whenever the player clicks `attack`, the game begins. 
    $(".btn-new").on("click", function(){
        if (gamePlaying) {               
            //check if lost, won, or tie first, so that upon attack, immediate win or lose, rather than lag of one round                   
            if((playerHPCont <= enemyAPCont) || playerHPCont === 0){   
                $("#winlose").text("You lose! Try again.");
                setup.delayInit();                             
            } else if((enemyHPCont <= playerAPCont) || enemyHPCont === 0){        
                $(".enemy-chosen").appendTo("#restZone");
                $(".enemy-chosen").removeClass("enemy-chosen");  
                enemyNo++ ;
                gamePlaying = false;
                //check if all enemies defeated
                if ($(".HP").length === enemyNo){
                   $("#winlose").text("You win!");
                   setup.delayInit();       
                };                       
            } else if((playerHPCont <= enemyAPCont) && (enemyHPCont <= playerAPCont)){  
                $("#winlose").text("It's a tie! Try again.");
                setup.delayInit(); 
            } else {
            //enemy-chosen HP loses points + update UI
            enemyHPCont -= playerAPCont;
            $(".enemy-chosen .HP").text(enemyHPCont);  

            //player loses HP + update UI
            playerHPCont -= enemyAPCont;
            $(".activePlayer .HP").text(playerHPCont);

            //player AP increases by base + update UI
            incrementor.push(playerAPCont);                
            playerAPCont = playerAPCont + incrementor[0];     
            $(".activePlayer .AP").text(playerAPCont);   
            }
        }
    });

// start game
setup.init();

  });
