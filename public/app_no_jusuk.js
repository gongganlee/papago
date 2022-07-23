const textAreaArray = document.getElementsByClassName('Card__body__content');
const [sourceTextArea, targetTextArea] = textAreaArray;
const [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');

let targetLanguage = 'en';
console.dir(targetSelect);
targetSelect.addEventListener('change', () => {
    const selectedIndex = targetSelect.selectedIndex;
    targetLanguage = targetSelect.options[selectedIndex].value; 
});

let debouncer;

sourceTextArea.addEventListener('input', (event) => {
    if(debouncer) { 
        clearTimeout(debouncer); 
    }
    
    debouncer = setTimeout(()=>{
        const text = event.target.value;
        
        if(text) {
            const xhr = new XMLHttpRequest();
            const url = '/detectLangs'; 
            
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const responseData = xhr.responseText
                    const parsedData = JSON.parse(JSON.parse(responseData))
                    console.log(parsedData);
                    const result = parsedData.message.result;
                    const options = sourceSelect.options;
                        for (let i = 0; i < options.length; i++) {
                            if(options[i].value === result['srcLangType']) {
                                sourceSelect.selectedIndex = i;
                            }
                        }
                targetTextArea.value = result.translatedText
                }
            };
            xhr.open('POST', url);
        
            const requestData = {
            text, 
            targetLanguage, 
            };
        
            xhr.setRequestHeader('Content-type', 'application/json'); 
            const jsonData = JSON.stringify(requestData);
            xhr.send(jsonData);
        }else{
            console.log('번역할 텍스트를 입력하세요');
        }
    }, 3000);
});
