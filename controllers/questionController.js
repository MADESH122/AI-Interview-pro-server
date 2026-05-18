const pdfParse = require('pdf-parse');
const axios = require('axios');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const jobRole = req.body.jobRole || "Professional";
    const difficulty = req.body.difficulty || "Medium";   // ← New: Get difficulty from frontend
    let resumeText = "";

    // Extract text from PDF or Image
    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text || "Resume content extracted.";
    } else {
      resumeText = "This is a resume image with professional experience.";
    }

    // Strong Prompt with Difficulty Level
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Generate exactly 10 interview questions for a ${jobRole} role based on this resume.

Resume Content:
${resumeText}

Difficulty Level: ${difficulty} (Make questions ${difficulty.toLowerCase()} level)

Return ONLY a valid JSON array of 10 strings.`
        }
      ],
      temperature: 0.7,
      max_tokens: 900
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiText = response.data.choices[0].message.content.trim();
    let questions = [];

    try {
      questions = JSON.parse(aiText);
    } catch (e) {
      questions = [
        `Tell me about your experience as a ${jobRole}.`,
        `What are your key skills?`,
        `Describe a relevant project you worked on.`
      ];
    }

    res.json({
      success: true,
      jobRole,
      difficulty,          // ← Return selected difficulty
      questions
    });

  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate questions. Please try again." 
    });
  }
};

module.exports = exports;