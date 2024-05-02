// Import the minecraft-protocol library
const mc = require('minecraft-protocol');

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
            client.chat(`Unknown command: ${commandName}`);
    }
}

// Constants for bot configuration
const botName = 'Bot'; // Replace with your bot's name
const serverIp = 'kaboom.pw'; // Replace with your server's IP address
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
    let hash = generateRandomCode(8); // The number is how long the code is
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
            // Get the hash from the message
            const inputHash = args.pop();

            // Check if the hash matches
            if (inputHash == hash) {
                // Generate a new hash
                hash = generateRandomCode(8);
                console.log(`Hash: ${hash}`);
                // Call command handler with extracted command name and arguments
                handleCommand(client, commandName, args);
            } else {
                // Reject and don't do anything if hash is invalid
                client.chat('Invalid Hash');
            }
        }
    });
});
