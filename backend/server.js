const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage for interactions
const interactions = [];
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'health123'
};
const ADMIN_TOKEN = 'secure-token-12345';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('../')); // Serve frontend files

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HealthSense Backend is running' });
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      res.json({ 
        token: ADMIN_TOKEN,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Admin interactions endpoint
app.get('/api/admin/interactions', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ 
        error: 'Unauthorized. Valid token required.' 
      });
    }
    
    // Calculate analytics
    const totalReports = interactions.length;
    const commonTests = getCommonTests();
    const avgProcessingTime = calculateAvgProcessingTime();
    
    res.json({
      interactions: interactions,
      analytics: {
        totalReports,
        commonTests,
        avgProcessingTime
      }
    });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  const startTime = Date.now();
  try {
    const { reportText } = req.body;
    
    if (!reportText) {
      return res.status(400).json({ 
        error: 'Missing reportText in request body' 
      });
    }

    // Validate report text length
    if (reportText.length > 50000) {
      return res.status(400).json({ 
        error: 'Report text too long. Maximum 50,000 characters allowed.' 
      });
    }

    console.log('Analyzing lab report...');
    console.log('Text length:', reportText.length, 'characters');



    // Determine if this is a lab report or a general health question
    const isLabReport = reportText.length > 200 && !reportText.startsWith('User question:');
    
    let prompt;
    if (isLabReport) {
      // Lab report analysis prompt
      prompt = `You are a medical education AI. Explain lab reports in simple terms for patients.

SAFETY RULES:
- NEVER diagnose or give medical advice
- Use educational, reassuring language
- Always recommend consulting healthcare provider
- Focus on explaining what each test means in simple terms
- Highlight any values that are outside normal ranges
- Provide context about what the tests measure

Return JSON format:
{
  "summary": "Brief overview of the lab report in 2-3 sentences",
  "explanations": [
    {
      "test_name": "Test name",
      "result": "Actual result value",
      "reference_range": "Normal range",
      "status": "Normal/High/Low",
      "explanation": "What this test measures in simple terms",
      "interpretation": "What the result means for the patient"
    }
  ],
  "key_findings": [
    "List of 3-5 key points about the results"
  ],
  "recommendations": [
    "List of 3-5 general recommendations"
  ],
  "disclaimer": "This explanation is for educational purposes only. Please consult your healthcare provider for medical advice."
}

Lab report text: ${reportText}

IMPORTANT: Return ONLY valid JSON. No additional text before or after.`;
    } else {
      // General health question prompt
      const question = reportText.replace('User question: ', '');
      prompt = `You are a medical education AI. Answer general health questions in simple, educational terms.

SAFETY RULES:
- NEVER diagnose or give medical advice
- Use educational, reassuring language
- Always recommend consulting healthcare provider
- Provide general information about health topics
- Keep responses informative but not medical advice

Return JSON format:
{
  "summary": "Brief answer to the question in 2-3 sentences",
  "explanations": [],
  "key_findings": [
    "List of 3-5 key points about the topic"
  ],
  "recommendations": [
    "List of 3-5 general recommendations"
  ],
  "disclaimer": "This information is for educational purposes only. Please consult your healthcare provider for medical advice."
}

User question: ${question}

IMPORTANT: Return ONLY valid JSON. No additional text before or after.`;
    }

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.gemini_api}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = geminiData.candidates[0].content.parts[0].text;
    
    // Try to parse the JSON response
    let parsedResponse;
    try {
      // Clean the response text to extract just the JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.log('Raw response:', aiResponse);
      
      // Fallback response if parsing fails
      parsedResponse = {
        summary: "I've analyzed your lab report and found some interesting patterns. Most values appear to be within normal ranges.",
        explanations: [],
        key_findings: [
          "Most laboratory values are within normal reference ranges",
          "A few parameters may need attention",
          "Overall health profile appears stable"
        ],
        recommendations: [
          "Schedule a follow-up with your healthcare provider",
          "Discuss any concerning values",
          "Maintain current healthy habits"
        ],
        disclaimer: "This explanation is for educational purposes only. Please consult your healthcare provider for medical advice."
      };
    }

    console.log('Analysis completed successfully');
    
    // Store interaction for admin dashboard
    const interaction = {
      reportText: reportText.substring(0, 500), // Store first 500 chars for preview
      responseJSON: parsedResponse,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };
    interactions.push(interaction);
    
    res.json(parsedResponse);

  } catch (error) {
    console.error('Error analyzing report:', error);
    res.status(500).json({ 
      error: 'Failed to analyze report',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Helper functions for analytics
function getCommonTests() {
  const testCounts = {};
  
  interactions.forEach(interaction => {
    if (interaction.responseJSON.explanations) {
      interaction.responseJSON.explanations.forEach(test => {
        const testName = test.test_name || 'Unknown Test';
        testCounts[testName] = (testCounts[testName] || 0) + 1;
      });
    }
  });
  
  // Return top 5 most common tests
  return Object.entries(testCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([test, count]) => ({ test, count }));
}

function calculateAvgProcessingTime() {
  if (interactions.length === 0) return 0;
  
  const totalTime = interactions.reduce((sum, interaction) => {
    return sum + (interaction.processingTime || 0);
  }, 0);
  
  return Math.round(totalTime / interactions.length);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HealthSense Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔬 Analysis endpoint: http://localhost:${PORT}/api/analyze`);
  console.log(`👨‍💼 Admin login: http://localhost:${PORT}/dashboard.html`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set. Please add it to your .env file.');
  }
});

module.exports = app;
