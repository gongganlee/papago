const express = require("express"); 
const app = express();
const clientId = 'g2oKhzaTk6nD1pKBXeeW';
const clientSecret = 'kJEGI8jIOn';
const request = require('request');

app.use(express.static('public')); 
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname, 'index.html');
});

app.post('/detectLangs', (req, res) => {
    const { text:query, targetLanguage } = req.body;
    console.log(query); 
    console.log(targetLanguage);     
    const url = 'https://openapi.naver.com/v1/papago/detectLangs'; 
    const options = { 
        url: url,
        form: {
            query: query

        }, 
        headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
        },

    };

    request.post(options, (error, response, body) => { 
        if (!error && response.statusCode === 200 ) {
            const parsedData = JSON.parse(body);  
            console.log(typeof parsedData, parsedData);
            res.redirect(`translate?lang=${parsedData['langCode']}&targetLanguage=${targetLanguage}&query=${query}`);
        } else { 
            console.log(`error = ${response.statusCode}`);
        }
    }); 
});

app.get('/translate', (req, res)=>{
    const url = 'https://openapi.naver.com/v1/papago/n2mt';
    const options = {
        url, 
        form:{ 
            source: req.query['lang'], 
            target: req.query['targetLanguage'], 
            text: req.query['query'], 
        },
        headers:{
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
        },
    };
    
    request.post(options, (error, response, body)=>{
        if(!error && response.statusCode === 200) {
            
            res.json(body); 
            
        } else {
            console.log(`error =${response.statusCode}`);
        }
    });

});

app.listen(3000, () => console.log('http://127.0.0.1:3000/ app listening on port 3000'));

