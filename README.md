# Project Name

Pay Off

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [Acknowledgments](#acknowledgments)

## Introduction

Offline payment for TikTok Wallet

## Features

1. Payment by SMS

## Technologies

Firebase, React, Twillio, TikTok Auth

## Setup

1. Create `.env` from `.env-template`
1. Create a Firebase project (with Firestore, Functions, Hosting)

```bash
git clone git@github.com:yyj-02/pay-off.git
cd pay-off
npm install
npm run build
firebase init hosting # select dist as the folder
firebase init functions
firebase init firestore
```

_Frontend_

```
npm run deploy-react
```

_Cloud Functions_

```
cd functions
npm run deploy
```

## Usage

Explain how to use your project. Include code blocks and screenshots as necessary.

## Acknowledgments

Give credit to any resources or people that helped your project. ```
