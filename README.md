<p align="center"><img src="client/public/sym-outline.svg" width="80"/></p>

<h3 align="center">The COMPA Initiative</h3>
<p align="center"><a href="https://compa.so">compa.so</a></p>

<p align="center"><img src="assets/sc-timetable.png" style="border-radius: 1rem" width="500"/></p>

## About the project

Compa aims to be the resource-central for higher education. As a fresher, easing into the school system has lots of friction. Finding interest groups/clubs, timetable, starting conversations, learning from seniors and past students is simply difficult.

As continuing students, keeping up with any of these is scattered across multiple platforms. Compa aims to offer a cohesive experience for all of these.

Companion, _compass_, compact and open. Compa is all of these and more.

## Features

- [x] Timetable: See lecture schedule for a semester and download to your calendar. ❇️

- [ ] Discussions: Ask questions, share ideas and comments with other students. (Coming next). Discussions will be threaded and searchable. They can also be scoped to a specific programme, course, level, etc.

  With discussions, you can add polls, flashcards, quizzes and files/docs.

- [ ] Communities: Join interest groups and clubs. (Coming some time)

## Schools

- [x] Kwame Nkrumah University of Science and Technology (KNUST): https://knust.compa.so

> If you'll like to set up compa for your school, please create an issue with the title: `School Request: <School Name>`.

## Project setup

Run the following commands after cloning the project:

```sh
yarn install
yarn workspace client prisma migrate deploy
yarn workspace client prisma generate
```

Run `yarn dev:client` to start the project in dev.
