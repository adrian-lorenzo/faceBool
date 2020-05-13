import { Platform } from "../models/platform.model";
import { Player } from "../models/player.model";


// TODO: creo que el detect de un controller no deberia de modificar el estado de nada
// solo deberia de devolver true o false
export class CollisionsController {
    detectionByRectangles(player: Player, platforms: Array<Platform>) {
        for (const platform of platforms) {
            if (player.pointBox.x > platform.pointBox.x + platform.widthBox ||
                player.pointBox.x + player.widthBox < platform.pointBox.x ||
                player.pointBox.y > platform.pointBox.y + platform.heightBox ||
                player.pointBox.y + player.heightBox < platform.pointBox.y) {
                platform.changeColor("blank");
                // player.canJump = false; Esto da error, no permite mover al jugador (el cuadrao con el sirculo)
                // if (platforms.length === 1) console.log("no colision")
                continue;
            }
            // if (platforms.length === 1) console.log("colision")
            platform.changeColor("red");
            if (player.pointBox.y < platform.pointBox.y &&
                (
                    (player.pointBox.x > platform.pointBox.x && player.pointBox.x < platform.pointBox.x + platform.widthBox) ||
                    (player.pointBox.x + player.widthBox > platform.pointBox.x && player.pointBox.x + player.widthBox < platform.pointBox.x + platform.widthBox)
                )
            ) {
                player.canJump = true;
                player.pointBox.y = platform.pointBox.y - player.heightBox;
                player.position.y = platform.pointBox.y - player.mass / 2;
            } else {
                player.velocity.y *= -1;
            }
            break;
        }
    }
}