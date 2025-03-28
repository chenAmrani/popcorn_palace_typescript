<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Popcorn Palace Movie Ticket Booking System

## Overview

The Popcorn Palace Movie Ticket Booking System is a backend service designed to handle various operations related to movie,showtime, and booking management.

## Functionality

The system provides the following APIs:

- **Movie API**: Manages movies available on the platform.
- **Showtime API**: Manages movies showtime on the theaters.
- **Booking API**: Manages the movie tickets booking.

## Technical Aspects

The system is built using NestJS, a progressive Node.js framework for building efficient and scalable server-side applications. Data persistence is managed using PostgreSQL. The app is containerized with Docker.


## APIs

### Movies APIs

| API Description             | Endpoint                         | Request Body                                                                                              | Response Status | Response Body                                                                                                                                                                                                                                         |
| --------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Get all movies              | GET /movies                      |                                                                                                           | 200 OK          | [ { "id": 12345, "title": "Sample Movie Title 1", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }, { "id": 67890, "title": "Sample Movie Title 2", "genre": "Comedy", "duration": 90, "rating": 7.5, "releaseYear": 2024 } ] |
| Get movie by ID             | GET /movies/{id}                 |                                                                                                           | 200 OK          | { "id": 12345, "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }                                                                                                                                |
| Add a movie                 | POST /movies                     | { "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 } | 201 CREATED     | { "id": 1, "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }                                                                                                                                  |
| Update a movie by title     | PUT /movies/update/{movieTitle} | { "title"?: string, "genre"?: string, "duration"?: number, "rating"?: number, "releaseYear"?: number }    | 200 OK          | { "id": 1, "title": "New Title", "genre": "Action", "duration": 120, "rating": 9.0, "releaseYear": 2025 }                                                                                                                                           |
| Update a movie by ID        | PUT /movies/update/id/{id}      | { "title"?: string, "genre"?: string, "duration"?: number, "rating"?: number, "releaseYear"?: number }    | 200 OK          | { "id": 1, "title": "New Title", "genre": "Action", "duration": 120, "rating": 9.0, "releaseYear": 2025 }                                                                                                                                           |
| Delete movie by title       | DELETE /movies/{movieTitle}      |                                                                                                           | 200 OK          | { "message": "Movie with title \"{movieTitle}\" was deleted successfully." }                                                                                                                                                                        |
| Delete movie by ID          | DELETE /movies/id/{id}           |                                                                                                           | 200 OK          | { "message": "Movie with ID \"{id}\" was deleted successfully." }                                                                                                                                                                                   |

### Showtimes APIs

<<<<<<< HEAD
| API Description    | Endpoint                            | Request Body                                                                                                                                      | Response Status | Response Body                                                                                                                                              |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------- | ------------------------ | --- | -------------- | --- |
| Get showtime by ID | GET /showtimes/{showtimeId}         |                                                                                                                                                   | 200 OK          | { "id": 1, "price":50.2, "movieId": 1, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } |     | Delete a restaurant | DELETE /restaurants/{id} |     | 204 No Content |     |
| Add a showtime     | POST /showtimes                     | { "movieId": 1, "price":20.2, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } | 200 OK          | { "id": 1, "price":50.2,"movieId": 1, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" }  |
| Update a showtime  | POST /showtimes/update/{showtimeId} | { "movieId": 1, "price":50.2, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } | 200 OK          |                                                                                                                                                            |
| Delete a showtime  | DELETE /showtimes/{showtimeId}      |                                                                                                                                                   | 200 OK          |                                                                                                                                                            |
=======
| API Description                 | Endpoint                        | Request Body                                                                                              | Response Status | Response Body                                                                                                                                                           |
| ------------------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Get all showtimes              | GET /showtimes/all              |                                                                                                           | 200 OK          | [ { id, theater, start_time, end_time, price, movieId } ]                                                                                                               |
| Get showtime by ID             | GET /showtimes/{showtimeId}     |                                                                                                           | 200 OK          | { id, theater, start_time, end_time, price, movieId }                                                                                                                   |
| Get showtimes with booking data| GET /showtimes/bookings         |                                                                                                           | 200 OK          | [ { id, theater, start_time, end_time, price, movie_title, ticketsSold } ]                                                                                              |
| Add a showtime                 | POST /showtimes                 | { "movieId": 1, "theater": "Sample Theater", "start_time": "...", "end_time": "...", "price": 50 }        | 201 CREATED     | { id, theater, start_time, end_time, price, movie }                                                                                                                     |
| Update a showtime              | PUT /showtimes/update/{id}      | { "movieId"?: number, "theater"?: string, "start_time"?: string, "end_time"?: string, "price"?: number }  | 200 OK          | { id, theater, start_time, end_time, price, movie }                                                                                                                     |
| Delete a showtime              | DELETE /showtimes/{id}          |                                                                                                           | 200 OK          | { "message": "Showtime with ID {id} was deleted successfully." }                                                                                                        |
>>>>>>> 3192bbc42b47d0197e23142604ddbc72172e88ae

### Bookings APIs

| API Description       | Endpoint         | Request Body                                                    | Response Status | Response Body                                                        |
| --------------------- | ---------------- | ---------------------------------------------------------------- | --------------- | -------------------------------------------------------------------- |
| Get all bookings      | GET /bookings    |                                                                  | 200 OK          | [ { id, showtimeId, seatNumber, userId } ]                           |
| Get booking by ID     | GET /bookings/{id}|                                                                  | 200 OK          | { id, showtimeId, seatNumber, userId }                               |
| Create a booking      | POST /bookings   | { "showtimeId": 1, "seatNumber": 10, "userId": "user-uuid" }     | 201 CREATED     | { id, showtimeId, seatNumber, userId }                               |
| Update a booking      | PUT /bookings/{id}| { "seatNumber"?: number, "userId"?: string }                     | 200 OK          | { id, showtimeId, seatNumber, userId }                               |
| Delete a booking      | DELETE /bookings/{id}|                                                                | 200 OK          | { "message": "Booking with ID {id} was deleted successfully." }      |


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
