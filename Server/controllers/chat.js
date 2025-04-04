const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const runCHAT = require('../config/geminiAPIConfig');

exports.getChatResponse = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorResponse('Please provide a message', 400));
  }

  // Log the received message (truncated for privacy)
  console.log(`Chat request received: "${message.substring(0, 30)}..."`);

  try {
    // Call the Gemini API with timeout handling
    const aiResponsePromise = runCHAT(message);
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('AI request timed out')), 10000);
    });
    
    // Race the promises to handle timeout
    const aiResponse = await Promise.race([aiResponsePromise, timeoutPromise]);
    
    // Log success (truncated response)
    console.log(`AI response sent: "${aiResponse.substring(0, 30)}..."`);
    
    // Send successful response
    res.status(200).json({
      success: true,
      data: {
        message: aiResponse
      }
    });
  } catch (error) {
    // Log detailed error
    console.error('Gemini API Error:', error);
    
    // Send error response
    return next(new ErrorResponse('Could not generate AI response: ' + (error.message || ''), 500));
  }
});