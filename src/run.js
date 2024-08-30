async function run() {
    const prompt = "Write a story about an AI and magic"

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

export { run }