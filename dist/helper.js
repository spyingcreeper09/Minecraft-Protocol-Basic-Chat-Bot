let bot;
export async function lookAtEntity(entity, force = false) {
    await bot.lookAt(entity.position.offset(0, entity.height, 0), force);
}
export async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}
export const botStates = {
    following: false,
    looking: false
};
