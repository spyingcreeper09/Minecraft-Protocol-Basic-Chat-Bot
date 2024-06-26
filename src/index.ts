if (process.argv.length > 6) {
    console.log(`That's too many arguments! :( \nThe proper way to use this script is: node ${process.argv[1]} [server IP] (optional: [server port] [name] [version])`)
    process.exit(1)
}
if (process.argv.length < 3) {
    console.log(`Oh hi! You must be new :)\nThe proper way to use this script is the following:\n node ${process.argv[1]} [server IP] (optional: [server port] [name] [version])`)
    process.exit(1)
}

// Import Mineflayer and Pathfinder
console.log("Loading Mineflayer...")
import { createBot, Player } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import {
    lookAtEntity,
    sleep,
    botStates,
    runBackgroundTask
} from "./helper.js"
import { isNumber } from 'util'
const { pathfinder, Movements, goals } = pathfinderPkg;

// Bot setup + placeholder constants
const botName = process.argv[4] ? process.argv[4]: "Bot"; // This isn't necessary to change. :)
const serverIp = process.argv[2]; // User's chosen server's IP address
const serverPort = process.argv[3] ? process.argv[3]: 25565; // User's server's port
const prefix = '.'; // Command prefix used to identify commands to this bot
const version = process.argv[5] ? process.argv[5]: "1.18.2";
let hash: string;
let exitHash: string;
let goal; 
let player: Player;
const owner: string = "SonicandTailsCD";
const user_skin_name: string = "Flaphi_"
const knownSpamBots: string[] = [
    "uwu",
    "fTcxOGld"
]

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
    bot.chat("/prefix &2[Bots]&r");
    await sleep(400)
    bot.chat(`&2Helloo!! I'm online and ready for work, owner and creator &3${owner}&2 :)`);
    await sleep(400)
    bot.chat("/cspy off")
    await sleep(400)
    bot.chat(`/sudo ${owner} prefix &2[${botName}'s owner]&r`)
    await sleep(400)
    bot.chat(`/skin ${user_skin_name}`)
    bot.on("chat", async (name, message) => {
        if (name == botName) return
        if (message == `!exit ${exitHash}`) process.exit(127)
        if (message == "?") {
            console.log(`[Chat] ${name}: ${message}`);
            return
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
            const inputHash = args.pop();
            hash = await handleCommand(name, commandName, args, inputHash, hash); // Below this function shows the commands, edit it to your liking
            
        }
    });
}

const publicCommands: string[] = [
    "countdown",
    "validate",
    "help"
]

