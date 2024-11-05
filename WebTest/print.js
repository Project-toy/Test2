async function getSummaryText(text) {
  const docObject = {  //요약할 문서
    content: "text"
  };

  const OptionObject = {
    language: "ko",
    model: "general" ,
    tone: 2,
    summaryCount: 3,
  };


  // Option과 docObject를 합쳐서 요청으로 보낼 데이터 생성
  const requestData = {
    document: docObject,
    option: OptionObject,
  };
  const requestOptions = { //요청 헤더
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "X-NCP-APIGW-API-KEY-ID": "462uzstacg", // API 키 ID
        "X-NCP-APIGW-API-KEY": "ejrkxgIBimFdCJl2FKln7hLrVRTUGufolqqLE50H" // API 키 Secret
      },
      body: JSON.stringify(requestData)
    }; 

  try {
    const response = await fetch(`https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize`, requestOptions);
    const data = await response.json();
    console.log(data);
    return data; // 변환된 텍스트 결과 반환
  } catch (err) {
    console.log(err);
    return null;
  }
}