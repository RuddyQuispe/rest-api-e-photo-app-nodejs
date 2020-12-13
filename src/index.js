import {App} from './app';

async function main(){
    const app = new App();
    await app.listen(process.env.PORT || 3000);
}

main();