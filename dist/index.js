if (process.argv.length > 6) {
    console.log(`That's too many arguments! :( \nThe proper way to use this script is: node ${process.argv[1]} [server IP] (optional: [server port] [name] [version])`);
    process.exit(1);
}
if (process.argv.length < 3) {
    console.log(`Oh hi! You must be new :)\nThe proper way to use this script is the following:\n node ${process.argv[1]} [server IP] (optional: [server port] [name] [version])`);
    process.exit(1);
}
console.log("Loading Mineflayer...");
import { createBot } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import { sleep, botStates, } from "./helper.js";
const { pathfinder, Movements, goals } = pathfinderPkg;
const botName = process.argv[4] ? process.argv[4] : "Bot";
const serverIp = process.argv[2];
const serverPort = process.argv[3] ? process.argv[3] : 25565;
const prefix = '.';
const version = process.argv[5] ? process.argv[5] : "1.18.2";
let hash;
let exitHash;
let goal;
let kickCount = 0;
let player;
const owner = "SonicandTailsCD";
const user_skin_name = "Flaphi_";
const knownSpamBots = [
    "uwu",
    "fTcxOGld"
];
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
        if (message == `!exit ${exitHash}`)
            process.exit(127);
        if (message == "?") {
            console.log(`[Chat] ${name}: ${message}`);
            return;
        }
        console.log(`[Chat] ${name}: ${message}`);
        if (message.charAt(0) == prefix) {
            const words = message.trim().split(/\s+/);
            const command = words.shift();
            if (command == undefined)
                return;
            const commandName = command.replace(prefix, "");
            const args = words;
            const inputHash = args.pop();
            hash = await handleCommand(name, commandName, args, inputHash, hash);
        }
    });
}
const publicCommands = [
    "countdown",
    "validate",
    "help"
];
async function handleCommand(username, commandName, args, inputHash, hash) {
    if (commandName == "[object Undefined]") {
        console.log(`[ERR] Bot username: ${username}\nInput hash: ${inputHash}\nCurrent hash: ${hash}`);
        console.trace(`The command returned undefined. Tracing now:`);
        return hash;
    }
    console.log(`[Debug] Command: ${commandName}`);
    if (publicCommands.includes(commandName)) {
        console.log(`Public command used: ${commandName}`);
        switch (commandName) {
            case 'validate':
                if (hash == inputHash) {
                    bot.chat(`That's a valid Owner hash! :)`);
                    hash = generateRandomCode(12);
                    console.log(`Hash: ${hash}`);
                }
                else {
                    bot.chat('Invalid hash :(');
                }
                break;
            case 'help':
                bot.chat("I can run these commands:");
                sleep(100);
                bot.chat("&2For all players&r:");
                sleep(100);
                bot.chat(".countdown [optional message] - I count down from 3 to 0. Type a message after the command and I'll speak it when I'm done.");
                sleep(100);
                bot.chat(".validate [hash] - Validates any hash &4(BEWARE! This will make a new hash!)");
                sleep(100);
                bot.chat(".help - well of course, this help");
                sleep(100);
                bot.chat(`&4Only for ${owner} or for people who has my hash&r:`);
                sleep(100);
                bot.chat(".selfcare - Ensures I'm an operator and sets me in Creative");
                sleep(100);
                bot.chat(".cspy [optional ON/OFF] - enable or disable my command spying abilities");
                sleep(100);
                bot.chat(".stop [following, pathfinding, filter] - Stop the action that my owner told me to");
                sleep(100);
                bot.chat(".echo [message] - Repeat back a word... or many :P");
                sleep(100);
                bot.chat(".filter: [args] - Ban a player, &4hardcore&r-like method!");
                sleep(100);
                bot.chat(".tpowner - Self-explanatory!");
                sleep(100);
                bot.chat(".pathfind [x] [y] [z] - Calculate and go to a specific location (&4WARNING: I run on a not-so-beastly PC and this WILL LAG!!!)");
                sleep(100);
                bot.chat(".follow [username] - I will follow a player of your choice, &4using advanced pathfinding that may or may not get me and you banned)");
                sleep(100);
                bot.chat("I think that explains it all :)");
                break;
            case 'countdown':
                if (args.length != 0) {
                    bot.chat('3');
                    await sleep(1000);
                    bot.chat('2');
                    await sleep(1000);
                    bot.chat('1');
                    await sleep(1000);
                    bot.chat(`${args.join(" ")}`);
                }
                else {
                    bot.chat('3');
                    await sleep(1000);
                    bot.chat('2');
                    await sleep(1000);
                    bot.chat('1');
                    await sleep(1000);
                    bot.chat('Countdown complete');
                }
                break;
        }
        return hash;
    }
    else {
        console.log(`[Debug] Input hash: ${inputHash}\n[Debug] Current hash: ${hash}`);
    }
    if (inputHash === hash) {
        console.log(`[Debug] Command used: ${commandName}`);
        switch (commandName) {
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
            case 'commandspy':
                if (args.length = 0) {
                    bot.chat("/cspy");
                }
                else {
                    bot.chat(`/cspy ${args[0]}`);
                }
                break;
            case 'stop':
                if (args.length = 0) {
                    bot.chat("Stop what? :)");
                    console.log(`Hint: type "!stop following" or "!stop pathfinding"!`);
                }
                else if (args.length > 2) {
                    bot.chat("That's too many words, I don't understand :(");
                    console.log(`Hint: type "!stop following" or "!stop pathfinding"!`);
                }
                else {
                    bot.chat(await stop(args[0], args[1] | undefined));
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
                else if (args.length == 2 && args[0] == "mute") {
                    var callbackID = setInterval(() => runBackgroundTask(args[1], args[0], botName), 2000);
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
    botStates.following = true;
    player = bot.players[username];
    if (botStates.following) {
        bot.chat("Sorry, can't run this command more than once!");
    }
    if (botStates.moving) {
        bot.chat("I can't follow when I'm pathfinding! :(");
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
            bot.chat('Sorry, I\'ve ran into an error. I can\'t keep following you. Please run that command again :)');
            return;
        }
    }
}
bot.once('spawn', onSpawn);
function runBackgroundTask(player, task, bot_name) {
    if (!task)
        return;
    if (!player)
        return;
    if (!bot_name)
        return;
    if (task == "mute") {
        bot.chat(`/mute ${player} Filtered by ${bot_name}! >:)`);
    }
}
async function runGreeting() {
    bot.chat("/prefix &2[Bots]&r");
    await sleep(400);
    bot.chat(`&2Helloo!! I'm online and ready for work, owner and creator &3${owner}&2 :)`);
    await sleep(400);
    bot.chat("/cspy off");
    await sleep(400);
    bot.chat(`/sudo ${owner} prefix &2[${botName}'s owner]&r`);
    await sleep(400);
    bot.chat(`/skin ${user_skin_name}`);
    await sleep(400);
    bot.chat(`/sudo ${owner} skin ${user_skin_name}`);
    await sleep(400);
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
