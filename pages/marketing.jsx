// pages/marketing.jsx
import Head from 'next/head';
import { useEffect } from 'react';

const Marketing = () => {
    useEffect(() => {
        console.log('DOM fully loaded and parsed');
        const generateButton = document.getElementById('generate-button');
        let recommendationCount = 0; // Counter for recommendations

        if (generateButton) {
            console.log('Generate button found');
            generateButton.addEventListener('click', async function () {
                console.log('Generate button clicked');
                if (recommendationCount >= 3) {
                    alert('You can only generate 3 recommendations.');
                    return;
                }

                const userInput = document.getElementById('user-input').value.trim();
                const outputDiv = document.getElementById('output');

                if (userInput === '') {
                    alert('Please enter product details.');
                    return;
                }

                document.getElementById('user-input').value = '';

                // Clear previous recommendations
                outputDiv.innerHTML = '';

                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'bg-white p-4 mb-2 rounded shadow';
                loadingDiv.textContent = 'Generating strategy...';
                outputDiv.appendChild(loadingDiv);

                try {
                    console.log('Sending request to backend...');
                    const response = await fetch('/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userInput }),
                    });

                    const data = await response.json();
                    console.log('Response received:', data);

                    outputDiv.removeChild(loadingDiv);

                    if (response.ok && data.choices && data.choices.length > 0) {
                        const recommendations = data.choices[0].message.content
                            .split('\n')
                            .filter((rec) => rec.trim() !== '')
                            .slice(0, 6);
                        const list = document.createElement('ul');
                        recommendations.forEach((rec) => {
                            const listItem = document.createElement('li');
                            listItem.className = 'bg-white p-4 rounded shadow mb-2';
                            listItem.textContent = rec;
                            list.appendChild(listItem);

                            // Add divider
                            const divider = document.createElement('hr');
                            divider.className = 'border-t-2 border-gray-200 my-2';
                            list.appendChild(divider);
                        });
                        outputDiv.appendChild(list);
                        recommendationCount++; // Increment the counter
                    } else {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'bg-red-200 p-4 rounded shadow';
                        errorDiv.textContent = data.error ? data.error.message : 'Error generating strategy. Please try again.';
                        outputDiv.appendChild(errorDiv);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    outputDiv.removeChild(loadingDiv);
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'bg-red-200 p-4 rounded shadow';
                    errorDiv.textContent = 'Error generating strategy. Please try again.';
                    outputDiv.appendChild(errorDiv);
                }
            });
        } else {
            console.log('Generate button not found');
        }
    }, []);

    return (
        <>
            <Head>
                <title>Silithius</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <link rel="stylesheet" href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" />
                <link href="https://unpkg.com/@tailwindcss/custom-forms/dist/custom-forms.min.css" rel="stylesheet" />
                <style>
                    {`
            @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");

            html, body {
              font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: white;
              color: black;
            }

            #__next {
              height: 100%;
            }
          `}
                </style>
            </Head>
            <body className="leading-normal tracking-normal h-full">
                <div className="h-full flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/6 bg-gray-200 text-black p-4">
                        <div className="mb-4">
                            <a
                                className="flex items-center text-indigo-600 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
                                href="/"
                            >
                                Sili
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
                                    thius
                                </span>
                            </a>
                            <h2 className="text-2xl font-bold">Menu</h2>
                            <ul className="mt-2">
                                <li className="py-2 hover:text-pink-700">
                                    <a href="https://silithius.com/">Home</a>
                                </li>
                                <li className="py-2 hover:text-pink-700">
                                    <a href="#">Stripe Coming Soon...</a>
                                </li>
                                <li className="py-2 hover:text-pink-700">
                                    <a href="https://x.com/vixclotet">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-grow flex-col lg:flex-row">
                        <div className="w-full lg:w-2/3 p-4">
                            <h1 className="text-3xl md:text-5xl text-black font-bold leading-tight mb-4">
                                Your Best{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                                    Marketing Strategies
                                </span>
                            </h1>
                            <p className="leading-normal text-base md:text-2xl mb-8">
                                Are you a tech entrepreneur who needs help promoting your products?
                            </p>
                            <p className="leading-normal text-black md:text-xl mb-8">
                                Remember: the more specific you are, the better the recommendations!
                            </p>
                            <form id="chat-form" className="bg-gray-200 w-full shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
                                <div className="mb-4">
                                    <label className="block text-blue-700 py-2 font-bold mb-2" htmlFor="user-input">
                                        Enter your product/company's one liner:
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 mb-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="user-input"
                                        type="text"
                                        placeholder="Describe the details of your product..."
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                        type="button"
                                        id="generate-button"
                                    >
                                        Generate Marketing Strategy
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="w-full lg:w-2/3 p-4 bg-white text-black rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Marketing Recommendations</h2>
                            <div id="output" className="bg-gray-200 p-4 rounded-lg shadow-inner overflow-y-auto" style={{ height: '750px' }}>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </>
    );
};

export default Marketing;