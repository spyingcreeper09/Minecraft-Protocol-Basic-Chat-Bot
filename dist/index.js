if (process.argv.length > 7) {
    console.log(`That's too many arguments! :( \nThe proper way to use this script is: node ${process.argv[1]} [server IP] [on/off for Slow Mode] (optional: [server port] [name] [version])`);
    process.exit(1);
}
if (process.argv.length < 4) {
    console.log(`Oh hi! You must be new :)\nThe proper way to use this script is the following:\n node ${process.argv[1]} [server IP] [on/off for Slow Mode] (optional: [server port] [name] [version])`);
    process.exit(1);
}
'use strict';
console.log("Loading Mineflayer...");
import { createBot } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import { sleep, botStates } from "./helper.js";
import * as os from 'node:os';
const { pathfinder, Movements, goals } = pathfinderPkg;
const botName = process.argv[5] ? process.argv[5] : "Robo";
const serverIp = process.argv[2];
const serverPort = process.argv[3] ? process.argv[3] : 25565;
const prefix = '.';
const version = process.argv[6] ? process.argv[6] : "1.18.2";
const owner = "SonicandTailsCD";
const user_skin_name = "Flaphi_";
const default_countdown_length = 5;
const seconds_countdown_limit = 120;
let hash;
let exitHash;
let goal;
let player;
let SlowMode;
let default_wait_time;
if (process.argv[4] == "on") {
    SlowMode = true;
    default_wait_time = 450;
}
else if (process.argv[4] == "ON") {
    SlowMode = true;
    default_wait_time = 450;
}
else if (process.argv[4] == "off") {
    SlowMode = false;
    default_wait_time = 100;
}
else if (process.argv[4] == "OFF") {
    SlowMode = false;
    default_wait_time = 100;
}
else {
    console.log(`After the server port and before the bot's name, please type in between the two: "on" or "off" if you want Slow Mode on. The bot will not run without this setting :)\nWhy am I now requiring a Slow Mode toggle? Most inexperienced users use slow or high-latency Wi-Fi, which if you use ${botName} in Normal Mode, the server may treat ${botName}'s messages as spam and may get you banned if you use this bot in AntiCheat-enabled servers.\nIf you don't know what's your server's port, most likely it is 25565. Try it! Type "node ${process.argv[1]} ${process.argv[2]} ${process.argv[3] ? process.argv[3] : "25565"} on" :)`);
    process.exit(2);
}
console.log("Joining server...");
const options = {
    host: serverIp,
    port: serverPort,
    username: botName,
    version: version
};
const bot = createBot(options);
bot.loadPlugin(pathfinder);
function generateRandomCode(length) {
    let characters = 'abcdefghimnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}
async function onSpawn() {
    console.log(`${botName} successfully connected to the server ${serverIp}:${serverPort}`);
    hash = generateRandomCode(12);
    exitHash = generateRandomCode(20);
    console.log(`Hash: ${hash}\nAdmin exit hash: ${exitHash}`);
    runGreeting();
    bot.on("chat", async (name, message) => {
        if (name == botName)
            return;
        if (message == `Close yourself. My admin hash is ${exitHash}`) {
            bot.chat(`Ok ${name} :D`);
            process.exit(127);
        }
        if (message == "?") {
            console.log(`[Chat] ${name}: ${message}`);
            return;
        }
        if (message == "Robo?") {
            bot.chat(`Yes, ${name}? :)`);
        }
        if (message == `${prefix}specs sensitive show ${hash}`) {
            bot.chat(`/tellraw @a [{"text": "From what I see here:\\n"}, {"text": "The OS I'm running on is ${os.platform()} ${os.type()}!\\n"}, {"text": "Available free memory for Robo to use: ${os.freemem() / 1024 / 1024}MB\\n"}, {"text": "CPU cores available for all processes: ${os.cpus().length}\\n"}, {"text": "My OS' hostname: ${os.hostname()}\\n"}, {"text": "CPU architecture: ${os.arch()}"}, {"text": "Uptime of this PC: ${os.uptime()}"}, {"text": "&2Robo&r: That's all I can say :)"}]`);
        }
        console.log(`[Chat] ${name}: ${message}`);
        if (message.charAt(0) == prefix) {
            const words = message.trim().split(/\s+/);
            const command = words.shift();
            if (command == undefined)
                return;
            const commandName = command.replace(prefix, "");
            const args = words;
            hash = await handleCommand(name, commandName, args, hash);
        }
    });
}
const publicCommands = [
    "countdown",
    "validate",
    "help"
];
async function handleCommand(username, commandName, args, hash) {
    console.log(`[Debug] Command: ${commandName}`);
    if (publicCommands.includes(commandName)) {
        console.log(`Public command used: ${commandName}`);
        switch (commandName) {
            case 'help':
                if (botStates.reciting.help) {
                    bot.chat(`/t ${username} I've already told everyone my commands, please wait 60 seconds. :)`);
                    break;
                }
                ;
                botStates.reciting.help = true;
                bot.chat("I can run these commands:");
                await sleep(default_wait_time);
                bot.chat("&2For all players&r:");
                await sleep(default_wait_time);
                bot.chat(".countdown [optional message] - I count down from 3 to 0. Type a message after the command and I'll speak it when I'm done.");
                await sleep(default_wait_time);
                bot.chat(".help - well of course, this help");
                await sleep(default_wait_time);
                bot.chat(".validate [hash] - Validates any hash &4(BEWARE! This will make a new hash!)");
                await sleep(default_wait_time);
                bot.chat(`&4Only for ${owner} or for people who have my hash&r:`);
                await sleep(default_wait_time);
                bot.chat(".cloop [ms] [command] - Runs any command in a loop. Set the first argument to the milisecond loop time :)");
                await sleep(default_wait_time);
                bot.chat(".cspy [optional ON/OFF] - enable or disable my command spying abilities");
                await sleep(default_wait_time);
                bot.chat(".echo [message] - Repeat back a word... or many :P");
                await sleep(default_wait_time);
                bot.chat(".filter: [args] - Ban a player, &4hardcore&r-like method!");
                await sleep(default_wait_time);
                bot.chat(".follow [username] - I will follow a player of your choice, &4using advanced pathfinding that may or may not get me and you banned)");
                await sleep(default_wait_time);
                bot.chat(".pathfind [x] [y] [z] - Calculate and go to a specific location (&4WARNING: I run on a not-so-beastly PC and this WILL LAG!!!)");
                await sleep(default_wait_time);
                bot.chat(".selfcare - Ensures I'm an operator and sets me in Creative");
                await sleep(default_wait_time);
                bot.chat(".stop [following, pathfinding, filter] - Stop the action that my owner told me to");
                await sleep(default_wait_time);
                bot.chat(".tpowner - Self-explanatory!");
                await sleep(default_wait_time);
                bot.chat("I think that explains it all :)");
                await sleep(60000);
                botStates.reciting.help = false;
                break;
            case 'countdown':
                if (args.length != 0) {
                    let countdown_length = args.shift();
                    if (typeof countdown_length == 'number') {
                        if (countdown_length > seconds_countdown_limit) {
                            bot.chat(`Say what now?? ${countdown_length} seconds?! Sorry, I don't want to count from ${countdown_length} to 0, that's boring :)`);
                            break;
                        }
                        await sleep(1000);
                        for (countdown_length > 0; countdown_length--;) {
                            bot.chat(`${countdown_length}...`);
                            await sleep(1000);
                        }
                        bot.chat(`${args.join(" ")}`);
                    }
                    else {
                        let counting = default_countdown_length;
                        for (counting > 0; counting--;) {
                            bot.chat(`${counting}...`);
                            await sleep(1000);
                        }
                        bot.chat(`${countdown_length} ${args.join(" ")}`);
                    }
                }
                else {
                    let counting = default_countdown_length;
                    for (counting > 0; counting--;) {
                        bot.chat(`${counting}...`);
                        await sleep(1000);
                    }
                    bot.chat('Now go! :D');
                }
                break;
            case 'validate':
                const inputHash = args.pop();
                if (hash == inputHash) {
                    bot.chat(`${inputHash} &2is a valid hash! :)`);
                    hash = generateRandomCode(12);
                    console.log(`New hash: ${hash}`);
                }
                else {
                    bot.chat(`${inputHash} &4isn't a valid hash :(`);
                }
                break;
        }
        return hash;
    }
    else {
        const inputHash = args.pop();
        console.log(`[Debug] Input hash: ${inputHash}\n[Debug] Current hash: ${hash}`);
    }
    const inputHash = args.pop();
    if (inputHash === hash) {
        console.log(`[Debug] Command used: ${commandName}`);
        switch (commandName) {
            case 'commandspy':
                if (args.length = 0) {
                    bot.chat("/cspy");
                }
                else {
                    bot.chat(`/cspy ${args[0]}`);
                }
                break;
            case 'selfcare':
                if (args.length == 0) {
                    bot.chat('/op @s[type=player]');
                    await sleep(200);
                    bot.chat('/gmc');
                    await sleep(200);
                }
                else {
                    bot.chat('Invalid arguments for selfcare command. Usage: !selfcare');
                }
                break;
            case 'stop':
                if (args.length == 0) {
                    bot.chat("Stop what? :)");
                    console.log(`Hint: type "!stop following" or "!stop pathfinding"!`);
                }
                else if (args.length > 2) {
                    bot.chat("That's too many words, I don't understand :(");
                    console.log(`Hint: type "!stop following" or "!stop pathfinding"!`);
                }
                else {
                    bot.chat(await stop(args[0], args[1] ? args[1] : undefined));
                }
                break;
            case 'echo':
                if (args.length != 0) {
                    bot.chat(args.join(" "));
                }
                else {
                    bot.chat('Invalid arguments for echo command. Usage: !echo <phrase to echo>');
                }
                break;
            case "filter:":
                if (args.length == 0) {
                    bot.whisper(username, "I can't filter a player if not told which!");
                }
                else if (args.length == 1) {
                    bot.whisper(username, "Ok, you've given me a player name, but what do you want me to do to them? :)");
                }
                else if (args.length == 2 && args[0] == "hardcore_ban") {
                    var callbackID = setInterval(() => runBackgroundTask(args[0], botName, args[1]), 500);
                    console.log(`${callbackID} is your callback ID for this mute. Don't forget it, because if you do, you'll have to restart the bot to clear filters!`);
                }
                break;
            case 'tpowner':
                bot.chat(`/tp ${botName} ${username}`);
                console.log(`${botName} teleported to ${username}.`);
                bot.setControlState('back', true);
                sleep(500);
                bot.setControlState('back', false);
                break;
            case 'pathfind':
                if (botStates.following) {
                    bot.chat("I can't pathfind when I'm following someone! :(");
                    break;
                }
                else if (botStates.moving) {
                    bot.chat("Please wait! I'm still pathfinding :(");
                    break;
                }
                else {
                    bot.chat("Coming! :D");
                    bot.setControlState('sprint', true);
                    botStates.moving = true;
                    goal = new goals.GoalGetToBlock(args[0], args[1], args[2]);
                    await bot.pathfinder.goto(goal);
                    break;
                }
            case 'follow':
                bot.setControlState("sprint", true);
                botFollowPlayer(username, 2);
                break;
            case 'cloop':
                setInterval(() => runBackgroundTask("command_loop", botName, undefined, args[0], args.join(" ")), args[0]);
            default:
                bot.chat(`${commandName} isn't a command :()`);
        }
        const newhash = generateRandomCode(12);
        console.log(`New hash: ${newhash}`);
        return newhash;
    }
    else if (inputHash != hash) {
        bot.chat("Invalid hash! :(");
        return hash;
    }
    else {
        bot.chat("That's not a command! :(");
        return hash;
    }
}
async function botFollowPlayer(username, range) {
    player = bot.players[username];
    if (botStates.following) {
        bot.chat("I'm already following! :(");
        return;
    }
    if (botStates.moving) {
        bot.chat("I can't follow when I'm pathfinding! :(");
        return;
    }
    botStates.following = true;
    if (!player?.entity) {
        bot.chat(`${username}, I can't see you! :(`);
        botStates.following = false;
        return;
    }
    while (botStates.following) {
        try {
            if (bot.entity.position.distanceTo(player.entity.position) + 0.15 <= range) {
                await lookAtEntity(player.entity, true);
                botStates.looking = true;
                bot.setControlState('sprint', false);
            }
            else {
                botStates.looking = false;
                bot.setControlState('sprint', true);
            }
            await sleep(200);
            const goal = new goals.GoalFollow(player.entity, range);
            await bot.pathfinder.goto(goal);
        }
        catch (err) {
            console.log(String(err?.message));
            bot.chat(`Sorry, I'm unable to follow :( (${String(err?.message)})`);
            return;
        }
    }
}
bot.once('spawn', onSpawn);
async function runBackgroundTask(task, bot_name, player, ms, command) {
    if (!task)
        return;
    if (!player)
        return;
    if (!bot_name)
        return;
    if (task == "hardcore_ban") {
        bot.chat(`/mute ${player} Filtered by ${bot_name}! >:)`);
        await sleep(default_wait_time);
        bot.chat(`/deop ${player}`);
        await sleep(default_wait_time);
        bot.chat(`/gamemode spectator ${player}`);
        await sleep(default_wait_time);
        return;
    }
    if (task == "command_loop") {
        console.log("It's running.");
        command?.replace(`${ms} `, "");
        bot.chat(`/${command}`);
        return;
    }
}
async function runGreeting() {
    await sleep(2000);
    bot.chat("/extras:prefix &l&a[&#006400Bots&r&f&l&a]");
    await sleep(default_wait_time);
    bot.chat(`&2Helloo!! I'm online and ready for work, owner and creator &3${owner}&2 :)`);
    await sleep(default_wait_time);
    bot.chat("/cspy on");
    await sleep(default_wait_time);
    bot.chat(`/sudo ${owner} prefix &2[${botName}'s owner]&r`);
    await sleep(default_wait_time);
    bot.chat(`/skin ${user_skin_name}`);
    await sleep(1200);
    bot.chat(`/sudo ${owner} skin ${user_skin_name}`);
    await sleep(default_wait_time);
    bot.chat(`/tag ${botName} add netmsg`);
    await sleep(800);
    bot.chat(`/sudo ${owner} tag ${owner} add netmsg_Kaboom`);
    await sleep(800);
    bot.chat(`/tag ZenDev add netmsg`);
}
async function lookAtEntity(entity, force = false) {
    await bot.lookAt(entity.position.offset(0, entity.height, 0), force);
}
async function stop(option, callbackID) {
    if (option === "following") {
        if (!botStates.following) {
            return "I'm not following anyone :(";
        }
        botStates.following = false;
        bot.pathfinder.stop();
    }
    if (option === "pathfinding") {
        bot.pathfinder.stop();
        botStates.moving = false;
        return "Stopped pathfinding!";
    }
    if (option === "filter" && callbackID != undefined && typeof callbackID == "number") {
        clearInterval(callbackID);
        return `There! I've stopped filter number ${callbackID}. :)`;
    }
    else if (option === "filter" && callbackID == undefined) {
        return "I cannot stop filtering if I don't have the callback ID, silly :)";
    }
    else
        return "What's there to stop??";
}
