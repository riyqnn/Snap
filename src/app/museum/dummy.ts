export const products = Array.from({ length: 9 }, (_, i) => ({
    id: `ID 87845${i}`,
    name: i % 3 === 0 ? "Niskala" : i % 3 === 1 ? "MOVE" : "WEARIT",
    title:
        i % 3 === 0
            ? "Couple Bnw Batch 1"
            : i % 3 === 1
                ? "Yellow American Rider Batch 1"
                : "Pink Holiday Shirt Batch 1",
    date: i % 3 === 0 ? "June 28, 2025" : i % 3 === 1 ? "May 18, 2025" : "July 02, 2025",
    collections: i % 3 === 0 ? "8 Collectors" : i % 3 === 1 ? "34 Collectors" : "4 Collectors",
    image: i % 3 === 0
        ? "https://i.pinimg.com/736x/f8/7a/2b/f87a2bb6daa81a0424ad3775b49310ad.jpg"
        : i % 3 === 1
            ? "https://i.pinimg.com/736x/d4/96/df/d496df36be2e491c9c8f2ef3568b8fc7.jpg"
            : "https://i.pinimg.com/736x/9f/95/89/9f9589e74c377ad2f36c559f6b59deff.jpg",
}));