import { Bot } from "mineflayer";

let bot: any;

export async function lookAtEntity(entity: any, force = false) {
    await bot.lookAt(entity.position.offset(0, entity.height, 0), force);
}
export async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
}
export const botStates = {
    following: false,
    looking: false,
    moving: false
}

export var kickCount = 0

export function runBackgroundTask(player: string, task: string, bot_name: string, player_list?: string[] | undefined, currentKickCount?: number | 0, reason_for_mute?: string | undefined, callbackID?: number | undefined) {
    if (!task) return;
    if (!player) return;
    if (!bot_name) return;
    if (!player_list) return;
    if (task == "mute") {
        bot.chat(`/mute ${player} Filtered by ${bot_name}`)
    }
    if (task == "spam kick" && player in player_list) {
        if (currentKickCount != 0) {
            if (kickCount != currentKickCount) {
                bot.chat(`/kick ${player} You've been kicked from the server, for the following reason: ${reason_for_mute}.`);
                kickCount++;
            }
        }
    }
    if (task == "STOP" && callbackID) {
        clearInterval(callbackID)
    }
}
