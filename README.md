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
  3. ReactJS
  4. NextJS 13
  5. Mantine 5
  6. Mantine React Table
- Backend
  1. Python 3.10
  2. FastAPI
- Testing & Development
  1. Postman (APIs)
  2. Jest (Unit testing and component testing)
  3. OpenAPI 3.0 documentation
  4. Playwright ^ (End-to-end testing)
- Deployment
  1. MongoDB
  3. Nginx as reverse proxy ^
  4. Docker ^
  5. Docker-compose ^

^ = still in development


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

---

**Note:**

You will need to start the Backend server before the Frontend works

---

### Backend

Install MongoDB, instructions can be found at this 
[link](https://www.mongodb.com/docs/manual/administration/install-community/)

Install Python 3.10 with pyenv

```shell
pyenv install 3.10
```

Install Python dependencies

```shell
pip3 install poetry
poetry install
```

Build and run the backend server

```shell
poetry build
python3 -m bookie
```

## Deployment (Work in Progress)

This section captures how to setup and deploy the Bookie environment locally.

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
npm run gen-certs
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

