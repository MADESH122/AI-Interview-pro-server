const extractTextFromFile = async (buffer, mimetype) => {
  // For now, return placeholder text since real OCR is complex
  // In future, you can integrate Tesseract.js or Google Vision
  return `Resume content from uploaded image (${mimetype}). 
Candidate is applying for Full Stack Developer role. 
Skills may include React, Node.js, MongoDB, etc.`;
};

module.exports = extractTextFromFile;