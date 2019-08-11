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

var healthPoints, attackPower, counterPoints, incrementor; 

var DOM = {
    $choice: $(".choice"),
    $imgCont: $(".image-container"),
    $popup: $("#popup"),
    $ready: $("#ready")
};

var DOMapple = {
    $HP: $("#apple-HP"),
    $AP: $("#apple-AP"),
    $CAP: $("#apple-CAP"),
};

var DOMwater = {
    $HP: $("#water-HP"),
    $AP: $("#water-AP"),
    $CAP: $("#water-CAP"),
};

var DOMgrape = {
    $HP: $("#grape-HP"),
    $AP: $("#grape-AP"),
    $CAP: $("#grape-CAP"),
};

var DOMlemon = {
    $HP: $("#lemon-HP"),
    $AP: $("#lemon-AP"),
    $CAP: $("#lemon-CAP"),
};

var setup = {
    init: function() {
            gamePlaying = false;
            appleHP = this.getRandomHP();
            appleAP = this.getRandomAP();
            waterHP = this.getRandomHP();
            waterAP = this.getRandomAP();
            grapeHP = this.getRandomHP();
            grapeAP = this.getRandomAP();
            lemonHP = this.getRandomHP();
            lemonAP = this.getRandomAP();
            DOMapple.$HP.text(appleHP); 
            DOMapple.$AP.text(appleAP); 
            DOMwater.$HP.text(waterHP); 
            DOMwater.$AP.text(waterAP);  
            DOMgrape.$HP.text(grapeHP);  
            DOMgrape.$AP.text(grapeAP); 
            DOMlemon.$HP.text(lemonHP);   
            DOMlemon.$AP.text(lemonAP);  
            incrementor = [];  
            DOM.$imgCont.removeClass("activePlayer").removeClass("enemy-chosen").removeClass("enemy").addClass("choice").appendTo("#allFruits");
            //add popup that bounces up and down until user makes selection
            },
    getRandomHP: function() {
                min = Math.ceil(5);
                max = Math.floor(20);
                return Math.floor(Math.random() * (max - min + 1)) + min; 
                },
    getRandomAP: function() {
                min = Math.ceil(1);
                max = Math.floor(5);
                return Math.floor(Math.random() * (max - min + 1)) + min; 
                },
}
  
DOM.$imgCont.on("click", function(){
    if($(this).hasClass("choice")){
        DOM.$imgCont.removeClass("choice");       
        $("#attackZone").css("background-color", "rgba(255, 255, 255, 0.5)");
        $(this).appendTo("#left-well");
        $(this).addClass("activePlayer");
        DOM.$imgCont.not(this).addClass("enemy");
        DOM.$popup.css({"visibility": "visible"});   
    }
});
    
//close popup, //on click of img with enemy class, that img gets enemy-chosen class, alert "ready to attack!"
DOM.$imgCont.on("click", function(){
    if(!gamePlaying && $(this).hasClass("enemy")){        
        DOM.$popup.css({"visibility": "hidden"});
        $(this).appendTo("#right-well");
        $(this).addClass("enemy-chosen");
        var APtext = $(".enemy-chosen").find(".AP-text");
        APtext.text("counter attack power");
        $(this).removeClass("enemy");        
        DOM.$ready.css({"visibility": "visible"}); 
        gamePlaying = true;        
    } 
});

// * Whenever the player clicks `attack`, their character damages the defender. The opponent will lose `HP` (health points). 
$(".btn-new").on("click", function(){
    if (gamePlaying) {
        DOM.$ready.css({"visibility": "hidden"});
        var enemyHP = $(".enemy-chosen").find(".HP");
        var enemyAP = $(".enemy-chosen").find(".AP");
        var playerHP = $(".activePlayer").find(".HP");
        var playerAP = $(".activePlayer").find(".AP"); 
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
            console.log(incrementor);
            playerAP.text(+playerAPCont + +incrementor[0]);

        } else if(playerHPCont <= 0) {
            alert("You lost!"); //change to popup
            setup.init();
        } else {
            $enemyChosen.appendTo("#restZone");
            $enemyChosen.removeClass("enemy-chosen");
            DOM.$popup.css({"visibility": "visible"});  
            gamePlaying = false;
        }
    }
})

setup.init();

  });
