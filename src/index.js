import {App} from './app';

/**
 * Function run App the REst API NodeJS
 * @returns {Promise<void>}
 */
async function main(){
    const app = new App();
    await app.listen(process.env.PORT || 5000);
}

main();