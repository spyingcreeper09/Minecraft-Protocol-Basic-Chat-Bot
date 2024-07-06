if (process.argv.length > 6) {
    console.log(`That's too many arguments! :( \nThe proper way to use this script is: node ${process.argv[1]} [server IP] (optional: [server port] [name] [version])`)
    process.exit(1)
}
if (process.argv.length < 3) {
    console.log(`Oh hi! You must be new :)\nThe proper way to use this script is the following:\n node ${process.argv[1]} [server IP] (optional: [server port] [name] [version])`)
    process.exit(1)
}


'use strict'; // This is unsafe for newbies just starting out with programming. If you believe you are a beginner, or simply do not want strict rules, remove this whole line. :)

// Import Mineflayer and Pathfinder
console.log("Loading Mineflayer...")
import { createBot, Player } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import {
    sleep,
    botStates,
} from "./helper.js" // Necessary functions - do not modify them, as the helper.ts is planned to stay as is
import { isNumber } from 'util'
import * as os from 'node:os';
const { pathfinder, Movements, goals } = pathfinderPkg;

// Bot setup + placeholder constants
const botName = process.argv[4] ? process.argv[4]: "Robo"; // This isn't necessary to change. :)
const serverIp = process.argv[2]; // User's chosen server's IP address
const serverPort = process.argv[3] ? process.argv[3]: 25565; // User's server's port
const prefix = '.'; // Command prefix used to identify commands to this bot
const version = process.argv[5] ? process.argv[5]: "1.18.2"; // Don't change this! If you do not type a version, Robo will automatically try to guess 1.18. Most servers have ViaVersion - LEAVE IT AS IS, or you may get errors! Also, try running the code with `node . [server IP] [server port] [name of the bot] [version]`! :)
const owner: string = "SonicandTailsCD"; // The owner that actually owns the bot (It's set to my name, SonicandTailsCD, by default. Change this to your name if you wish, just please make sure to credit me!)
const user_skin_name: string = "Flaphi_" // If your server has it, the bot can automatically load a skin for you. Change the name to your favorite premium account's skin :)
const default_countdown_length: number = 5; // The default countdown (example: .countdown will use 5 seconds, to count down from 5 to 0. Robo will not refuse if this number isn't changed)
const seconds_countdown_limit: number = 120; // How many seconds the bot can tolerate counting down. Anything above this limit, and it will refuse to count down.

// Variables that I commonly need to refresh. Please do not delete any variables below unless you wish to get an error :)
let hash: string;
let exitHash: string;
let goal;
let player: Player;

// Create Minecraft client object
console.log("Joining server...")
const options = {
    host: serverIp,
    port: serverPort,
    username: botName,
    version: version
}
const bot = createBot(options);

// Load plugins + variables
bot.loadPlugin(pathfinder)

// Function to generate a random alphanumeric code of a specified length
function generateRandomCode(length: number) {
    // Define all possible characters for the code
    let characters = 'abcdefghimnopqrstuvwxyz0123456789';
    // Initialize an empty string to store the code
    let code = '';
    // Loop to generate code of specified length
    for (let i = 0; i < length; i++) {
        // Generate a random index to select a character from 'characters' string
        let randomIndex = Math.floor(Math.random() * characters.length);
        // Append the randomly selected character to the code
        code += characters.charAt(randomIndex);
    }
    // Return the generated code
    return code;
}

async function onSpawn() {
    // Log successful connection to the server
    console.log(`${botName} successfully connected to the server ${serverIp}:${serverPort}`)
    // Generate a hash for the owner to use
    hash = generateRandomCode(12); // The number is how long the code is
    exitHash = generateRandomCode(20);
    // Now tell the user what his/her hash is
    console.log(`Hash: ${hash}\nAdmin exit hash: ${exitHash}`);
    runGreeting()
    bot.on("chat", async (name, message) => {
        if (name == botName) return
        if (message == `Close yourself. My admin hash is ${exitHash}`) {
            bot.chat(`Ok ${name} :D`)
            process.exit(127)
        }
        if (message == "?") {
            console.log(`[Chat] ${name}: ${message}`);
            return
        }
        if (message == "Robo?") {
            bot.chat(`Yes, ${name}? :)`)
        }
        if (message == `${prefix}specs sensitive show ${hash}`) {
            bot.chat(`/tellraw @a [{"text": "From what I see here:\\n"}, {"text": "The OS I'm running on is ${os.platform()} ${os.type()}!\\n"}, {"text": "Available free memory for Robo to use: ${os.freemem() / 1024 / 1024}MB\\n"}, {"text": "CPU cores available for all processes: ${os.cpus().length}\\n"}, {"text": "My OS' hostname: ${os.hostname()}\\n"}, {"text": "CPU architecture: ${os.arch()}"}, {"text": "Uptime of this PC: ${os.uptime()}"}, {"text": "&2Robo&r: That's all I can say :)"}]`)
        }
        console.log(`[Chat] ${name}: ${message}`)
        // Check if message starts with command prefix
        if (message.charAt(0) == prefix) {
            // Extract command name and arguments from the message
            const words = message.trim().split(/\s+/);
            const command = words.shift();
            if (command == undefined) return; // Fix "undefined not allowed" in constitutional command
            const commandName = command.replace(prefix, "");
            const args = words;
            // Get the hash from the message
            hash = await handleCommand(name, commandName, args, hash); // Below this function shows the commands, edit it to your liking
            
        }
    });
}

