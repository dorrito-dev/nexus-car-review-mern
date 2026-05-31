import fs from 'fs/promises';
import path from 'path';

// Using native fetch and FormData (Node 18+)
// No need to install axios or form-data

const BASE_URL = 'http://localhost:5000/api';
const CLOUDINARY_CLOUD_NAME = 'dyffwht6y'; // Extracted from backend/.env

// The generated expanded car reviews based on the images found in seed-data/
const EXPANDED_REVIEWS = [
  {
    imageFile: 'GORDON_MURRAY_T.50.webp',
    make: 'Gordon Murray',
    model: 'T.50',
    year: 2022,
    type: 'Hypercar',
    rating: 5,
    price: '$3,000,000',
    referenceLink: 'https://gordonmurrayautomotive.com/',
    keySpecs: '654 hp, 3.9L V12, 2,174 lbs, 6-speed manual',
    content: "The Gordon Murray T.50 is the truest spiritual successor to the legendary McLaren F1, prioritizing driving purity above all else. Its naturally aspirated Cosworth V12 revs to an astronomical 12,100 RPM, producing a howl that is simply unmatched in the modern era. The central driving position makes you feel perfectly connected to the chassis.\n\nThe aerodynamic fan at the rear isn't just a gimmick; it provides active downforce that completely transforms the car's high-speed stability without the drag of massive wings. The tactile feel of the H-pattern manual gearbox in a hypercar of this caliber is a revelation.\n\nEvery single component on this car was scrutinized for weight reduction, from the pedal box to the titanium toolkit. Driving the T.50 isn't just transportation; it's a deeply emotional event that demands respect and rewards you with the most visceral driving experience available today."
  },
  {
    imageFile: 'KOENIGSEGG_GEMERA.webp',
    make: 'Koenigsegg',
    model: 'Gemera',
    year: 2023,
    type: 'Hyper-GT',
    rating: 5,
    price: '$1,700,000',
    referenceLink: 'https://www.koenigsegg.com/',
    keySpecs: '1,700 hp, 2.0L 3-cylinder twin-turbo + electric motors, AWD',
    content: "Koenigsegg has defied logic with the Gemera, creating a hyper-GT that seats four adults comfortably while delivering earth-shattering performance. The 'Tiny Friendly Giant' (TFG) 2.0-liter three-cylinder engine is a marvel of engineering, producing an unbelievable amount of power before the electric motors even kick in.\n\nThe interior is a beautiful blend of Swedish luxury and cutting-edge technology, with screens for everyone and heated/cooled cup holders. Putting your foot down results in a warp-speed experience that is surreal to share with three passengers. The Gemera redefines what a grand tourer can be.\n\nDespite having four seats, there is absolutely no compromise on performance. The bespoke Michelin tires struggle to contain the massive torque, yet the all-wheel steering and vectoring systems keep everything astonishingly composed. It's an engineering triumph that bridges the gap between family hauling and track domination."
  },
  {
    imageFile: 'LEXUS_LFA.webp',
    make: 'Lexus',
    model: 'LFA',
    year: 2012,
    type: 'Supercar',
    rating: 5,
    price: '$375,000',
    referenceLink: 'https://www.lexus.com/',
    keySpecs: '552 hp, 4.8L V10, 0-60 in 3.6s, RWD',
    content: "The Lexus LFA will go down in history as one of the best-sounding production cars ever made, thanks to Yamaha's acoustic engineering on the phenomenal 4.8-liter V10. It revs so quickly that a digital tachometer was strictly necessary to keep up. The engine note alone is worth the price of admission.\n\nBeyond the sound, the LFA is incredibly well-balanced and communicative. The carbon-fiber reinforced polymer chassis provides incredible rigidity, allowing the suspension to work beautifully over imperfect roads. It's a passion project from Toyota that we will likely never see the likes of again.\n\nEvery shift of the single-clutch automated manual gearbox sends a satisfying mechanical jolt through the cabin, reminding you of the mechanical symphony taking place just ahead of you. The LFA is a masterpiece that prioritizes sensation and emotion over mere spec-sheet supremacy."
  },
  {
    imageFile: 'PAGANI_HUAYRA.avif',
    make: 'Pagani',
    model: 'Huayra',
    year: 2014,
    type: 'Hypercar',
    rating: 5,
    price: '$1,400,000',
    referenceLink: 'https://www.pagani.com/',
    keySpecs: '720 hp, 6.0L AMG Twin-Turbo V12, Active Aero',
    content: "Horacio Pagani is as much an artist as he is an engineer, and the Huayra is his rolling sculpture. Every single piece of titanium and carbon fiber is beautifully crafted; it is a car you can spend hours just looking at. The active aerodynamic flaps on the front and rear move like the ailerons of an aircraft during heavy braking and cornering.\n\nThe AMG-sourced twin-turbo V12 provides a tidal wave of torque, accompanied by the distinct whoosh of the turbochargers spooling right behind your head. Driving a Huayra feels like piloting a bespoke mechanical watch.\n\nThe exposed linkage of the gear shifter is a work of art in itself, providing a tactile, metallic click with every pull. The Huayra doesn't just offer straight-line speed; it offers an occasion. It's a testament to what is possible when automotive engineering is elevated to the highest form of fine art."
  },
  {
    imageFile: 'PORSCHE_918_SPYDER.jpg',
    make: 'Porsche',
    model: '918 Spyder',
    year: 2015,
    type: 'Hypercar',
    rating: 5,
    price: '$845,000',
    referenceLink: 'https://www.porsche.com/',
    keySpecs: '887 hp, 4.6L V8 + 2 electric motors, AWD',
    content: "The Porsche 918 Spyder perfectly demonstrated how hybrid technology could be used not just for efficiency, but for ruthless performance. The instant torque from the electric motors fills the gaps before the glorious naturally aspirated 4.6-liter V8 comes alive. The integration between electric and combustion power is seamless.\n\nWith all-wheel steering and an incredibly advanced torque-vectoring system, the 918 is surgically precise on a track yet surprisingly comfortable on the road. The top-exit exhaust pipes produce a guttural V8 roar that contrasts beautifully with the spaceship-like whine of the electric motors.\n\nWhat truly sets the 918 apart from its hypercar peers is its usability. You can genuinely drive it in electric-only mode through a city center in near silence, then unleash almost 900 horsepower on a canyon road minutes later. It set a benchmark for hybrid hypercars that is still revered to this day."
  }
];

