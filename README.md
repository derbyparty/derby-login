# Derby-Login

- Auth module for Derby 0.6
- Email/Password and [Passport](http://passportjs.org/) OAuth providers
- Uses projections (data stored in one collection)
- All routes start with '/auth/*'
- Bootstrap 7 components (change email, change password, login, logout, recover password, register, reset password)
- Custom components (forms) are supported by parse-request hooks
- Routes for confirmation of registration and email change
- Hooks (sending emails, parse-request, request, response, error)
- Bcrypt (default) and Sha-1 encryption
- Powerful server-side API
- No jQuery dependency
- Tests
- Influenced by [derby-auth](https://github.com/lefnire/derby-auth)

## Known Issues
- Does not work with Derby 0.3 and 0.5
- No built-in access control (use [share-access](https://github.com/dmapper/share-access))
- You have only userId in '_session.userId', and you should subscribe to user in router by yourself, [example](https://github.com/derbyparty/derby-login/issues/3)

## Migration from 0.2
- set `{encryption: 'sha-1', hashField: 'passwordHash'}` in options

### Installation
```javascript
npm install derby-login
```

### Setting
#### Step 1. Require
```javascript
var derbyLogin = require('derby-login');
```
#### Step 2. Options (take a look at [default options](https://github.com/derbyparty/derby-login/blob/master/lib/defaultOptions.js))
```javascript
var options = {};
```

#### Step 3. Middleware
```javascript
  .use(derbyLogin.middleware(store, options))
```

### Example
- [derby-login-example](https://github.com/derbyparty/derby-login-example) example app with auth

## The MIT License

Copyright (c) 2014 Vladimir Makhaev

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
