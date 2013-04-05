# olinjs-revv
--------

Project for the OlinJS Revv 

background process running - how to set it up? does heroku support it?

## Web UI

* some sort of login using database
* load customized filters from db - `GET`
* save preferences to db - `POST`
* load previous messages that have been sent via text

## IMAP 

* get customized filter in `JSON` from db so and filter the messages
* get `from` field from the header of the message and send to twilio
* get text of the message body and send to twilio
* get response to text and send as email

## Twilio

* send text to specified user number with the message body/header
* save the message object to db
* get response to text and send over to IMAP