// Enhanced Japan Winter Travel Data - 21 Days: January 18 - February 7, 2025
// Optimized route: Tokyo → Kawaguchi-ko → Takayama → Kyoto → Osaka

const TRAVEL_DATA = {
    // Trip metadata
    metadata: {
        title: "Japan Winter Adventure 2025",
        duration: "21 days",
        startDate: "2025-01-18",
        endDate: "2025-02-07",
        totalCost: {
            transportation: 51000,
            accommodation: 180000,
            food: 120000,
            activities: 80000,
            total: 431000,
            currency: "JPY"
        }
    },

    // Base locations with enhanced data
    locations: {
        tokyo: {
            name: "Tokyo",
            coords: [35.6762, 139.6503],
            region: "Kanto",
            prefecture: "Tokyo",
            baseLocation: true,
            stayDuration: 7,
            dates: { start: "2025-01-18", end: "2025-01-25" },
            description: "Modern metropolis with ancient temples, winter illuminations, and cultural foundations",
            winterHighlights: [
                "Winter illuminations at Marunouchi",
                "Meiji Shrine New Year visits",
                "Tokyo Skytree crystal clear views",
                "Hot street food at Tsukiji"
            ],
            accommodations: {
                luxury: [
                    {
                        name: "Mandarin Oriental Tokyo",
                        priceRange: "¥45,000-65,000",
                        location: "Near Tokyo Station",
                        amenities: ["Premium service", "City views", "Spa"]
                    },
                    {
                        name: "Park Hyatt Tokyo",
                        priceRange: "¥40,000-55,000",
                        location: "Shinjuku",
                        amenities: ["Lost in Translation experience", "City views", "Premium restaurants"]
                    }
                ],
                midRange: [
                    {
                        name: "Hotel Century Southern Tower",
                        priceRange: "¥15,000-25,000",
                        location: "Shinjuku",
                        amenities: ["City views", "JR access", "Comfortable rooms"]
                    },
                    {
                        name: "Hotel Indigo Tokyo Shibuya",
                        priceRange: "¥18,000-28,000",
                        location: "Shibuya",
                        amenities: ["Boutique styling", "Central location", "Modern design"]
                    }
                ],
                budget: [
                    {
                        name: "Sotetsu Fresa Inn Higashi Shinjuku",
                        priceRange: "¥8,000-12,000",
                        location: "Shinjuku",
                        amenities: ["Subway access", "Modern amenities", "Convenient location"]
                    }
                ]
            },
            transportation: {
                airport: "Narita Express (¥3,070) or Haneda Monorail (¥500)",
                local: "JR Tokyo Wide Pass (3 days, ¥15,000)",
                dayTrips: "Included in regional pass"
            },
            weather: {
                avgTemp: { high: 10, low: 2, unit: "°C" },
                conditions: "Clear and dry, occasional snow",
                clothing: ["Heavy coat", "Layers", "Warm shoes"]
            }
        },

        kawaguchi: {
            name: "Kawaguchi-ko",
            coords: [35.5131, 138.7697],
            region: "Chubu",
            prefecture: "Yamanashi",
            baseLocation: true,
            stayDuration: 3,
            dates: { start: "2025-01-25", end: "2025-01-28" },
            description: "Perfect Mt. Fuji base with winter fireworks and iconic lake reflections",
            winterHighlights: [
                "Lake Kawaguchi Winter Fireworks (Jan 25-Feb 23)",
                "Mt. Fuji highest visibility rates",
                "Chureito Pagoda snow scenes",
                "Traditional ryokan onsen experience"
            ],
            accommodations: {
                luxury: [
                    {
                        name: "Hotel Konansou",
                        priceRange: "¥35,000-50,000",
                        location: "Lakeside",
                        amenities: ["Mt. Fuji views", "Private onsen", "Rooftop foot baths"]
                    },
                    {
                        name: "Ubuya",
                        priceRange: "¥30,000-45,000",
                        location: "Lakeside",
                        amenities: ["Lake views", "Hot springs", "Traditional hospitality"]
                    }
                ],
                midRange: [
                    {
                        name: "Akaishi Ryokan",
                        priceRange: "¥18,000-28,000",
                        location: "Lake view",
                        amenities: ["Traditional rooms", "Public onsen", "Free shuttle"]
                    }
                ],
                budget: [
                    {
                        name: "Komaya Ryokan",
                        priceRange: "¥8,000-15,000",
                        location: "Mountain view",
                        amenities: ["Authentic tatami", "Shared facilities", "Traditional hospitality"]
                    }
                ]
            },
            transportation: {
                from: "Tokyo via Fuji Excursion train (¥2,460)",
                to: "Takayama via limited express (¥4,500)",
                local: "Retro buses and walking"
            },
            weather: {
                avgTemp: { high: 5, low: -5, unit: "°C" },
                conditions: "Clear mountain air, occasional snow",
                clothing: ["Warm layers", "Waterproof boots", "Camera protection"]
            }
        },

        takayama: {
            name: "Takayama",
            coords: [36.1428, 137.2531],
            region: "Chubu",
            prefecture: "Gifu",
            baseLocation: true,
            stayDuration: 4,
            dates: { start: "2025-01-28", end: "2025-02-01" },
            description: "Historic Alpine town with traditional architecture and premium Hida beef",
            winterHighlights: [
                "Shirakawa-go winter illuminations (Feb 1)",
                "Seven sake breweries (100+ years old)",
                "Miyagawa Morning Market",
                "Hida beef experiences"
            ],
            accommodations: {
                luxury: [
                    {
                        name: "Ryokan Seiryu",
                        priceRange: "¥45,000-65,000",
                        location: "Historic district",
                        amenities: ["Natural onsen", "Traditional architecture", "Premium service"]
                    }
                ],
                midRange: [
                    {
                        name: "Auberge Hidanomori",
                        priceRange: "¥20,000-35,000",
                        location: "Hill location",
                        amenities: ["Renovated rooms", "Shuttle service", "Mountain views"]
                    },
                    {
                        name: "Hotel Associa Takayama Resort",
                        priceRange: "¥18,000-30,000",
                        location: "Resort area",
                        amenities: ["Modern amenities", "Traditional elements", "Onsen access"]
                    }
                ],
                budget: [
                    {
                        name: "Takayama Ninja House",
                        priceRange: "¥6,000-10,000",
                        location: "Old town",
                        amenities: ["Tatami rooms", "Shared facilities", "Authentic experience"]
                    }
                ]
            },
            transportation: {
                from: "Kawaguchi-ko via express (¥4,500)",
                to: "Kyoto via limited express (¥5,720)",
                local: "Walking and local buses"
            },
            weather: {
                avgTemp: { high: 3, low: -8, unit: "°C" },
                conditions: "Snow likely, mountain weather",
                clothing: ["Heavy winter gear", "Snow boots", "Hand warmers"]
            }
        },

        kyoto: {
            name: "Kyoto",
            coords: [35.0116, 135.7681],
            region: "Kansai",
            prefecture: "Kyoto",
            baseLocation: true,
            stayDuration: 4,
            dates: { start: "2025-02-01", end: "2025-02-05" },
            description: "Ancient capital with temples, gardens, and traditional culture",
            winterHighlights: [
                "Kinkaku-ji golden pavilion in snow",
                "Winter illuminations at Kodai-ji",
                "Reduced crowds at major temples",
                "Early plum blossoms at Kitano Tenmangu"
            ],
            accommodations: {
                luxury: [
                    {
                        name: "The Ritz-Carlton Kyoto",
                        priceRange: "¥60,000-85,000",
                        location: "Kamogawa River",
                        amenities: ["Traditional design", "River views", "Premium service"]
                    },
                    {
                        name: "Four Seasons Kyoto",
                        priceRange: "¥55,000-75,000",
                        location: "Temple district",
                        amenities: ["Garden setting", "Cultural programs", "Spa facilities"]
                    }
                ],
                midRange: [
                    {
                        name: "Royal Park Hotel Sanjo",
                        priceRange: "¥15,000-25,000",
                        location: "Central Kyoto",
                        amenities: ["Modern comfort", "Temple access", "Business facilities"]
                    }
                ],
                budget: [
                    {
                        name: "Guesthouse Soi",
                        priceRange: "¥6,000-12,000",
                        location: "Traditional neighborhood",
                        amenities: ["Local atmosphere", "Shared spaces", "Cultural immersion"]
                    }
                ]
            },
            transportation: {
                from: "Takayama via limited express (¥5,720)",
                to: "Osaka via express (¥560)",
                local: "JR Kansai Wide Area Pass (5 days, ¥11,000)"
            },
            weather: {
                avgTemp: { high: 8, low: 1, unit: "°C" },
                conditions: "Cool and dry, occasional snow",
                clothing: ["Warm coat", "Comfortable walking shoes", "Layers"]
            }
        },

        osaka: {
            name: "Osaka",
            coords: [34.6937, 135.5023],
            region: "Kansai",
            prefecture: "Osaka",
            baseLocation: true,
            stayDuration: 3,
            dates: { start: "2025-02-05", end: "2025-02-07" },
            description: "Food paradise with street food culture and vibrant entertainment",
            winterHighlights: [
                "Dotonbori winter food scene",
                "Hot takoyaki and okonomiyaki",
                "Kuromon Market fresh seafood",
                "Winter illuminations at Osaka Castle"
            ],
            accommodations: {
                luxury: [
                    {
                        name: "Four Seasons Osaka",
                        priceRange: "¥50,000-70,000",
                        location: "Business district",
                        amenities: ["City views", "Premium dining", "Spa facilities"]
                    },
                    {
                        name: "Swissotel Nankai Osaka",
                        priceRange: "¥25,000-40,000",
                        location: "Above Namba Station",
                        amenities: ["Direct station access", "Shopping convenience", "International standards"]
                    }
                ],
                midRange: [
                    {
                        name: "Holiday Inn Osaka Namba",
                        priceRange: "¥12,000-20,000",
                        location: "Entertainment district",
                        amenities: ["Food district access", "Modern rooms", "International brand"]
                    }
                ],
                budget: [
                    {
                        name: "Nono Namba Hotel",
                        priceRange: "¥6,000-10,000",
                        location: "Near entertainment areas",
                        amenities: ["Clean rooms", "Convenient location", "Value pricing"]
                    }
                ]
            },
            transportation: {
                from: "Kyoto via express (¥560)",
                to: "Airport via Kansai Express (¥1,170)",
                local: "Included in regional pass"
            },
            weather: {
                avgTemp: { high: 9, low: 2, unit: "°C" },
                conditions: "Mild winter, occasional rain",
                clothing: ["Medium coat", "Umbrella", "Comfortable shoes"]
            }
        }
    },

    // Daily itinerary with activities
    dailyPlans: [
        // Tokyo Days 1-7
        {
            day: 1,
            date: "2025-01-18",
            location: "tokyo",
            title: "Arrival & Tokyo Orientation",
            activities: [
                {
                    time: "14:00",
                    name: "Arrive at Narita/Haneda",
                    duration: 120,
                    type: "transportation",
                    cost: 3070
                },
                {
                    time: "17:00",
                    name: "Check-in Shinjuku Hotel",
                    duration: 60,
                    type: "accommodation"
                },
                {
                    time: "19:00",
                    name: "First Tokyo dinner",
                    duration: 120,
                    type: "dining",
                    cost: 3000,
                    location: "Shinjuku Golden Gai"
                }
            ]
        },
        {
            day: 2,
            date: "2025-01-19",
            location: "tokyo",
            title: "Traditional Tokyo",
            activities: [
                {
                    time: "09:00",
                    name: "Meiji Shrine visit",
                    duration: 120,
                    type: "cultural",
                    cost: 0,
                    description: "New Year atmosphere and traditional prayers"
                },
                {
                    time: "12:00",
                    name: "Harajuku exploration",
                    duration: 180,
                    type: "culture",
                    cost: 2000
                },
                {
                    time: "16:00",
                    name: "Imperial Palace East Gardens",
                    duration: 120,
                    type: "nature",
                    cost: 0,
                    description: "Winter peonies and peaceful landscapes"
                }
            ]
        },
        // Continue with more detailed daily plans...
        {
            day: 8,
            date: "2025-01-25",
            location: "kawaguchi",
            title: "Mt. Fuji Base - Fireworks Night",
            activities: [
                {
                    time: "10:00",
                    name: "Travel to Kawaguchi-ko",
                    duration: 150,
                    type: "transportation",
                    cost: 2460
                },
                {
                    time: "14:00",
                    name: "Check-in lakeside ryokan",
                    duration: 60,
                    type: "accommodation"
                },
                {
                    time: "20:00",
                    name: "Lake Kawaguchi Winter Fireworks",
                    duration: 30,
                    type: "festival",
                    cost: 0,
                    description: "First fireworks show of your visit"
                }
            ]
        }
        // Add remaining days following the same pattern...
    ],

    // Route configuration for map display
    routes: [
        {
            id: "main_route",
            name: "Winter Japan Journey",
            segments: [
                {
                    from: [35.6762, 139.6503], // Tokyo
                    to: [35.5131, 138.7697],   // Kawaguchi-ko
                    mode: "train",
                    duration: 150,
                    cost: 2460,
                    color: "#ff6b6b"
                },
                {
                    from: [35.5131, 138.7697], // Kawaguchi-ko
                    to: [36.1428, 137.2531],   // Takayama
                    mode: "train",
                    duration: 240,
                    cost: 4500,
                    color: "#4ecdc4"
                },
                {
                    from: [36.1428, 137.2531], // Takayama
                    to: [35.0116, 135.7681],   // Kyoto
                    mode: "train",
                    duration: 180,
                    cost: 5720,
                    color: "#45b7d1"
                },
                {
                    from: [35.0116, 135.7681], // Kyoto
                    to: [34.6937, 135.5023],   // Osaka
                    mode: "train",
                    duration: 45,
                    cost: 560,
                    color: "#45b7d1"
                }
            ]
        }
    ],

    // Winter-specific recommendations
    winterSpecifics: {
        festivals: [
            {
                name: "Lake Kawaguchi Winter Fireworks",
                dates: "January 25 - February 23, 2025",
                location: "kawaguchi",
                schedule: "Weekends 8:00-8:20pm"
            },
            {
                name: "Shirakawa-go Winter Illuminations",
                dates: "February 1, 2025",
                location: "takayama",
                description: "UNESCO village thatched houses illuminated"
            }
        ],
        packingList: [
            "Heavy winter coat",
            "Waterproof boots",
            "Thermal layers",
            "Hand/foot warmers",
            "Waterproof gloves",
            "Warm hat",
            "Portable phone charger",
            "Camera protection"
        ],
        tips: [
            "Book Shirakawa-go illumination tour in advance",
            "Carry hand warmers for outdoor photography",
            "Layer clothing for indoor/outdoor temperature differences",
            "Download offline maps for rural areas"
        ]
    }
};

// Map and route configuration
const MAP_CONFIG = {
    center: [36.2048, 138.2529], // Center of Japan
    zoom: 6,
    minZoom: 5,
    maxZoom: 18,
    zoomControl: false
};

const TILE_CONFIG = {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
};

const MARKER_CONFIG = {
    base: 10,
    main: 8,
    activity: 6,
    hoverIncrease: 3,
    strokeWeight: 2,
    strokeColor: 'white'
};

// Animation configuration
const ANIMATION_CONFIG = {
    snakeSpeed: 200, // pixels per second
    snakePause: 500, // milliseconds between segments
    arrowRepeat: 60, // pixels between arrows
    arrowSize: 15,   // pixel size of arrows
    timelineSpeed: 1000 // milliseconds per day
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TRAVEL_DATA,
        MAP_CONFIG,
        TILE_CONFIG,
        MARKER_CONFIG,
        ANIMATION_CONFIG
    };
}