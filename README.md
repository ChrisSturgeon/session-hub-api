# Session Hub REST API

## Table of Contents

- [Overview](#overview)
- [Built With](#built-with)
- [Features](#features)
- [Concepts and Ideas Learnt](#concepts-and-ideas-learnt)
- [Areas to Improve](#areas-to-improve)
- [Contact](#contact)

## Overview

The backend of my final project from the Node JS section of the The Odin Project built with Express. The aim was to use REST principles with a MongoDB Database to create a social media site where users can create accounts, add friends, and post about their recent surfing, windsurfing, kitesurfing etc. sessions for other users to like and comment on.

View the live project [here](https://chrissturgeon.github.io/session-hub-front-end/#/) and view the project guidelines [here](https://www.theodinproject.com/lessons/nodejs-odin-book).

![Home page screenshot](/public/images/screenshot.jpg 'IMG DESCRIPTION')

### Built With

- [Express](https://expressjs.com/)
- [MongoDB Atlas Database](https://www.mongodb.com/)
- [BCryptJS](https://www.npmjs.com/package/bcryptjs)
- [Express Validator](https://express-validator.github.io/)
- [Passport](http://www.passportjs.org/)
- [JSONWebToken](https://www.npmjs.com/package/jsonwebtoken)
- [Mongoose](https://mongoosejs.com/)

## Features

- User Accounts and JSON Web Token Authentication.
- REST Principles for resource creation/modification/deletion.
- Salted and Hashed Passwords using BCrypt.
- Verification and santisation with Express Validator.
- Async database interaction using Mongoose.

### Concepts and Ideas Learnt

To date this is both the broadest API and most detailed project I have made with Express which required me to research and learn some new concepts. These include:

- How to implement MongoDB **Aggregation Operations with Pipelines**.
- Validation of **large and complex request bodies**.
- **Issuance and authentication** of JSON Web Tokens in a manner they can easily be consumed by the front-end application.
- How to model **friend-to-friend** relationships using a NoSQL database.

### Areas to Improve

With more time I would have liked to have implemented more features and improved others, such as:

- Send verification emails to new users before they are granted access to the platform.
- Allow users to update their username and passwords.
- Geographically group session coordinates so users can see all recent sessions nearby to a given location.
- Implement a 'people you may know' feature to suggest friends of friends.
- Create an 'equipment' model to allow users to store their surfboard/kite etc. so it can easily be referenced in future, and to record stats of how many users have this board etc.

## Contact

- sturgeon.chris@gmail.com
- [www.chrissturgeon.co.uk](https://chrissturgeon.co.uk/)
- [LinkedIn](https://www.linkedin.com/in/chris-sturgeon-36a74254/)
