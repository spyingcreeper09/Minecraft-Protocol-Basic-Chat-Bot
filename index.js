// Import the mineflayer library
const mc = require('mineflayer');

// Created with hard work, by @spyingcreeper09 :)
// I only did the base of it. You debugged further then i even thought was possible with this bot lol. You have to take soem credit too
// Fine then. @SonicandTailsCD (it's-a me!) did some work. But you came up with this idea :)

// Bot setup constants
const botName = 'Bot'; // Replace with a username to your liking for your bot
const serverIp = '127.0.0.1'; // Replace with your server's IP address (or leave this untouched if you just want to run your bot locally)
const serverPort = 59390; // Replace with your server's port (in case of local LAN, input the port Minecraft sends to you)
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
        console.log(`[Chat] ${name}: ${message}`) // Add "// " (yes, with the space) behind this line of code (behind console.log) to disable chat echo. Want a user-friendly simple bot? This repo isn't for you, please go to SonicandTailsCD's own repo. :)
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
                    // console.log(`\nCommand: ${commandName}\nArguments: ${args.join(" ")}`) // Remove the "//" from " console.log" if you have a problem with commands being run - could help you bug report it later
                    // Asynchronously call the command handler function, with already-parsed command name and arguments
                    await handleCommand(client, commandName, args); // Below this function shows the command handler, edit it to your liking
                } else {
                    // Reject and don't do anything if hash is invalid
                    client.chat('Invalid hash :(');
                }
            }
            catch (err) {
                client.chat("Unable to reach hash variable :(") 
                console.log(String(err?.message)) // In case of failure, the bot catches it and comments it to the console. Use the command output to report a bug, and don't forget to report bugs!
            }
        }
    });
}

// Async function to handle different commands
async function handleCommand(client, commandName, args) {
    // Check for different commands
    switch (commandName) {
        case 'countdown':
            // Upgraded countdown mechanics
            // if (args.length > 1 &&  /^[0-9]+$/.test(args[1])) { // Check- actually, wait - this may not be so beginner-friendly...
            if (args.length > 1) {
                const value = number(args[0]);
                if (value === 0) {
                    client.chat("Sorry, the first parameter must be a number, and it must be greater than 0.");
                }
                for (let count = value; count >= 1; count--) { // Count until it reaches 0
                    client.chat(`${count}...`)
                    await sleep(1000);
                }
                args.shift() // delete number from argument list
                client.chat(args.join("") || "Countdown complete!");
            }
        // Command to perform self-care actions in Minecraft
        case 'selfcare':
            // Check if no arguments are provided
            if (args.length == 0) {
                // Perform self-care actions: make player an operator and switch to creative mode
                client.chat('/op @s[type=player]');
                await sleep(200); // Delay to prevent rapid chat commands in miliseconds
                client.chat('/gmc');
                await sleep(200); // Delay to prevent rapid chat commands in milliseconds
                client.chat('Selfcare Complete');
            } else {
                // Inform user of incorrect command usage
                client.chat('Invalid arguments for selfcare command. Usage: !selfcare');
            }
            break;
        // Validate your hash
        case 'validate':
            if (hash == args.pop()){
                client.chat('Valid hash');
                hash = generateRandomCode(8);
                console.log(`Hash: ${hash}`);
            } else {
                client.chat('Invalid hash');
            }
            break;
        
        // Command to echo a message in Minecraft chat
        case 'echo':
            // Check if arguments are provided
            if (args.length !== 0) {
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
            client.chat(`${commandName} isn't a command. :(`);
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

/**
* Checks if a string contains only numbers
* @param {string} str A string. Do not send anything else to this function.
* @returns {number}
*/
function number(str) {
    return parseInt(
        str.split('\n')[0]?.trim()
           ?.match(/^[0-9]+$/)?.[0]
        || "0"
    );
    /*
    Breakdown:
    str.split('\n'): separates every line
    [0]: grab the first line available
    ?.trim(): if it exists, remove the accidental spaces
    ?.match([regexp]): if still exists, try to find the numbers with the below syntax:
        /: start of RegEx declaration (RegEx is basically the king of finding exact patterns in text)
        ^: start of text
        [0-9]: find numbers
        +: repeat this search (so it finds multiple numbers, like 000000000...
        $: until the text ends
    ?.[0]: grab the first result
    || 0; if it doesn't exist, give 0 to parseInt() instead
    */
}

/**
* Sleep.
* @param {number} ms How many miliseconds to wait
* @returns {void} nothing
*/
async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
    return;
}

// Event listener for successful login
client.once('spawn', onSpawn);

