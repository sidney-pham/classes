Classes
=======

Config
------
Configuration is done through the following environment variables:
```js
// Session
DATABASE_URL // Optional with OpenShift.
COOKIE_SECRET

// OAuth2
CLIENT_ID
CLIENT_SECRET
REDIRECT_URI

// Server
PORT // Optional with OpenShift.
IP // Optional with OpenShift.
```

Just run this:
-------------
`COOKIE_SECRET=ANYTHING CLIENT_ID={id} CLIENT_SECRET={secret} REDIRECT_URI={http://your url (origin only):port} PORT={port} npm start`