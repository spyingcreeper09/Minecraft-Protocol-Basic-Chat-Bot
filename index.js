// Import the minecraft-protocol library
const mc = require('minecraft-protocol');

// Global variables
let hash;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

// Async function to handle different commands
async function handleCommand(client, commandName, args) {
    // Check for different commands
    switch (commandName) {
        case 'countdown':
            // Check if no arguments are provided
            if (args.length == 0) {
                // count down from 3
                client.chat('3');
                await sleep(200); // Delay to prevent rapid chat commands
                client.chat('2');
                await sleep(200); // Delay in milliseconds
                client.chat('1');
                await sleep(200);
                client.chat('Countdown complete');
            } else {
                // Inform user of incorrect command usage
                client.chat('Invalid arguments for countdown command. Usage: !countdown');
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
        case 'validate':
            if (hash == args.pop()){
                client.chat('Valid hash');
                hash = generateRandomCode(8);
                console.log(`Hash: ${hash}`);
            } else {
                client.chat('Invalid hash');
            }
            break;
        default:
            // Log unknown commands to console
            client.chat(`Unknown command: ${commandName}`);
    }
}

// Constants for bot configuration
const botName = 'Bot'; // Replace with your bot's name
const serverIp = 'Server.IP'; // Replace with your server's IP address
const serverPort = 25565; // Replace with your server's port
const prefix = '!'; // Command prefix used to identify bot commands

// Create Minecraft client object
const client = mc.createClient({
    host: serverIp,
    port: serverPort,
    version: false,
    username: botName,
    checkTimeoutInterval: 690 * 1000 // Set timeout interval for connection checks
});

// Event listener for successful login
client.on('login', () => {
    // Log successful connection to the server
    console.log(`${botName} connected to ${serverIp}:${serverPort}`);

    // Generate a hash for the owner to use
    hash = generateRandomCode(8); // The number is how long the code is
    console.log(`Hash: ${hash}`);

    // Event listener for incoming player chat messages
    client.on('player_chat', (packet) => {
        // Extract plain message from packet
        const message = packet.plainMessage;
        // Check if message starts with command prefix
        if (message.charAt(0) == prefix) {
            // Extract command name and arguments from the message
            const cleanMessage = message.slice(1);
            const words = cleanMessage.trim().split(/\s+/);
            const commandName = words.shift();
            const args = words;
            // Call command handler with extracted command name and arguments
            handleCommand(client, commandName, args);
        }
    });
});
