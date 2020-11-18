# Encrypted Self Hosted Notebook WebApp - QuillJS Editor, MongoDB, YubiKey

## About

I wanted a simple, secure, self-hosted notepad webapp that allowed rich text editing and multiple notebooks.

* Single User Only
* QuillJS is the editor
* MongoDB is the database
* Note Content Encrypted in DB
* YubiKey OTP Login
* Dockerized

## Usage

* Login `/`
* Click New For Random Name or Navigate to `/notebook-name`
* Delete Notebook `/delete/notebook-name`
* Logout `/logout`

## Installation

### Yubikey OTP (Optional)

Register Yubikey at https://upgrade.yubico.com/getapikey/

Copy Client Id and Secret Key

## sample.env

Copy `cp sample.env .env`

Edit Variables in `.env` or set environment variables accordingly.

```
PORT=3000
DBURL=e.g. mongodb://notepad-mongo/notepad
SESSION_SECRET=somesecret
PASSWORD=somepassword
ENCRYPTION_KEY=somesecretkey-backthisup
#YUBIKEY OPTIONAL
YUBI_CLI=clientid from https://upgrade.yubico.com/getapikey/
YUBI_KEY=secret from https://upgrade.yubico.com/getapikey/
YUBI_SERIAL=yubikey serial no
```

## Running

### Local

`node server`

### Docker

*Private Network Mongo Instance*

```
mkdir -p ./docker/notepad--
cd ./docker/notepad--

docker network create notepad

docker run --name notepad-mongo --restart=unless-stopped -v $PWD/db:/data/db --net notepad -d mongo

docker build -t notepad-app .
docker run --name notepad-app --restart=unless-stopped -p 3000:3000 --net notepad -d notepad-app

```

**I suggest if you plan on using over a network do not expose the container port, instead place a nginx server with ssl infront of app container and expose that.**

*App Only*

```
docker build -t notepad-app .
docker run --name notepad-app --restart=unless-stopped -p 3000:3000 -d notepad-app
```
