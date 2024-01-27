<p align="center"><img src="client/public/sym-outline.svg" width="80"/></p>

<h3 align="center">The COMPA Initiative</h3>
<p align="center"><a href="https://compa.so">compa.so</a></p>

<p align="center"><img src="assets/sc-timetable.png" style="border-radius: 1rem" width="500"/></p>

# Compa

A companion application for students to manage and access resources at their higher education institution.

## About

As a fresher, settling into school could be easier. You usually need to find:

- Groups/Clubs you are interested in
- Semester timetables
- Resources from past semesters

For continuting students, it's just as to track where documents or ckass notes are when conversations are strewn across multiple platfroms.

Being a student is hard enough, that's why Compa aims to be _resource-central_ for higher education institutions, and save you from one source of stress.

As continuing students, keeping up with any of these is scattered across multiple platforms. Compa aims to offer a cohesive experience for all of these.

Your open, compact, companion and compass. That is _Compa_.

## Features

- [x] Timetable: See lecture schedule for a semester and import to your calendar. ❇️

- [ ] Discussions: Ask questions, share ideas and interact with other students.

- [ ] Communities: Find and join groups that interest you.

## Supported Schools

- [x] Kwame Nkrumah University of Science and Technology (KNUST) - [Website](https://knust.compa.so)

> If you'd like to set up compa for your school, please create an issue with the title: `School Request: <School Name>`.

## Run locally

Clone the project

```bash
git clone https://github.com/blackmann/compa
cd compa
```

Run the following commands:

```bash
yarn install
yarn workspace client prisma migrate deploy
yarn workspace client prisma generate
```

Start the project in dev mode.

```bash
yarn dev:client
```

## Contributions

Contributions are always welcome! We don't have a code of conduct right now, but we will soon!

## Roadmap

Coming soon...