// Async function to handle different commands
async function handleCommand(username: string, commandName: string, args: any, inputHash: string | undefined, hash: string): Promise<string> {
    if (commandName == "[object Undefined]") {
        console.log(`[ERR] Bot username: ${username}\nInput hash: ${inputHash}\nCurrent hash: ${hash}`)
        console.trace(`The command returned undefined. Tracing now:`)
        return hash;
    }
    console.log(`[Debug] Command: ${commandName}`)
    console.log(`[Debug] Input hash: ${inputHash}\n[Debug] Current hash: ${hash}`)
    if (publicCommands.includes(commandName)) {
        console.log(`Public command used: ${commandName}`)
        switch (commandName) {
            // Validate your hash
            case 'validate':
                if (hash == inputHash){
                    bot.chat(`That's a valid Owner hash! :)`);
                    hash = generateRandomCode(12);
                    console.log(`Hash: ${hash}`);
                } else {
                    bot.chat('Invalid hash :(');
                }
                break;
            case 'help':
                bot.chat("I can run these commands:")
                sleep(100)
                bot.chat("&2For all players&r:")
                sleep(100)
                bot.chat(".countdown [optional message] - I count down from 3 to 0. Type a message after the command and I'll speak it when I'm done.")
                sleep(100)
                bot.chat(".validate [hash] - Validates any hash &4(BEWARE! This will make a new hash!)")
                sleep(100)
                bot.chat(".help - well of course, this help")
                sleep(100)
                bot.chat(`&4Only for ${owner} or for people who has my hash&r:`)
                sleep(100)
                bot.chat(".selfcare - Ensures I'm an operator and sets me in Creative")
                sleep(100)
                bot.chat(".cspy [optional ON/OFF] - enable or disable my command spying abilities")
                sleep(100)
                bot.chat(".stop [following, pathfinding, filter] - Stop the action that my owner told me to")
                sleep(100)
                bot.chat(".echo [message] - Repeat back a word... or many :P")
                sleep(100)
                bot.chat(".filter: [args] - Ban a player, &4hardcore&r-like method!")
                sleep(100)
                bot.chat(".tpowner - Self-explanatory!")
                sleep(100)
                bot.chat(".pathfind [x] [y] [z] - Calculate and go to a specific location (&4WARNING: I run on a not-so-beastly PC and this WILL LAG!!!)")
                sleep(100)
                bot.chat(".follow [username] - I will follow a player of your choice, &4using advanced pathfinding that may or may not get me and you banned)")
                sleep(100)
                bot.chat("I think that explains it all :)")
            case 'countdown':
                // Check if no arguments are provided
                if (args.length != 0) {
                    // count down from 3
                    bot.chat('3');
                    await sleep(1000); // Delay to prevent rapid chat commands
                    bot.chat('2');
                    await sleep(1000); // Delay in milliseconds
                    bot.chat('1');
                    await sleep(1000);
                    bot.chat(`${args.join(" ")}`);
                } else {
                    // Run with default message
                    // count down from 3
                    bot.chat('3');
                    await sleep(1000); // Delay to prevent rapid chat commands
                    bot.chat('2');
                    await sleep(1000); // Delay in milliseconds
                    bot.chat('1');
                    await sleep(1000);
                    bot.chat('Countdown complete');
                }
                break;
        }
        return hash;
    }
    else if (inputHash === hash) {
        console.log(`[Debug] Command used: ${commandName}`)
        // Check for different commands
        switch (commandName) {
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
            case 'commandspy':
                if (args.length = 0) {
                    bot.chat("/cspy")
                }
                else {
                    bot.chat(`/cspy ${args[0]}`)
                }
            case 'stop':
                if (args.length = 0) {
                    bot.chat("Stop what? :)")
                    console.log(`Hint: type "!stop following" or "!stop pathfinding"!`)
                }
                else if (args.length > 1) {
                    bot.chat("That's too many words, I don't understand :(")
                    console.log(`Hint: type "!stop following" or "!stop pathfinding"!`)
                }
                else {
                    bot.chat(await stop(args[0]))
                }
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
                    bot.whisper(username, "Ok, you've given me a player name, but what do you want me to do to them? A mute? Or simply spam-kick?")
                }
                else if (args.length == 4 && args[1] == "spam" && args[2] == "kick") {
                    bot.whisper(username, "For how long??")
                }
                else if (args.length == 2 && args[1] == "mute") {
                    var callbackID = setInterval(runBackgroundTask(args[0], args[1], botName), 2000)
                    console.log(`${callbackID} is your callback ID for this mute. Don't forget it, because if you do, you'll have to restart the bot to clear filters!`)
                }
                else if (args.length > 3 && args[0] == "spam" && args[1] == "kick" && typeof args[2] == 'string' && args[3] == "for" && typeof args[4] == 'number' && args[5] == 'times,' && args[6] == 'for' && typeof args[7] == 'string') {
                    var kickCallbackID = setInterval(runBackgroundTask(args[2], "spam kick", botName, undefined, args[4]), 10000)
                    console.log(`${kickCallbackID} is your callback ID for spam kicking. Don't forget it, because if you do, you'll have to restart the bot to clear filters!`)
                }
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
                    bot.setControlState('sprint', true)
                    botStates.moving = true;
                    goal = new goals.GoalGetToBlock(args[0], args[1], args[2])
                    await bot.pathfinder.goto(goal)
                    break;
                }
            case 'follow':
                bot.setControlState("sprint", true)
                botFollowPlayer(username, 2)
            // Add more cases for other commands here
            default:
                // Log unknown commands to console
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
    botStates.following = true;
	player = bot.players[username];
	if (botStates.following) {
		bot.chat("Sorry, can't run this command more than once!");
	}
    if (botStates.moving) {
        bot.chat("I can't follow when I'm pathfinding! :(")
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
            bot.chat('Sorry, I\'ve ran into an error. I can\'t keep following you. Please run that command again :)');
            return;
        }
    }
}

async function stop(option: string): Promise<string>{
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
    if (option === "attacking") {
        bot.pathfinder.stop()
        return "Fine, I've stopped attacking... I'm bored though ^-^"
    }
    else return "Invalid input!"
}

// Event listener for successful login
bot.once('spawn', onSpawn);
