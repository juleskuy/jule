export interface Item {
    id: string;
    name: string;
    description: string;
    price: number;
    emoji: string;
    usable?: boolean; // If true, can be used with /use
    consumable?: boolean; // If true, removed on use
}

export const COMM_ITEMS: Item[] = [
    {
        id: 'cookie',
        name: 'Cookie',
        description: 'A delicious cookie to snack on.',
        price: 50,
        emoji: '🍪',
        usable: true,
        consumable: true,
    },
    {
        id: 'coffee',
        name: 'Coffee',
        description: 'Keeps you awake and energized.',
        price: 150,
        emoji: '☕',
        usable: true,
        consumable: true,
    },
    {
        id: 'watch',
        name: 'Rolex Watch',
        description: 'A fancy watch to flex on your friends.',
        price: 5000,
        emoji: '⌚',
        usable: false,
    },
    {
        id: 'laptop',
        name: 'Gaming Laptop',
        description: 'Used for hacking and work.',
        price: 2500,
        emoji: '💻',
        usable: false,
    },
    {
        id: 'shield',
        name: 'Anti-Rob Shield',
        description: 'Protects your wallet from thieves.',
        price: 1000,
        emoji: '🛡️',
        usable: true,
        consumable: true, // One-time use to activate protection (maybe implementation depends on logic)
    },
    {
        id: 'ring',
        name: 'Diamond Ring',
        description: 'The ultimate symbol of wealth.',
        price: 50000,
        emoji: '💍',
        usable: false,
    }
];

export const getItem = (id: string) => COMM_ITEMS.find(i => i.id === id.toLowerCase() || i.name.toLowerCase() === id.toLowerCase());
