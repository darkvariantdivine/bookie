/*
This .js file initialises the WCS database, it performs the following:
    1. Creates the WCS database
    2. Creates the WCS user
    3. Creates all the required collections and default values required for the WCS to operate.

This script needs to be run with administrative access.
 */

// Creates the WCS database
db.getSiblingDB('bookie').dropDatabase();
bookie_db = db.getSiblingDB('bookie');

// Bookings collection
bookie_db.createCollection('bookings');
bookie_db.bookings.createIndex({id: 1, lastModified: -1}, {unique: true});

// Users collection
bookie_db.createCollection('users');
bookie_db.users.createIndex({id: 1}, {unique: true});
bookie_db.users.insertMany(
    [
        {
            id: "b4811bbb0de74ca0b6c8feb541896746",
            email: "test1@bookie.org",
            password: "958b262e3b559ea13abf15a1d77f1e075f9c63ad7fa69d239672f78ccfb1af08",
            salt: "9347e591cbe15dc9",
            name: "Test User 1",
            description: "This is test user 1",
            image: "/TestUser1.jpg",
            rooms: []
        },
        {
            id: "2f5575ba0b1a48c896fcc82e9dcf6f3e",
            email: "test2@bookie.org",
            password: "5728d7b7934a554bc5a5df9d75bd2723b3847227674f6cc603ca5770d484d4e5",
            salt: "2f436f2bd4ac735a",
            name: "Test User 2",
            description: "This is test user 2",
            image: "/TestUser2.png",
            rooms: []
        },
        {
            id: "ee77f20983f8470d9ccaf094c3e46325",
            email: "admin1@bookie.org",
            password: "3ae9178f23dd6d90c1763c5ab163d8b014a346cf0c197db6f865cf99eb631bf6",
            salt: "351fd337b988319b",
            name: "Admin User 1",
            description: "This is admin user 1",
            image: "/AdminUser1.png",
            rooms: []
        },
    ]
)

// Rooms collection
bookie_db.createCollection('rooms');
bookie_db.rooms.createIndex({id: 1}, {unique: true});
bookie_db.rooms.insertMany(
    [
        {
            id: "8af9ab04f6ea4d64b25358781c92e07b",
            name: "Meeting Room 1",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 1,
            images: [
                "/MeetingRoom1.jpeg",
                "/MeetingRoom1.jpeg",
                "/MeetingRoom1.jpeg",
                "/MeetingRoom1.jpeg",
                "/MeetingRoom1.jpeg",
            ]
        },
        {
            id: "7e1ad2e0a6d04be797176dd1bcdfc729",
            name: "Meeting Room 2",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 5,
            images: [
                "/MeetingRoom2.jpg",
                "/MeetingRoom2.jpg",
                "/MeetingRoom2.jpg",
                "/MeetingRoom2.jpg",
                "/MeetingRoom2.jpg",
            ]
        },
        {
            id: "9b5b442460cd46a9a51a62b0d2ed52d8",
            name: "Meeting Room 3",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 5,
            images: [
                "/MeetingRoom3.jpg",
                "/MeetingRoom3.jpg",
                "/MeetingRoom3.jpg",
                "/MeetingRoom3.jpg",
                "/MeetingRoom3.jpg",
            ]
        },
        {
            id: "e780777314124951bf42a97e7da89101",
            name: "Meeting Room 4",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 10,
            images: [
                "/MeetingRoom4.jpg",
                "/MeetingRoom4.jpg",
                "/MeetingRoom4.jpg",
                "/MeetingRoom4.jpg",
                "/MeetingRoom4.jpg",
            ]
        },
        {
            id: "4905ea67430c4167a287536157f87c00",
            name: "Meeting Room 5",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 10,
            images: [
                "/MeetingRoom5.jpeg",
                "/MeetingRoom5.jpeg",
                "/MeetingRoom5.jpeg",
                "/MeetingRoom5.jpeg",
                "/MeetingRoom5.jpeg",
            ]
        },
        {
            id: "7aa668c3af294b82b84a4c0160db7c6a",
            name: "Meeting Room 6",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 20,
            images: [
                "/MeetingRoom6.jpeg",
                "/MeetingRoom6.jpeg",
                "/MeetingRoom6.jpeg",
                "/MeetingRoom6.jpeg",
                "/MeetingRoom6.jpeg",
                "/MeetingRoom6.jpeg",
            ]
        },
        {
            id: "7fc5eadc5e954bfd97058866c91d32f9",
            name: "Meeting Room 7",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 20,
            images: [
                "/MeetingRoom7.jpg",
                "/MeetingRoom7.jpg",
                "/MeetingRoom7.jpg",
                "/MeetingRoom7.jpg",
                "/MeetingRoom7.jpg",
                "/MeetingRoom7.jpg",
            ]
        },
        {
            id: "ace5281c531a44b38fa685359c502acc",
            name: "Meeting Room 8",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 20,
            images: [
                "/MeetingRoom8.jpg",
                "/MeetingRoom8.jpg",
                "/MeetingRoom8.jpg",
                "/MeetingRoom8.jpg",
                "/MeetingRoom8.jpg",
                "/MeetingRoom8.jpg",
            ]
        },
        {
            id: "1fea3515b1f9476ba773b290ddd4ce1d",
            name: "Meeting Room 9",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 15,
            images: [
                "/MeetingRoom9.jpg",
                "/MeetingRoom9.jpg",
                "/MeetingRoom9.jpg",
                "/MeetingRoom9.jpg",
                "/MeetingRoom9.jpg",
                "/MeetingRoom9.jpg",
            ]
        },
        {
            id: "c521b2a3c4164b6fa731e47780706f57",
            name: "Meeting Room 10",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 10,
            images: [
                "/MeetingRoom10.jpg",
                "/MeetingRoom10.jpg",
                "/MeetingRoom10.jpg",
                "/MeetingRoom10.jpg",
                "/MeetingRoom10.jpg",
            ]
        },
        {
            id: "043bad134585485393ff29dcfc644d38",
            name: "Meeting Room 11",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
                "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
                "Id porta nibh venenatis cras sed felis eget. Rhoncus urna neque viverra " +
                "justo nec ultrices dui sapien. Erat imperdiet sed euismod nisi porta lorem. " +
                "Mi bibendum neque egestas congue quisque egestas.",
            capacity: 15,
            images: []
        },
    ]
)

// Sessions collection
bookie_db.createCollection('sessions');
