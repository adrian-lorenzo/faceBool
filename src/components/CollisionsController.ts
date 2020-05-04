import { Level } from "./Level";
import { Player } from "./Player";

export class CollisionsController {
    detectionByRectangles(player:Player, level:Level){
        for (const paltaform of level.getPlataforms()) {
            if (player.pointBox.x > paltaform.pointBox.x   + paltaform.widthBox    || 
                player.pointBox.x + player.widthBox  < paltaform.pointBox.x || 
                player.pointBox.y > paltaform.pointBox.y   + paltaform.heightBox   ||
                player.pointBox.y + player.heightBox < paltaform.pointBox.y) {
                paltaform.changeColor("blank");
                player.canJump = false;
                continue;
            }
            paltaform.changeColor("red");
            if(player.pointBox.y < paltaform.pointBox.y && 
                (
                    (player.pointBox.x > paltaform.pointBox.x && player.pointBox.x < paltaform.pointBox.x + paltaform.widthBox) ||
                    (player.pointBox.x + player.widthBox > paltaform.pointBox.x && player.pointBox.x + player.widthBox < paltaform.pointBox.x + paltaform.widthBox)
                )
            ){
                player.canJump = true;
                player.pointBox.y = paltaform.pointBox.y - player.heightBox;
                player.position.y = paltaform.pointBox.y - player.mass/2;
            } else {
                player.velocity.y *= -1;
            }
            break;
        }
    }
}