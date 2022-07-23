// Node.js, Express 패키지를 활용하여 간단한 Backend 서버 구성

const express = require("express"); // express 패키지를 import

const app = express();

const clientId = 'g2oKhzaTk6nD1pKBXeeW';
const clientSecret = 'kJEGI8jIOn';

// nodejs 서버가 또 다른 Client가 되어 Naver Papago Server에 요청(request)을 보내기 위해 사용 - request 패키지 설치 필요
const request = require('request');

// express의 static 미들웨어 활용
app.use(express.static('public')); // express한테 static 파일들의 경로가 어디에 있는지 명시

// express의 json 미들웨어 활용
app.use(express.json());

// console.log(`현재 파일명: ${__filename}`);
// console.log(`현재 파일이 위치한 경로: ${__dirname}`);

// 일반적으로 /를 root 경로라고 함
// root url: 127.0.0.1:3000/
// IP주소 : 127.0.0.1, Port : 3000
// 127.0.0.1의 Domain name : localhost -> http://localhost:3000
// root url경로로 요청이 들어왔을 때 호출될 콜백함수.
// 콜백함수는 2개의 인수(arguments)를 받음, 1. request(줄여서 req), response(res)
app.get('/', (req, res) => {
    // res.send('응답 완료!'); // 동작 확인
    // root url, 즉 메인 페이지로 접속했을 때 우리가 만든 Node 서버는 papago의 메인 화면인 index.html을 응답해야함
    res.sendFile(__dirname, 'index.html');
});

// localhost:3000/detectLangs 경로로 요청했을 때
app.post('/detectLangs', (req, res) => {
    // console.log(req.body); // { text: 'b', targetLanguage: 'en' }
    
    // text라는 프로퍼티로 받은 값은 query라는 이름의 변수로 할당, targetLanguage는 동일한 변수명으로 할당 
    // ??? 객체 디스트럭쳐링 써서 한 줄로 작성
    const { text:query, targetLanguage } = req.body;

    console.log(query); // 입력한 텍스트 ex) b, 안녕하세요~
    console.log(targetLanguage); // en, ko~
    
    // 실제 papago 서버에 요청 전송(번역할 텍스트, 번역할 언어 값)
    // papago 서버에 요청하기 위해서는 요청할 주소(URL)을 알아야함 

    const url = 'https://openapi.naver.com/v1/papago/detectLangs'; // 택배보낼 주소

    const options = { // options 택배 보낼 물건
        url: url,
        form: {
            query: query

        }, // form 프로퍼티는 {} (object) 즉 객체를 값으로 가지고있음
        headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
        }, // headers라는 이름의 프로퍼티는 객체를 값으로 가지고 있음, x-naver는 걍 네이버가 지들 전용 프로퍼티 만든거임

    };

    // 실제 언어감지 서비스 요청 부분
    // options 라는 변수에 요청 전송시 필요한 데이터 및 주소를 동봉한다. (enclose)
    // () => {} : 요청에 따른 응답 정보를 확인 가능
    request.post(options, (error, response, body) => { //request객체가 가지고 있는 post() 메서드 활용
        if (!error && response.statusCode === 200 ) {// 응답이 성공적으로 완료 되었을 경우
            const parsedData = JSON.parse(body); // json.parse() : String -> JS object로 변환(파싱,parsing) 
            console.log(typeof parsedData, parsedData);
            // papago 번역 url('/translate')로 redirect(재요청 or 요청 재지정, 내부적으로 재요청).
            res.redirect(`translate?lang=${parsedData['langCode']}&targetLanguage=${targetLanguage}&query=${query}`);

        } else { //응답이 실패했을 경우
            console.log(`error = ${response.statusCode}`);
        }

    
    }); 


});

// papago 번역 요청 부분
app.get('/translate', (req, res)=>{
    const url = 'https://openapi.naver.com/v1/papago/n2mt';

    const options = {
        url, //변수랑 프로퍼티랑 똑같으면 한줄만 써도됨 url:url과 같다.
        form:{ // 서버로 보낼 파라미터(source target text)를 넣는 부분
            source: req.query['lang'], // 작성한 언어 코드
            target: req.query['targetLanguage'], // 번역하고자 하는 언어의 코드
            text: req.query['query'], // 번역하고자하는 텍스트
        },
        headers:{
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
        },
    };

    // 실제 번역 요청 전송부분
    request.post(options, (error, response, body)=>{
        if(!error && response.statusCode === 200) {
            //const parsedData = JSON.parse(body);
            res.json(body); // front에 해당하는 app.js에 응답 데이터를 json 형태로 파싱하여 전송시켜줌
            //->json() : stringify()가 적용된 메서드 ,,, json이 문자열화알아서 시켜줌
            
        } else {
            console.log(`error =${response.statusCode}`);
        }
    });

});


// 서버가 실행되었을 때 몇 번 포트에서 실행시킬 것인지
app.listen(3000, () => console.log('http://127.0.0.1:3000/ app listening on port 3000'));

