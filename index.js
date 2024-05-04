// Import the minecraft-protocol library
const mc = require('mineflayer');

// Bot setup constants
const botName = 'Bot'; // Replace with a username to your liking for your bot
const serverIp = '127.0.0.1'; // Replace with your server's IP address
const serverPort = 39753; // Replace with your server's port
const prefix = '!'; // Command prefix used to identify commands to this bot

// Create Minecraft client object
const client = mc.createBot({
    host: serverIp,
    port: serverPort,
    version: false,
    username: botName,
    checkTimeoutInterval: 690 * 1000 // Set timeout interval for connection checks
});

function onSpawn() {
    // Log successful connection to the server
    console.log(`${botName} successfully connected to the server ${serverIp}:${serverPort}`)
    // Generate a hash for the owner to use
    let hash = generateRandomCode(8); // The number is how long the code is
    // Now tell the user what his/her hash is
    console.log(`Hash: ${hash}`);
    client.on("chat", async (name, message) => {
        if (name == botName) return
        console.log(name + ": " + message)
        // Check if message starts with command prefix
        if (message.charAt(0) == prefix) {
            // Extract command name and arguments from the message
            const words = message.trim().split(/\s+/);
            const command = words.shift();
            const commandName = command.replace("!", "");
            const args = words;
            // Get the hash from the message
            const inputHash = args.pop();
            try {
                // Check if the hash matches
                if (inputHash == hash) {
                    // Generate a new hash
                    hash = generateRandomCode(8);
                    console.log(`New hash: ${hash}`);
                    console.log(`\nCommand: ${commandName}\nArguments: ${args.join(" ")}`)
                    // Call command handler with extracted command name and arguments
                    handleCommand(client, commandName, args); // Below this function shows the commands, edit it to your liking
                } else {
                    // Reject and don't do anything if hash is invalid
                    client.chat('Invalid hash :(');
                }
            }
            catch (err) {
                client.chat("Unable to reach hash variable :(")
            }
        }
    });
}

// Async function to handle different commands
async function handleCommand(client, commandName, args) {
    // Check for different commands
    switch (commandName) {
        // Command to perform self-care actions in Minecraft
        case 'selfcare':
            // Check if no arguments are provided
            if (args.length == 0) {
                // Perform self-care actions: make player an operator and switch to creative mode
                client.chat('/op @s[type=player]');
                await sleep(200); // Delay to prevent rapid chat commands
                client.chat('/gmc');
                await sleep(200); // Delay in milliseconds
                client.chat('Selfcare Complete');
            } else {
                // Inform user of incorrect command usage
                client.chat('Invalid arguments for selfcare command. Usage: !selfcare');
            }
            break;
        // Command to echo a message in Minecraft chat
        case 'echo':
            // Check if arguments are provided
            if (args.length != 0) {
                // Concatenate arguments into a single string and send it to chat
                client.chat(args.join(" "));
            } else {
                // Inform user of incorrect command usage
                client.chat('Invalid arguments for echo command. Usage: !echo <phrase to echo>');
            }
            break;
        // Add more cases for other commands here
        default:
            // Log unknown commands to console
            client.chat(`${commandName} isn't a command :()`);
    }
}

// Function to generate a random alphanumeric code of a specified length
function generateRandomCode(length) {
    // Define all possible characters for the code
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

// Event listener for successful login
client.once('spawn', onSpawn);
