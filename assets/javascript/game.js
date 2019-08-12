// When the game starts, the player will choose a character by clicking on the fighter's picture. The player will fight as that character for the rest of the game.

// * The player must then defeat all of the remaining fighters. Enemies should be moved to a different area of the screen.

// * The player chooses an opponent by clicking on an enemy's picture.

// * Once the player selects an opponent, that enemy is moved to a `defender area`.

// * The player will now be able to click the `attack` button.
//   * Whenever the player clicks `attack`, their character damages the defender. The opponent will lose `HP` (health points). These points are displayed at the bottom of the defender's picture. 
//   * The opponent character will instantly counter the attack. When that happens, the player's character will lose some of their `HP`. These points are shown at the bottom of the player character's picture.

// 3. The player will keep hitting the attack button in an effort to defeat their opponent.

// * When the defender's `HP` is reduced to zero or below, remove the enemy from the `defender area`. The player character can now choose a new opponent.

// 4. The player wins the game by defeating all enemy characters. The player loses the game the game if their character's `HP` falls to zero or below.

// ##### Option 2 Game design notes

// * Each character in the game has 3 attributes: `Health Points`, `Attack Power` and `Counter Attack Power`.

// * Each time the player attacks, their character's Attack Power increases by its base Attack Power. 
// * For example, if the base Attack Power is 6, each attack will increase the Attack Power by 6 (12, 18, 24, 30 and so on).
// * The enemy character only has `Counter Attack Power`. 

// * Unlike the player's `Attack Points`, `Counter Attack Power` never changes.

// * The `Health Points`, `Attack Power` and `Counter Attack Power` of each character must differ.

// * No characters in the game can heal or recover Health Points. 

// * A winning player must pick their characters wisely by first fighting an enemy with low `Counter Attack Power`. This will allow them to grind `Attack Power` and to take on enemies before they lose all of their `Health Points`. Healing options would mess with this dynamic.

// * Your players should be able to win and lose the game no matter what character they choose. The challenge should come from picking the right enemies, not choosing the strongest player.


$(document).ready(function() {

//Global variables, setup objects
var incrementor, gamePlaying, selection, enemyNo; 

var DOM = {   
    $imgCont: $(".image-container"),
    $enemyPop: $("#enemyPop"),
    $playerPop: $("#playerPop"),
    $ready: $("#ready"),
    $playBtn: $(".play"),
    $playPop: $("#play")
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
}
  
//Instruction popups
    DOM.$imgCont.on("mouseenter", function(){    
        if (!selection) {
            DOM.$playerPop.css({"visibility": "visible"});    
        } else if(!gamePlaying) {
            DOM.$enemyPop.css({"visibility": "visible"});    
        };     
    });

    DOM.$imgCont.on("mouseleave", function(){    
        if (!selection) {
            DOM.$playerPop.css({"visibility": "hidden"}); 
        } else if (!gamePlaying) {
            DOM.$enemyPop.css({"visibility": "hidden"}); 
        };          
    });

    DOM.$playBtn.on("mouseenter", function(){    
           DOM.$playPop.css({"visibility": "visible"}); 
    });

    DOM.$playBtn.on("mouseleave", function(){         
            DOM.$playPop.css({"visibility": "hidden"});      
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
    

    //Choose enemy, move enemy to attack zone, change attack power to counter attack power
    DOM.$imgCont.on("click", function(){
        if(!gamePlaying && $(this).hasClass("enemy")){        
            DOM.$enemyPop.css({"visibility": "hidden"});
            $(this).appendTo("#right-well");
            $(this).addClass("enemy-chosen");
            var APtext = $(".enemy-chosen").find(".AP-text");
            APtext.text("counter attack power");
            $(this).removeClass("enemy");   
            gamePlaying = true;        
        } 
    });

    // * Whenever the player clicks `attack`, the game begins. 
    $(".btn-new").on("click", function(){
        if (gamePlaying) {       
            var enemyHP = $(".enemy-chosen .HP");
            var enemyAP = $(".enemy-chosen .AP");
            var playerHP = $(".activePlayer .HP");
            var playerAP = $(".activePlayer .AP"); 
            var enemyHPCont =  enemyHP.text();
            var enemyAPCont = enemyAP.text(); 
            var playerHPCont = playerHP.text();
            var playerAPCont = playerAP.text(); 
            var $enemyChosen = $(".enemy-chosen");   

            if (enemyHPCont >= 0 && playerHPCont >= 0) {
                //enemy-chosen HP loses points
                enemyHP.text(enemyHPCont - playerAPCont);
                //counterattack popup
                //player loses HP
                playerHP.text(playerHPCont - enemyAPCont);
                //player AP increases by base
                incrementor.push(playerAPCont);         
                playerAP.text(+playerAPCont + +incrementor[0]);

            } else if(playerHPCont <= 0) {
                $("#winlose").text("You lose! Try again.");
                setup.delayInit();                 
            } else {
                $enemyChosen.appendTo("#restZone");
                $enemyChosen.removeClass("enemy-chosen");  
                enemyNo++ ;
                gamePlaying = false;
                if ($(".HP").length === enemyNo){
                   $("#winlose").text("You win!");
                   setup.delayInit();       
                };                       
            }
        }
    });

// start game
setup.init();

  });
