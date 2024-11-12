//npm init
//npm install express
//npm install serve-static
//npm install body-parser
//npm install cookie-parser
//npm install express-session

//접근시 : http://localhost:3000

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// 사용자 정보를 저장할 데이터베이스
const db = new Map();
// KEY=VALUE 형태로 브라우저에 저장되는 쿠키의 KEY
const USER_COOKIE_KEY = 'USER';

//json에 회원가입 기록 저장하기
const fs = require('fs').promises;
const USERS_JSON_FILENAME = 'users.json';

async function fetchAllUsers() {
    const data = await fs.readFile(USERS_JSON_FILENAME);
    const users = JSON.parse(data.toString());
    return users;
}

async function fetchUser(username) {
    const users = await fetchAllUsers();
    const user = users.find((user) => user.username === username);
    return user;
}

async function createUser(newUser) {
    const users = await fetchAllUsers();
    users.push(newUser);
    await fs.writeFile(USERS_JSON_FILENAME, JSON.stringify(users));
}

async function removeUser(username, password) {
    const user = await fetchUser(username);
    if (user.password === password) {
        const users = await fetchAllUsers();
        const index = users.findIndex(u => u.username === username);
        users.splice(index, 1);
        await fs.writeFile(USERS_JSON_FILENAME, JSON.stringify(users));
    }
}

// 위에서 작성한 html을 클라이언트에 제공하기 위한 미들웨어
app.use(express.static(path.join(__dirname, 'public')));
// 쿠키를 파싱하기 위한 미들웨어
app.use(cookieParser());
// x-www-form-urlencoded 타입의 form 데이터를 파싱하기 위한 미들웨어
app.use(express.urlencoded({ extended: true }));

//
//res.cookie(USER_COOKIE_KEY, JSON.stringify(newUser));

//
app.get('/', (req, res) => {
    // 'user'라는 쿠키 데이터를 가져옴
    // 쿠키가 존재하지 않을 경우 로그인이 되지 않았다는 뜻
    const user = req.cookies[USER_COOKIE_KEY];
    
    if (user) {
        // 쿠키가 존재하는 경우, 쿠키 VALUE를 JS 객체로 변환
        const userData = JSON.parse(user);
        // user 객체에 저장된 username이 db에 존재하는 경우,
        // 유효한 user이며 로그인이 잘 되어 있다는 뜻.
        if (db.get(userData.username)) {
            /* // JS 객체로 변환된 user 데이터에서 username, name, password를 추출하여 클라이언트에 렌더링
            res.status(200).send(`
                <a href="/logout">Log Out</a>
                <h1>id: ${userData.username}, name: ${userData.name}, password: ${userData.password}</h1>
                <a href="/start.html">Start</a>
            `);*/
            res.redirect('/start.html');
            return;
        }
    }
    // 쿠키가 존재하지 않는 경우, 로그인 되지 않은 것으로 간주
    res.redirect('/login.html');
});

//
app.post('/signup', async (req, res) => {
    const { username, name, password } = req.body;
    const user = await fetchUser(username);

    // 이미 존재하는 username일 경우 회원 가입 실패
    if (user) {
        res.status(400).send(`같은 ID가 있습니다 : ${username}
                              <a href="/signup.html">Back</a>`);
        return;
    }

    // 아직 가입되지 않은 username인 경우 db에 저장
    // KEY = username, VALUE = { name, password }
    const newUser = {
        username,
        name,
        password,
    };
    db.set(username, newUser);
    //
    await createUser({
        username,
        name,
        password,
    });

    // db에 저장된 user 객체를 문자열 형태로 변환하여 쿠키에 저장
    res.cookie(USER_COOKIE_KEY, JSON.stringify(newUser));

    // 가입 완료 후, 루트 페이지로 이동
    res.redirect('/logout');
});

app.get('/logout', (req, res) => {
    // 쿠키 삭제 후 루트 페이지로 이동
    res.clearCookie(USER_COOKIE_KEY);
    res.redirect('/');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    //const user = db.get(username);
    const user = await fetchUser(username);

    // 가입 안 된 username인 경우
    if (!user) {
        res.status(400).send(`ID가 존재하지 않습니다. : ${username}
                              <a href="/login.html">Log In</a>
                              <a href="/signup.html">Sign Up</a>`);
        return;
    }
    // 비밀번호가 틀렸을 경우
    if (password !== user.password) {
        res.status(400).send(`비밀번호가 다릅니다. 
                              <a href="/login.html">Log In</a> 
                              <a href="/signup.html">Sign Up</a>`);
        return;
    }
    // db에 저장된 user 객체를 문자열 형태로 변환하여 쿠키에 저장
    res.cookie(USER_COOKIE_KEY, JSON.stringify(user));
    // 로그인(쿠키 발급) 후, 루트 페이지로 이동
    res.redirect('/start.html');
});

app.get('/withdraw', async (req, res) => {
    const userCookie = req.cookies[USER_COOKIE_KEY];
    const user = JSON.parse(userCookie);
    await removeUser(user.username, user.password);
    res.clearCookie(USER_COOKIE_KEY);
    res.redirect('/');
});

//서버시작
app.listen(3000, () => {
    console.log('server is running at 3000');
});