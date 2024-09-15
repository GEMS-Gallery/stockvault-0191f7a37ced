import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { IDL } from "@dfinity/candid";

const mockIdlFactory = ({ IDL }) => {
  return IDL.Service({
    'getStockPrice': IDL.Func([IDL.Text], [IDL.Text], ['query'])
  });
};

let portfolioTrackerActor;

const initActor = async () => {
    const agent = new HttpAgent();
    const canisterIdRaw = import.meta.env.VITE_PORTFOLIO_TRACKER_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai';

    try {
        const canisterId = Principal.fromText(canisterIdRaw);
        portfolioTrackerActor = Actor.createActor(mockIdlFactory, {
            agent,
            canisterId,
        });
    } catch (error) {
        console.error('Error creating actor:', error);
        document.body.innerHTML = '<h1>Error: Unable to initialize the application. Please check your canister ID configuration.</h1>';
    }
};

async function fetchStockPrice(symbol) {
    try {
        const price = await portfolioTrackerActor.getStockPrice(symbol);
        return price;
    } catch (error) {
        console.error('Error fetching stock price:', error);
        return 'Error: Unable to fetch stock price';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await initActor();

    const form = document.getElementById('stock-form');
    const symbolInput = document.getElementById('symbolInput');
    const priceDisplay = document.getElementById('priceDisplay');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const symbol = symbolInput.value.toUpperCase();
        priceDisplay.textContent = 'Fetching price...';
        const price = await fetchStockPrice(symbol);
        priceDisplay.textContent = `The current price of ${symbol} is $${price}`;
    });
});