export async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
}
export const botStates = {
    following: false,
    looking: false,
    moving: false,
    reciting: {
        help: false
    }
}
