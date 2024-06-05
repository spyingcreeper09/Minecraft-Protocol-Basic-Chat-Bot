if (process.argv.length > 6) {
    console.log(`That's too many arguments! :( \nThe proper way to use this script is: node ${process.argv[1]} [server IP] (optional: [server port] [name] [password])`)
    process.exit(1)
}
if (process.argv.length < 3) {
    console.log(`Oh hi! You must be new :)\nThe proper way to use this script is the following:\n node ${process.argv[1]} [server IP] (optional: [server port] [name] [password])`)
    process.exit(1)
}

// Import Mineflayer and Pathfinder
console.log("Loading Mineflayer...")
import { createBot, Player } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import {
    lookAtEntity,
    sleep,
    botStates
} from "./helper.js"
const { pathfinder, Movements, goals } = pathfinderPkg;

// Bot setup + placeholder constants
const botName = process.argv[4] ? process.argv[4]: "Bot"; // This isn't necessary to change. :)
const serverIp = process.argv[2]; // User's chosen server's IP address
const serverPort = process.argv[3] ? process.argv[3]: 25565; // User's server's port
const prefix = '!'; // Command prefix used to identify commands to this bot
let hash: string;
let goal; 
let player: Player;

// Create Minecraft client object
console.log("Joining server...")
const options = {
    host: serverIp,
    port: serverPort,
    username: botName,
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

function onSpawn() {
    // Log successful connection to the server
    console.log(`${botName} successfully connected to the server ${serverIp}:${serverPort}`)
    // Generate a hash for the owner to use
    hash = generateRandomCode(12); // The number is how long the code is
    // Now tell the user what his/her hash is
    console.log(`Hash: ${hash}`);
    bot.on("chat", async (name, message) => {
        if (name == botName) return
        if (message == "!reload") process.exit(127)
        console.log(`[Chat] ${name}: ${message}`)
        // Check if message starts with command prefix
        if (message.charAt(0) == prefix) {
            // Extract command name and arguments from the message
            const words = message.trim().split(/\s+/);
            const command = words.shift();
            if (command == undefined) return; // Fix "undefined not allowed" in constitutional command
            const commandName = command.replace("!", "");
            const args = words;
            // Get the hash from the message
            const inputHash = args.pop();
            if (inputHash == undefined) return; // Fix "undefined not allowed" in handleCommand()
            hash = await handleCommand(name, commandName, args, inputHash, hash); // Below this function shows the commands, edit it to your liking
            
        }
    });
}

const publicCommands: string[] = [
    "countdown",
    "validate"
]

// Async function to handle different commands
async function handleCommand(username: string, commandName: string, args: any, inputHash: string, hash: string): Promise<string> {
    if (commandName == "[object Undefined]") {
        console.log(`[ERR] Bot username: ${username}\nInput hash: ${inputHash}\nCurrent hash: ${hash}`)
        console.trace(`The command returned undefined. Tracing now:`)
        return hash;
    }
    console.log(`[Debug] Command: ${commandName}`)
    console.log(`[Debug] Input hash: ${inputHash}\n[Debug] Current hash: ${hash}`)
    if (commandName in publicCommands) {
        console.log(`Public command used: ${commandName}`)
        switch (commandName) {
            // Validate your hash
            case 'validate':
                if (hash == args.pop()){
                    bot.chat(`That's a valid Owner hash! :)`);
                    hash = generateRandomCode(12);
                    console.log(`Hash: ${hash}`);
                } else {
                    bot.chat('Invalid hash :(');
                }
                break;
            case 'countdown':
                // Check if no arguments are provided
                if (args.length == 0) {
                    // count down from 3
                    bot.chat('3');
                    await sleep(200); // Delay to prevent rapid chat commands
                    bot.chat('2');
                    await sleep(200); // Delay in milliseconds
                    bot.chat('1');
                    await sleep(200);
                    bot.chat('Countdown complete');
                } else {
                    // Inform user of incorrect command usage
                    bot.chat('Invalid arguments for countdown command. Usage: !countdown');
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
                    bot.chat('Selfcare Complete');
                } else {
                    // Inform user of incorrect command usage
                    bot.chat('Invalid arguments for selfcare command. Usage: !selfcare');
                }
                break;  
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
        console.warn("Commands aren't working...")
        bot.chat("Trouble reading commands :(")
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
