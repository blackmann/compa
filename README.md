<p align="center"><img src="client/public/sym-outline.svg" width="80"/></p>

<h3 align="center">The COMPA Initiative</h3>
<p align="center"><a href="https://compa.so">compa.so</a></p>

## About the project

Compa aims to be the resource-central for higher education. As a fresher, easing into the school system has lots of friction. Finding interest groups/clubs, timetable, starting conversations, learning from seniors and past students is simply difficult.

As continuing students, keeping up with any of these is scattered across multiple platforms. Compa aims to offer a cohesive experience for all of these.

Companion, _compass_, compact and open. Compa is all of these and more.

## Project setup

Run the following commands after cloning the project:

```sh
yarn install
yarn workspace client prisma generate
yarn workspace client prisma migrate deploy
```

Run `yarn dev:client` to start the project in dev.