// Generated users since the markdown file was empty
const GENERATED_USERS = [
  { name: 'Alice Cooper', email: 'alice@example.com', password: 'Password123!', role: 'user' },
  { name: 'Bob Smith', email: 'bob@example.com', password: 'Password123!', role: 'user' },
  { name: 'Charlie Davis', email: 'charlie@example.com', password: 'Password123!', role: 'user' },
  { name: 'Diana Prince', email: 'diana@example.com', password: 'Password123!', role: 'user' },
  { name: 'Evan Wright', email: 'evan@example.com', password: 'Password123!', role: 'user' },
];

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSeed() {
  console.log('🚀 Starting Automated Seeding Process...\n');
  const tokens = {};
  const usersCreated = [];

  // ---------------------------------------------------------
  // Phase 1: User Registration
  // ---------------------------------------------------------
  console.log('=== Phase 1: User Registration ===');
  for (const user of GENERATED_USERS) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      if (!res.ok && data.message !== 'User already exists') {
        console.error(`❌ Failed to register ${user.name}:`, data);
        process.exit(1);
      }
      console.log(`✅ Registered (or existing) user: ${user.name}`);
      
      // Save for logging
      usersCreated.push({ name: user.name, email: user.email, password: user.password });
    } catch (err) {
      console.error(`❌ Error registering ${user.name}:`, err.message);
      process.exit(1);
    }
  }

  await fs.writeFile(
    path.join(process.cwd(), 'seed-data', 'generated-users.json'),
    JSON.stringify(usersCreated, null, 2)
  );
  console.log('💾 Saved generated-users.json\n');

  // ---------------------------------------------------------
  // Phase 2: Authentication & Token Management
  // ---------------------------------------------------------
  console.log('=== Phase 2: Authentication ===');
  for (const user of usersCreated) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(`❌ Failed to login ${user.email}:`, data);
        process.exit(1);
      }
      tokens[user.email] = { token: data.token, id: data._id, status: data.status };
      console.log(`✅ Logged in and saved JWT for: ${user.email}`);
    } catch (err) {
      console.error(`❌ Error logging in ${user.email}:`, err.message);
      process.exit(1);
    }
  }

  await fs.writeFile(
    path.join(process.cwd(), 'seed-data', 'auth-tokens.json'),
    JSON.stringify(tokens, null, 2)
  );
  console.log('💾 Saved auth-tokens.json\n');

  // ---------------------------------------------------------
  // Phase 2.5: Approve Users (Admin action needed to post reviews)
  // ---------------------------------------------------------
  console.log('=== Phase 2.5: Approving Users (via Admin) ===');
  try {
    // Attempt Admin login
    const adminRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nexus.com', password: 'hailadmin' })
    });
    
    if (adminRes.ok) {
      const adminData = await adminRes.json();
      console.log('✅ Logged in as Admin. Approving seeded users...');
      
      for (const user of usersCreated) {
        const userId = tokens[user.email].id;
        const patchRes = await fetch(`${BASE_URL}/users/${userId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminData.token}`
          },
          body: JSON.stringify({ status: 'approved' })
        });
        
        if (patchRes.ok) {
          console.log(`✅ Approved user: ${user.email}`);
          tokens[user.email].status = 'approved';
        } else {
          console.log(`⚠️ Failed to approve user: ${user.email}`);
        }
      }
    } else {
      console.log('⚠️ Could not log in as admin (admin may not exist). User reviews might fail if not approved.');
    }
  } catch (err) {
    console.log('⚠️ Admin approval step skipped due to error:', err.message);
  }
  console.log('');

  // ---------------------------------------------------------
  // Phase 3 & 4 & 5: Review Expansion, Cloudinary Upload & Submission
  // ---------------------------------------------------------
  console.log('=== Phase 3, 4 & 5: Cloudinary Upload & Review Submission ===');
  
  for (let i = 0; i < EXPANDED_REVIEWS.length; i++) {
    const reviewData = EXPANDED_REVIEWS[i];
    const user = usersCreated[i]; // Use one user per review
    const userToken = tokens[user.email].token;

    console.log(`\n⏳ Processing Review for ${reviewData.make} ${reviewData.model} by ${user.name}`);

    // Step A: Get Signature
    let signatureData;
    try {
      const sigRes = await fetch(`${BASE_URL}/upload/signature`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      signatureData = await sigRes.json();
      if (!sigRes.ok) {
        console.error('❌ Failed to get Cloudinary signature:', signatureData);
        process.exit(1);
      }
      console.log('✅ Got Cloudinary signature');
    } catch (err) {
      console.error('❌ Error getting signature:', err.message);
      process.exit(1);
    }

    // Step B: Upload to Cloudinary
    let secureUrl;
    try {
      const imagePath = path.join(process.cwd(), 'seed-data', reviewData.imageFile);
      const fileBuffer = await fs.readFile(imagePath);
      const fileBlob = new Blob([fileBuffer]);

      const formData = new FormData();
      formData.append('file', fileBlob, reviewData.imageFile);
      formData.append('api_key', signatureData.api_key);
      formData.append('timestamp', signatureData.timestamp);
      formData.append('signature', signatureData.signature);
      
      // The backend hardcodes 'nexus_car_reviews' in the signature generation but doesn't 
      // return it in the payload. We must append it for Cloudinary to accept the signature.
      formData.append('folder', 'nexus_car_reviews');

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) {
        console.error('❌ Cloudinary upload failed:', uploadData);
        process.exit(1);
      }
      secureUrl = uploadData.secure_url;
      console.log(`✅ Uploaded image successfully: ${secureUrl}`);
    } catch (err) {
      console.error('❌ Error uploading image:', err.message);
      process.exit(1);
    }

    // Step C: Submit Review
    try {
      // The datamodels were updated: Car schema was merged into Review schema.
      // The API's reviewController explicitly expects make, model, year, type, rating, content, price, referenceLink, keySpecs, images.
      const payload = {
        content: reviewData.content,
        make: reviewData.make,
        model: reviewData.model,
        year: reviewData.year,
        type: reviewData.type,
        rating: reviewData.rating,
        price: reviewData.price,
        referenceLink: reviewData.referenceLink,
        keySpecs: reviewData.keySpecs,
        images: [secureUrl]
      };

      const reviewRes = await fetch(`${BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(payload)
      });
      const submittedReview = await reviewRes.json();
      
      if (!reviewRes.ok) {
        console.error('❌ Failed to submit review:', submittedReview);
        process.exit(1);
      }
      console.log(`✅ Submitted review successfully. Status is: ${submittedReview.status}`);
      
    } catch (err) {
      console.error('❌ Error submitting review:', err.message);
      process.exit(1);
    }

    // Small delay to avoid rate limiting
    await delay(500);
  }

  console.log('\n🎉 Seeding completed successfully!');
}

runSeed();
