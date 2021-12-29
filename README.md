# HDHS Live
[![wakatime](https://wakatime.com/badge/github/Yoyolick/hdhs.live.svg)](https://wakatime.com/badge/github/Yoyolick/hdhs.live)
![upordown](https://img.shields.io/website?down_color=red&down_message=down&up_message=up&url=https%3A%2F%2Fhdhs.live)
![python](https://img.shields.io/badge/python-3.7.3-brightgreen)

## What is this?

This is the repository containing the source code and documentation for my first full stack website; an anonymous social media website.

## What stack is used?

Pretty much the most barebones stack possible:
- HTML + CSS + JS
- jinja templates served via flask
- sqlite3 database with custom endpoints routed through the flask app
- gunicorn + nginx for deployment

## How is the server hosted?

I recieved a free domain + ssl certificates from name.com through the github student developer pack and built a pi 4 (4GB) server with a fan and usb flash storage to hold all of the files.
## What are the basics of the site?

The site has a few distinguishing features such as:
- unlimited "laughs" on post and comment content (similar to yikyak)
- post id and comment id system similar to early internet message boards and forums
- video and image content support
- fully fledged report and moderation system (password locked on the admin facing side)
- fully functional comment system
- the ability to sort posts by date (asc, desc) and popularity
- the ability to search for posts using id's or keywords found in usernames and post content.

## What does the site look like?
mobile | desktop
:-------------------------:|:-------------------------:
![mobile1](https://github.com/Yoyolick/hdhs.live/blob/141cefd7fe5f3a6aa632dd9e5fbb90b317bd1a1b/docs/mobile1.png) | ![desktop1](https://github.com/Yoyolick/hdhs.live/blob/141cefd7fe5f3a6aa632dd9e5fbb90b317bd1a1b/docs/desktop1.png)
![mobile2](https://github.com/Yoyolick/hdhs.live/blob/141cefd7fe5f3a6aa632dd9e5fbb90b317bd1a1b/docs/mobile2.png) | ![desktop2](https://github.com/Yoyolick/hdhs.live/blob/141cefd7fe5f3a6aa632dd9e5fbb90b317bd1a1b/docs/desktop2.png)

## Skills that I learned creating this:

- Flask
- Sqlite3
- jinja templating
- xhr requests and asychrenous javascript
- gunicorn and nginx
- creating api
- securing websites with ssl certificates

## Other Information

The documentation on the api (which is currently unfinished) can be found in the docs folder in the root of the repository.
