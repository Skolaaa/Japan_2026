// Japan Travel Itinerary Data
// Real accurate coordinates and comprehensive destination information

const TRAVEL_DATA = {
    // Week 1: Tokyo Discovery
    week1: [
        {
            name: "Tokyo",
            coords: [35.6762, 139.6503],
            days: "Days 1-7",
            details: "Modern culture, ancient temples, Shibuya Crossing, TeamLab Digital Art, winter illuminations",
            highlights: ["Senso-ji Temple", "Shibuya Crossing", "TeamLab Planets", "Imperial Palace", "Harajuku"],
            color: "#ff6b6b",
            type: "base"
        },
        {
            name: "Nikko",
            coords: [36.7581, 139.6239],
            days: "Day 4 Trip",
            details: "UNESCO World Heritage Toshogu Shrine complex, winter mountain scenery, traditional architecture",
            highlights: ["Toshogu Shrine", "Winter Waterfalls", "Sacred Bridge", "Lake Chuzenji"],
            color: "#ffa500",
            type: "daytrip"
        },
        {
            name: "Hakone",
            coords: [35.2322, 139.1069],
            days: "Day 5 Trip",
            details: "Mount Fuji views, luxury hot springs, Lake Ashi, scenic mountain railways",
            highlights: ["Mt. Fuji Views", "Onsen Experience", "Lake Ashi", "Hakone Open-Air Museum"],
            color: "#ffa500",
            type: "daytrip"
        },
        {
            name: "Kamakura",
            coords: [35.3186, 139.5439],
            days: "Day 6 Trip",
            details: "Great Buddha statue, zen temples, traditional seaside town atmosphere, bamboo groves",
            highlights: ["Great Buddha", "Hase Temple", "Bamboo Grove", "Traditional Streets"],
            color: "#ffa500",
            type: "daytrip"
        }
    ],

    // Week 2: Japanese Alps & Snow Country
    week2: [
        {
            name: "Nagano",
            coords: [36.6513, 138.1814],
            days: "Days 8-9",
            details: "Jigokudani Snow Monkey Park, traditional hot springs, mountain culture, winter festivals",
            highlights: ["Snow Monkeys", "Zenkoji Temple", "Hot Springs", "Mountain Views"],
            color: "#4ecdc4",
            type: "main"
        },
        {
            name: "Matsumoto",
            coords: [36.2388, 137.9697],
            days: "Day 10",
            details: "Historic black castle (one of Japan's original castles), traditional craft workshops, alpine setting",
            highlights: ["Matsumoto Castle", "Traditional Crafts", "Historic Streets", "Mountain Views"],
            color: "#4ecdc4",
            type: "main"
        },
        {
            name: "Takayama",
            coords: [36.1428, 137.2531],
            days: "Days 11-12",
            details: "Traditional architecture, premium Hida beef experiences, morning markets, sake breweries",
            highlights: ["Old Town", "Hida Beef", "Morning Markets", "Sake Tasting"],
            color: "#4ecdc4",
            type: "main"
        },
        {
            name: "Shirakawa-go",
            coords: [36.2586, 136.9066],
            days: "Day 12 Trip",
            details: "UNESCO World Heritage village with traditional thatched-roof houses covered in winter snow",
            highlights: ["Gassho-zukuri Houses", "UNESCO Heritage", "Snow Scenery", "Rural Culture"],
            color: "#ffa500",
            type: "daytrip"
        }
    ],

    // Week 3: Kansai Culture & Tokyo Shopping
    week3: [
        {
            name: "Kyoto",
            coords: [35.0116, 135.7681],
            days: "Days 13-15",
            details: "Traditional temples, gardens, geisha districts, tea ceremonies, Setsubun festival preparation",
            highlights: ["Fushimi Inari", "Golden Pavilion", "Gion District", "Tea Ceremonies"],
            color: "#45b7d1",
            type: "main"
        },
        {
            name: "Nara",
            coords: [34.6851, 135.8048],
            days: "Day 16",
            details: "Ancient capital with friendly deer park, massive Todai-ji Temple, Setsubun festival celebrations",
            highlights: ["Todai-ji Temple", "Deer Park", "Setsubun Festival", "Kasuga Taisha"],
            color: "#45b7d1",
            type: "main"
        },
        {
            name: "Osaka",
            coords: [34.6937, 135.5023],
            days: "Days 17-18",
            details: "Food paradise with takoyaki, okonomiyaki, street food culture, vibrant Dotonbori district",
            highlights: ["Dotonbori District", "Street Food", "Takoyaki", "Osaka Castle"],
            color: "#45b7d1",
            type: "main"
        },
        {
            name: "Tokyo (Return)",
            coords: [35.6762, 139.6503],
            days: "Days 19-21",
            details: "Shopping finale in Ginza and Harajuku, final cultural experiences, departure preparations",
            highlights: ["Ginza Shopping", "Harajuku Fashion", "Final Experiences", "Tax-free Shopping"],
            color: "#ff6b6b",
            type: "base"
        }
    ]
};

// Route configurations for different weeks
const ROUTE_CONFIG = {
    week1: {
        color: '#ff6b6b',
        weight: 2,
        opacity: 0.7,
        dashArray: '10, 5'
    },
    week2: {
        color: '#4ecdc4',
        weight: 3,
        opacity: 0.8
    },
    week3: {
        color: '#45b7d1',
        weight: 3,
        opacity: 0.8
    }
};

// Map configuration
const MAP_CONFIG = {
    center: [36.2048, 138.2529], // Center of Japan
    zoom: 6,
    minZoom: 5,
    maxZoom: 18,
    zoomControl: false
};

// Tile layer configuration
const TILE_CONFIG = {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
};

// Marker size configuration
const MARKER_CONFIG = {
    base: 8,
    main: 7,
    daytrip: 6,
    hoverIncrease: 2,
    strokeWeight: 2,
    strokeColor: 'white'
};

// Export for use in main map script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TRAVEL_DATA,
        ROUTE_CONFIG,
        MAP_CONFIG,
        TILE_CONFIG,
        MARKER_CONFIG
    };
}