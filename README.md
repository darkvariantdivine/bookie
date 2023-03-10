# Bookie
Bookie organises your workplace, allowing users to reserve meeting rooms.

## Features

Presently, Bookie supports the following features:
1. View all meeting rooms/facilities for booking
2. Graphical interactive timeline to select and view available timeslots for booking
3. Submit, edit, cancel and view existing bookings
4. User authentication via tokens, bookings require authentication
5. Responsive UI that scales on different browser sizes, including mobile
6. Live feedback via notifications 

## Tech Stack

Bookie was developed with the following technology stack:

- Frontend
  1. NodeJS 18
  2. Typescript
  3. ReactJS (UI framework)
  4. NextJS 13 (UI server backbone)
  5. React Query (Data fetching and caching)
  6. Mantine 5 (Styling framework)
  7. Mantine React Table (Styling component)
- Backend
  1. Python 3.10
  2. FastAPI (REST Backend)
- Testing & Development
  1. Postman + Newman (REST APIs)
  2. Jest (Unit testing and component testing)
  3. OpenAPI 3.0 documentation (Documentation)
  4. Playwright ^ (End-to-end testing)
- Deployment
  1. MongoDB (Database)
  3. Nginx (Reverse proxy)
  4. Docker (Containerisation)
  5. Docker-compose (Orchestrator)

^ = work in progress

## Principles

The tech stack was chosen in accordance with the following principles:
1. Rapid prototyping
2. Agile product development
3. Future Scalability

These incorporate and promote velocity, flexibility and evolution within the
product development process.

### Rapid Prototyping

Bootstrapping a product requires speed and this must be inherently supported by 
the tech stack. One consideration is the familiarity of the developers with the 
technologies. In this case, the tech stack I choose requires the least learning 
and experimentation on my part.

The frameworks chosen also abstract a substantial amount of styling and formatting
required to deliver a frontend UI, freeing up developers to focus on business logic.
NextJS abstracts away much of the setup and boilerplate code required to deliver a
production-ready website. The sitemap of the website is also inherently reflected in
the structure with the new NextJS `/app` directory. NextJS also provides many tools 
that simplify the basic website development tasks such as routing and linking. 

One of most tedious aspects of web development is dealing with styling and formatting.
This is simplified by the Mantine framework that provides a set of stylish components
with APIs for developers to configure them. Along with Mantine React Table, another
Mantine based table that simplifies the presentation of data in a tabular format, these
frameworks allow developers to develop stylish frontends rapidly.
 
Similarly on the backend, FastAPI provides a set of resources that allow users to 
rapidly deliver RESTful backend systems that conform to APIs prescribed by an 
OpenAPI document. This complements the frameworks that amplify development speed on 
the frontend. 

### Agile Product Development

The initial product runway is oftentimes shrouded by uncertainty as product requirements
are still in flux hence the tech stack needs to support flexibility and agility. These 
qualities are also supported by the frameworks chosen as they provide interfaces that
allow configuration and customisation for more complex use cases. 

Notably, a NoSQL database MongoDB was chosen for this reason as the data model is 
conventionally the most inflexible aspect of product development. Choosing a schemaless
database allows the data model to evolve alongside the product, separately from the
associations and relationships that may constrict development. 

### Future Scalability

The product development cycle eventually reaches an inflexion point after a certain 
period of time. This is usually accompanied by indications that the existing tech 
stack is unable to support the requirements e.g. increasing latency per request. At 
this point, we need to look at systems to extend and scale the system provided.

One of the most straightforward paths is to deploy the product on the cloud and scale
resources accordingly. This necessitates a cloud-native stack that can be easily
deployed online and is reflected in the choice of deployment tools e.g. docker 
containers that integrate easily with all cloud providers.

Another aspect is integrating API versioning early on that allows developers to 
isolate feature updates and maintain existing systems. This has already been integrated
into Bookie's API design. 

## Development

This section captures how to setup a development environment to work with Bookie

### Frontend

Install NodeJS 18 with nvm

```shell
nvm install 18.14.1
```

Install dependencies with npm

```shell
npm install
```

Start NextJS server to view UI

```shell
npm run dev
```

Run tests
```shell
npm run tests-unit  # Jest tests
npm run tests-postman  # Postman tests
```

---

**Note:**

You will need to start the Backend server before the Frontend works

---

### Backend

Install Python 3.10 with pyenv

```shell
pyenv install 3.10
```

Install Python dependencies

```shell
python3 -m venv venv  # Creates a new virtual environment
source venv/bin/activate  
pip3 install poetry  # Installs packages to virtual environment
poetry install
```

#### Run with MongoDB

Install MongoDB, instructions can be found at this
[link](https://www.mongodb.com/docs/manual/administration/install-community/)

Load MongoDB with default data

```shell
mongo mongo/setup/bookie.js
```

Build and run the backend server

```shell
poetry build
python3 -m bookie
```

#### Run with MongoDB in Docker

Pull and run MongoDB docker
```shell
docker pull mongo:4.4
docker run -d -p 27017:27017 --name bookie_mongo mongo:4.4
```

Load MongoDB with default data

```shell
docker cp mongo/setup/bookie.js .
docker exec -it bookie_mongo /bin/sh

# In docker environment
mongo mongo/setup/bookie.js
```

Build and run the backend server

```shell
poetry build
python3 -m bookie
```

---

**Note:**

If you intend to run MongoDB on a separate cluster/host or with a customised port,
you can customise the database host and database that is used via the following 
environment parameters below:

```shell
DATABASE=my_custom_mongo_database python3 -m bookie
DATABASE_HOST=my_custom_mongo_host_with_custom_port:3237 python3 -m bookie
```

You will need to update the load script found in mongo/setup/bookie.js to load
data into your customised database.

---

---

**Note:**

You will need to stop any running MongoDB instance before running the command
above with:

```shell
sudo systemctl stop mongod
```

To restart the MongoDB instance:

```shell
sudo systemctl start mongod
```

---

## Deployment

This section captures how to setup and deploy Bookie in a production-ready manner.

Install Docker, instructions can be found at this 
[link](https://docs.docker.com/get-docker/)

Install Docker compose 
```shell
pip3 install docker-compose
```

Run container build scripts 
```shell
npm run docker-build
```

Setup deployment environment
```shell
npm run docker-setup
```

Start containers
```shell
npm run docker-start
```

Stop containers
```shell
npm run docker-stop
```

Reset environment
```shell
npm run docker-reset
```

## Usage

Bookie requires users to log in before creating bookings. The following users are 
provided by default:
1. test1@bookie.org
2. test2@bookie.org
3. admin1@bookie.org

All the passwords are Hello_world1

## Improvements

1. Rewrite backend in NodeJS to align programming language
2. Using pagination to retrieve and display rooms and bookings
3. More complex REST API filters to search for bookings and rooms
4. Additional admin pages for creating, updating and deleting rooms and users
5. When data model is confirmed, migrate to PostgreSQL from MongoDB to capture
   relationships between data models
6. Improving unit tests and adding end-to-end tests
