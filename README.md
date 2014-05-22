# Derby-Login

- Auth module for Derby.js
- Derby 0.6 version is the only supported
- Written in pure js
- Uses projections (data stored in one collection)
- All routes starts with '/auth/*'
- Bootstrap 3 components (Login, Register, ChangePassword)
- No jQuery dependency
- Influenced by [derby-auth](https://github.com/lefnire/derby-auth)

## Known Issues
- Does not work with Derby 0.3 and 0.5
- No 'Reset password'
- No built-in access control (maybe it`s better to create another module for this)
- No tests

### Installation
```
npm install derby-login
```

### Setting
#### Step 1. Require
```
var derbyLogin = require('derby-login');
```
#### Step 2. Connect Middleware
```
  .use(express.bodyParser()) //should be upper
  .use(derbyLogin.middleware(options))
```

### Step 3. Routes
```
derbyLogin.routes(expressApp, store);
```

### Example
- [derby-starter](https://github.com/vmakhaev/derby-starter/tree/auth) with auth
- [auth-example](https://github.com/vmakhaev/auth-example) simple app with auth

## The MIT License

Copyright (c) 2013 Vladimir Makhaev

Permission is hereby granted, free of charge, 
to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to 
deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom 
the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice 
shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
