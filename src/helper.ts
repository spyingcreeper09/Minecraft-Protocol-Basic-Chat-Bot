let bot: any;

export async function lookAtEntity(entity: any, force = false) {
    await bot.lookAt(entity.position.offset(0, entity.height, 0), force);
}
export async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
}
export const botStates = {
    following: false,
    looking: false,
    moving: false
}
