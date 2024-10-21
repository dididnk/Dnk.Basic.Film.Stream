const movies = [
    {
        id: '1',
        title: 'Oceans 8',
        category: 'Comedy',
        likes: 4,
        dislikes: 1,
        image: "https://wallpapercave.com/wp/wp3051366.png",
        liked: false,
        disliked: false
    }, {
        id: '2',
        title: 'Midnight Sun',
        category: 'Comedy',
        likes: 2,
        dislikes: 0,
        image: "https://c4.wallpaperflare.com/wallpaper/36/195/719/midnight-sun-2018-movie-wallpaper-preview.jpg",
        liked: false,
        disliked: false
    }, {
        id: '3',
        title: 'Les indestructibles 2',
        category: 'Animation',
        likes: 3000000,
        dislikes: 1500,
        image: "https://wallpaper.forfun.com/fetch/25/25245771d3ceea2334ae8a61b8e4a87d.jpeg?w=1200&r=0.5625",
        liked: false,
        disliked: false
    }, {
        id: '4',
        title: 'Sans un bruit',
        category: 'Thriller',
        likes: 6,
        dislikes: 6,
        image: "https://wallpaper.forfun.com/fetch/84/84ab152ac115d02619ae34cec65db3f0.jpeg?w=1200&r=0.5625",
        liked: false,
        disliked: false
    }, {
        id: '5',
        title: 'Creed II',
        category: 'Drame',
        likes: 16,
        dislikes: 2,
        image: "https://w0.peakpx.com/wallpaper/650/576/HD-wallpaper-creed-2-fan-art-adonis-johnson-2018-movie-creed-ii-michael-bakari-jordan.jpg",
        liked: false,
        disliked: false
    }, {
        id: '6',
        title: 'Pulp Fiction',
        category: 'Thriller',
        likes: 11,
        dislikes: 3,
        image: "https://wallpaper.forfun.com/fetch/ee/eec8818574317d498033e14c23d2af4c.jpeg?w=1200&r=0.5625",
        liked: false,
        disliked: false
    }, {
        id: '7',
        title: 'Pulp Fiction',
        category: 'Thriller',
        likes: 12333,
        dislikes: 32,
        image: "https://wallpaper.forfun.com/fetch/26/26dfe34c153fb1e8984d26249d53a8af.jpeg?w=1200&r=0.5625",
        liked: false,
        disliked: false
    }, {
        id: '8',
        title: 'Seven',
        category: 'Thriller',
        likes: 2,
        dislikes: 1,
        image: "https://wallpaper.forfun.com/fetch/37/37b85ba0d356f849d72fb71c78180fbe.jpeg?w=1200&r=0.5625",
        liked: false,
        disliked: false
    }, {
        id: '9',
        title: 'Inception',
        category: 'Thriller',
        likes: 2,
        dislikes: 1,
        image: "https://wallpaper.forfun.com/fetch/cb/cb8ccadb94338825823225c91fcdc5f5.jpeg?w=1200&r=0.5625",
        liked: false,
        disliked: false
    }, {
        id: '10',
        title: 'Gone Girl',
        category: 'Thriller',
        likes: 22,
        dislikes: 12,
        image: "https://w0.peakpx.com/wallpaper/441/694/HD-wallpaper-movie-gone-girl-ben-affleck-rosamund-pike.jpg",
        liked: false,
        disliked: false
    },
]

export const movies$ = new Promise((resolve, reject) => setTimeout(resolve, 100, movies))
