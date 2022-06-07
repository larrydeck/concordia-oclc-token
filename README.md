# Concordia OCLC token

Currently only works with recent versions of Node that have native fetch.

(Convincing Typescript to import node-fetch or something similar is a TODO.)

So

```sh
npm install --save concordia-oclc-token
```

then


```javascript
const oclc_token = require('concordia-oclc-token');

credentials = {
	'WSKEY': 'aQCmtyCOIPJSqMr7Ju0...WP3GR01c', 
	'secret': 'M5D2VpYq...DnH/M2',
	'scopes': ['WorldCatDiscoveryAPI','new-titles']
}

async function doSomething(creds) {
	let my_token = await oclc_token.getToken(creds);
	console.log('My token is ' + my_token);
}

doSomething(credentials);
```

but don't put your actual WSKEY or secret in clear... Use `dotenv` or similar and hide them in a `.gitignored` dotfile.