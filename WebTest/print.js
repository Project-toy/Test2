async function summarizeText(text) {
  const apiKey = 'YOUR_OPENAI_API_KEY';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Please summarize the following text: ${text}` }
      ],
      max_tokens: 100 // 요약 결과의 최대 길이
    })
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 사용 예제
const textToSummarize = "요약할 긴 텍스트를 여기에 입력합니다.";
summarizeText(textToSummarize)
  .then(summary => console.log("Summary:", summary))
  .catch(error => console.error(error));
