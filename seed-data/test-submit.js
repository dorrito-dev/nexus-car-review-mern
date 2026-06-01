import fetch from 'node-fetch'; // or use native fetch if Node 18+

const LIVE_API_URL = 'https://nexus-car-review-mern-backend.onrender.com/api/reviews';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with a valid token

async function runLiveTest() {
  console.log(`Starting live API test to: ${LIVE_API_URL}...`);

  const payload = {
    make: "DUMMY",
    model: "Test Car",
    year: 2026,
    type: "Sedan",
    rating: 5,
    content: "This is a dummy test review to isolate backend logic on Render without hitting the frontend.",
    price: "50,000",
    keySpecs: "Dummy Engine, Dummy HP",
    images: ["https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000"]
  };

  try {
    const response = await fetch(LIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log(`\nResponse Status: ${response.status}`);
    
    if (response.ok) {
      console.log('SUCCESS! Review submitted successfully:');
      console.log(data);
    } else {
      console.error('FAILURE! Server rejected the submission:');
      console.error(data);
    }
  } catch (error) {
    console.error('\nCRITICAL NETWORK OR TIMEOUT ERROR:');
    console.error('The request never completed. The server may be hanging or completely unreachable.');
    console.error(error);
  }
}

runLiveTest();
