import { App } from './App';

const main = async (): Promise<void> => {
    const app = await App.initialize();
    await app.listen();
};

void main();
