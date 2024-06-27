document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    const generateButton = document.getElementById('generate-button');
    if (generateButton) {
        console.log('Generate button found');
        generateButton.addEventListener('click', async function () {
            console.log('Generate button clicked');
            const userInput = document.getElementById('user-input').value.trim();
            const outputDiv = document.getElementById('output');

            if (userInput === '') {
                alert('Please enter product details.');
                return;
            }

            document.getElementById('user-input').value = '';

            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'bg-white p-4 mb-2 rounded shadow';
            loadingDiv.textContent = 'Generating strategy...';
            outputDiv.appendChild(loadingDiv);

            try {
                console.log('Sending request to API...');
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
                    },
                    body: JSON.stringify({
                        model: "gpt-4",
                        messages: [
                            { role: "user", content: userInput },
                            {
                                role: "assistant",
                                content: 'You are an experienced financial advisor that likes to help users with any financial doubt.'
                            }
                        ]
                    }),
                });

                const data = await response.json();
                console.log('Response received:', data);

                outputDiv.removeChild(loadingDiv);

                if (response.ok) {
                    const strategyDiv = document.createElement('div');
                    strategyDiv.className = 'bg-white p-4 mb-2 rounded shadow';
                    strategyDiv.textContent = data.choices[0].message.content;
                    outputDiv.appendChild(strategyDiv);
                } else {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'bg-red-200 p-4 mb-2 rounded shadow';
                    errorDiv.textContent = data.error.message || 'Error generating strategy. Please try again.';
                    outputDiv.appendChild(errorDiv);
                }
            } catch (error) {
                console.error('Error:', error);
                outputDiv.removeChild(loadingDiv);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'bg-red-200 p-4 mb-2 rounded shadow';
                errorDiv.textContent = 'Error generating strategy. Please try again.';
                outputDiv.appendChild(errorDiv);
            }
        });
    } else {
        console.log('Generate button not found');
    }
});