const publicCommands: string[] = [
    "countdown",
    "validate",
    "help"
]

// Async function to handle different commands
async function handleCommand(username: string, commandName: string, args: any, hash: string): Promise<string> {
    console.log(`[Debug] Command: ${commandName}`)
    if (publicCommands.includes(commandName)) { // If the array publicCommands has the command the user's looking for, run code below
        console.log(`Public command used: ${commandName}`)
        switch (commandName) { // Check if the command's here
            case 'help': // All commands that can be used, with logic to prevent users from spamming Robo's help
                if (botStates.reciting.help) {
                    bot.chat(`/t ${username} I've already told everyone my commands, please wait 60 seconds. :)`)
                }; // If we've confirmed Robo has/is already saying it's .help instructions, return and don't do anything else
                botStates.reciting.help = true; // Now lock Robo's help
                bot.chat("I can run these commands:")
                sleep(100)
                bot.chat("&2For all players&r:")
                sleep(100)
                bot.chat(".countdown [optional message] - I count down from 3 to 0. Type a message after the command and I'll speak it when I'm done.")
                sleep(100)
                bot.chat(".help - well of course, this help")
                sleep(100)
                bot.chat(".validate [hash] - Validates any hash &4(BEWARE! This will make a new hash!)")
                sleep(100)
                bot.chat(`&4Only for ${owner} or for people who have my hash&r:`)
                sleep(100)
                bot.chat(".cloop [ms] [command] - Runs any command in a loop. Set the first argument to the milisecond loop time :)")
                sleep(100)
                bot.chat(".cspy [optional ON/OFF] - enable or disable my command spying abilities")
                sleep(100)
                bot.chat(".echo [message] - Repeat back a word... or many :P")
                sleep(100)
                bot.chat(".filter: [args] - Ban a player, &4hardcore&r-like method!")
                sleep(100)
                bot.chat(".follow [username] - I will follow a player of your choice, &4using advanced pathfinding that may or may not get me and you banned)")
                sleep(100)
                bot.chat(".pathfind [x] [y] [z] - Calculate and go to a specific location (&4WARNING: I run on a not-so-beastly PC and this WILL LAG!!!)")
                sleep(100)
                bot.chat(".selfcare - Ensures I'm an operator and sets me in Creative")
                sleep(100)
                bot.chat(".stop [following, pathfinding, filter] - Stop the action that my owner told me to")
                sleep(100)
                bot.chat(".tpowner - Self-explanatory!")
                sleep(100)
                bot.chat("I think that explains it all :)")
                await sleep(60000) // After 60 seconds (Doubt why there's 3 extra zeroes?? Simple, the function sleep() takes time in miliseconds!)
                botStates.reciting.help = false; // Remove the cooldown
                break; // exit the loop!
            case 'countdown':
                // Check if arguments are provided
                if (args.length != 0) { // Logic to make the bot countdown to any number (anything above 120 and Robo will refuse)
                    let countdown_length = args.shift();
                    if (typeof countdown_length == 'number') {
                        if (countdown_length > seconds_countdown_limit) {
                            bot.chat(`Say what now?? ${countdown_length} seconds?! Sorry, I don't want to count from ${countdown_length} to 0, that's boring :)`)
                            break;
                        }
                        await sleep(1000)
                        for (countdown_length > 0; countdown_length--;) { // For as long as countdown_length is greater than 0, subtract 1 from it
                            bot.chat(`${countdown_length}...`) // Make the bot say the current number
                            await sleep(1000) // Wait for a second, then loop
                        }
                        bot.chat(`${args.join(" ")}`); // When the countdown reaches 0, make the bot say the text it was told to repeat
                    }
                    else { // If the check fails but there is words
                        let counting: number = default_countdown_length // convert default countdown to a "private" count, so the default is unaffected
                        for (counting > 0; counting--;) { // For as long as countdown_length is greater than 0, subtract 1 from it
                            bot.chat(`${counting}...`) // Make the bot say the current number
                            await sleep(1000) // Wait for a second, then loop
                        }
                        bot.chat(`${countdown_length} ${args.join(" ")}`); // Undo the shifting, and speak it all after seconds that can be edited in your favorite editor
                    }
                }
                else {
                    // Run with default message and count down from 3
                    let counting: number = default_countdown_length // convert default countdown to a "private" count, so the default is unaffected
                    for (counting > 0; counting--;) { // For as long as countdown_length is greater than 0, subtract 1 from it
                        bot.chat(`${counting}...`) // Make the bot say the current number
                        await sleep(1000) // Wait for a second, then loop
                    }
                    bot.chat('Now go! :D'); // Finish off with the default message!
                }
                break;
            // If the command used is .validate
            case 'validate':
                const inputHash = args.pop(); // Validate removes the final argument, to actually verify a hash. Do not change this line, or there may be issues :)
                if (hash == inputHash) { // simple strict logic to ensure the hash is actually what it is (enforces case-sensitive)
                    bot.chat(`${inputHash} &2is a valid hash! :)`); // the &4 isn't a mistake - for servers that support it, this is chat color!
                    hash = generateRandomCode(12); // Now make a new hash
                    console.log(`New hash: ${hash}`);
                } else {
                    bot.chat(`${inputHash} &4isn't a valid hash :(`); // the &2 isn't a mistake - for servers that support it, this is chat color!
                }
                break;
        }
        return hash;
    }
    else {
        const inputHash = args.pop(); 
        console.log(`[Debug] Input hash: ${inputHash}\n[Debug] Current hash: ${hash}`) // debugging, this shouldn't be here
    }
    const inputHash = args.pop(); // remove the user-inputted hash from the last message they sent in Minecraft
    if (inputHash === hash) {
        console.log(`[Debug] Command used: ${commandName}`)
        // Check for different commands
        switch (commandName) {
            // If the server supports it, run command spy (while yea, you CAN do that with /cspy yourself, if for example you want to play Survival without OP and you wish for Robo to be the only OP, then this is the way to use command spy logs and give yourself command spy without OP)
            case 'commandspy':
                if (args.length = 0) {
                    bot.chat("/cspy")
                }
                else {
                    bot.chat(`/cspy ${args[0]}`)
                }
                break;
            // Command to perform self-care actions in Minecraft
            case 'selfcare':
            // Check if no arguments are provided
                if (args.length == 0) {
                    // Perform self-care actions: make player an operator and switch to creative mode
                    bot.chat('/op @s[type=player]');
                    await sleep(200); // Delay to prevent rapid chat commands in miliseconds
                    bot.chat('/gmc');
                    await sleep(200); // Delay to prevent rapid chat commands in milliseconds
                } else {
                    // Inform user of incorrect command usage
                    bot.chat('Invalid arguments for selfcare command. Usage: !selfcare');
                }
                break;
            case 'stop':
                if (args.length == 0) {
                    bot.chat("Stop what? :)")
                    console.log(`Hint: type "!stop following" or "!stop pathfinding"!`)
                }
                else if (args.length > 2) {
                    bot.chat("That's too many words, I don't understand :(")
                    console.log(`Hint: type "!stop following" or "!stop pathfinding"!`)
                }
                else {
                    bot.chat(await stop(args[0], args[1] ? args[1]: undefined))
                }
                break;
            // Command to echo a message in Minecraft chat
            case 'echo':
                // Check if arguments are provided
                if (args.length != 0) {
                    // Concatenate arguments into a single string and send it to chat
                    bot.chat(args.join(" "));
                } else {
                    // Inform user of incorrect command usage
                    bot.chat('Invalid arguments for echo command. Usage: !echo <phrase to echo>');
                }
                break;
            case "filter:":
                // Full plans of adding filters
                if (args.length == 0) {
                    bot.whisper(username, "I can't filter a player if not told which!")
                }
                else if (args.length == 1) {
                    bot.whisper(username, "Ok, you've given me a player name, but what do you want me to do to them? :)")
                }
                else if (args.length == 2 && args[0] == "hardcore_ban") {
                    var callbackID = setInterval(() => runBackgroundTask(args[0], botName, args[1]), 500)
                    console.log(`${callbackID} is your callback ID for this mute. Don't forget it, because if you do, you'll have to restart the bot to clear filters!`)
                }
                break;
            case 'tpowner':
                bot.chat(`/tp ${botName} ${username}`)
                console.log(`${botName} teleported to ${username}.`)
                bot.setControlState('back', true)
                sleep(500)
                bot.setControlState('back', false)
                break;
            case 'pathfind':
                if (botStates.following) {
                    bot.chat("I can't pathfind when I'm following someone! :(")
                    break
                }
                else if (botStates.moving) {
                    bot.chat("Please wait! I'm still pathfinding :(")
                    break
                }
                else {
                    bot.chat("Coming! :D")
                    bot.setControlState('sprint', true)
                    botStates.moving = true;
                    goal = new goals.GoalGetToBlock(args[0], args[1], args[2])
                    await bot.pathfinder.goto(goal)
                    break;
                }
            case 'follow':
                bot.setControlState("sprint", true)
                botFollowPlayer(username, 2)
                break;
            case 'cloop': 
                setInterval(() => runBackgroundTask("command_loop", botName, undefined, args[0], args.join(" ")), args[0])
            // Add more cases for other commands here
            default:
                // Log unknown commands to the player
                bot.chat(`${commandName} isn't a command :()`);
        }
        const newhash = generateRandomCode(12)
        console.log(`New hash: ${newhash}`)
        return newhash;
    }
    else if (inputHash != hash) {
        bot.chat("Invalid hash! :(")
        return hash;
    }
    else {
        bot.chat("That's not a command! :(")
        return hash
    }
}

// Don't modify this function please!
async function botFollowPlayer(username: string, range: number) {
	player = bot.players[username];
	if (botStates.following) {
		bot.chat("I'm already following! :(");
        return;
	}
    if (botStates.moving) {
        bot.chat("I can't follow when I'm pathfinding! :(")
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
            } else {
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

// Event listener for successful login
bot.once('spawn', onSpawn);

// --------------------------------------------------

// Code that most likely does not need modification, don't risk changing anything here
async function runBackgroundTask(task: string, bot_name: string, player?: string, ms?: number, command?: string) {
    if (!task) return;
    if (!player) return;
    if (!bot_name) return;
    if (task == "hardcore_ban") {
        bot.chat(`/mute ${player} Filtered by ${bot_name}! >:)`)
        await sleep(100)
        bot.chat(`/deop ${player}`)
        await sleep(100)
        bot.chat(`/gamemode spectator ${player}`)
        await sleep(100)
        return;
    }
    if (task == "command_loop") {
        console.log("It's running.")
        command?.replace(`${ms} `, "")
        bot.chat(`/${command}`)
        return;
    }
}

async function runGreeting() {
    await sleep(2000)
    bot.chat("/extras:prefix &l&a[&#006400Bots&r&f&l&a]");
    await sleep(400)
    bot.chat(`&2Helloo!! I'm online and ready for work, owner and creator &3${owner}&2 :)`);
    await sleep(400)
    bot.chat("/cspy on")
    await sleep(400)
    bot.chat(`/sudo ${owner} prefix &2[${botName}'s owner]&r`)
    await sleep(400)
    bot.chat(`/skin ${user_skin_name}`)
    await sleep(1200)
    bot.chat(`/sudo ${owner} skin ${user_skin_name}`)
    await sleep(400)
    bot.chat(`/tag ${botName} add netmsg`)
    await sleep(800)
    bot.chat(`/sudo ${owner} tag ${owner} add netmsg_Kaboom`)
    await sleep(800)
    bot.chat(`/tag ZenDev add netmsg`)
}

async function lookAtEntity(entity: any, force = false) {
    await bot.lookAt(entity.position.offset(0, entity.height, 0), force);
}

async function stop(option: string, callbackID?: number | undefined): Promise<string>{
    if (option === "following") {
        if (!botStates.following) {
            return "I'm not following anyone :("
        }
        botStates.following = false
        bot.pathfinder.stop()
    }
    if (option === "pathfinding") {
        bot.pathfinder.stop()
        botStates.moving = false;
        return "Stopped pathfinding!"
    }
    if (option === "filter" && callbackID != undefined && typeof callbackID == "number") {
        clearInterval(callbackID)
        return `There! I've stopped filter number ${callbackID}. :)`;
    }
    else if (option === "filter" && callbackID == undefined) {
        return "I cannot stop filtering if I don't have the callback ID, silly :)"
    }
    else return "What's there to stop??"
}