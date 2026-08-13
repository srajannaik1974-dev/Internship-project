/**
 * Integration and Unit tests for gemini.service.js using mocks.
 */

// Set up mock before requiring the service
const mockGenerateContent = jest.fn();

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: mockGenerateContent
        }
      };
    })
  };
});

const geminiService = require('../../src/services/ai/gemini.service');

describe('Gemini Service - analyzeFood', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-api-key';
    jest.clearAllMocks();
  });

  // Test 1: Text input: Chicken Biryani, 1 plate
  test('Test 1: Text input returns valid structured JSON', async () => {
    const validJsonOutput = JSON.stringify({
      food_name: 'Chicken Biryani',
      wellness_level: 'Moderate Concern',
      analysis: 'This is an approximate nutrition estimate. It is rich in protein but can be calorie-dense.',
      suggestion: 'Consider portion control and pairing with vegetables.',
      estimated_nutrition: {
        calories: 648,
        protein: 28,
        carbohydrates: 72,
        fat: 24,
        fiber: 4
      }
    });

    mockGenerateContent.mockResolvedValueOnce({ text: validJsonOutput });

    const result = await geminiService.analyzeFood({
      foodDescription: 'Chicken Biryani',
      mealType: 'Lunch',
      quantity: '1 plate'
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(result.food_name).toBe('Chicken Biryani');
    expect(result.wellness_level).toBe('Moderate Concern');
    expect(result.estimated_nutrition.calories).toBe(648);
  });

  // Test 2: Food image: Food image -> Gemini -> structured response
  test('Test 2: Food image input converts image buffer to base64 and passes to Gemini', async () => {
    const validJsonOutput = JSON.stringify({
      food_name: 'Grilled Salmon',
      wellness_level: 'Low Concern',
      analysis: 'Highly nutritious fish rich in omega-3 fatty acids.',
      suggestion: 'Serve with steamed asparagus.',
      estimated_nutrition: {
        calories: 350,
        protein: 34,
        carbohydrates: 0,
        fat: 22,
        fiber: 0
      }
    });

    mockGenerateContent.mockResolvedValueOnce({ text: validJsonOutput });

    const dummyBuffer = Buffer.from('fake-image-bytes');
    const result = await geminiService.analyzeFood({
      foodDescription: 'Salmon',
      image: {
        buffer: dummyBuffer,
        mimeType: 'image/png'
      }
    });

    // Check if the mock was called with the base64 translation of our buffer
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const callArgs = mockGenerateContent.mock.calls[0][0];
    
    // Check contents format
    expect(callArgs.contents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          inlineData: {
            mimeType: 'image/png',
            data: dummyBuffer.toString('base64')
          }
        })
      ])
    );
    expect(result.food_name).toBe('Grilled Salmon');
  });

  // Test 3: Invalid/unclear image
  test('Test 3: Unclear image is handled and returns controlled response with lower confidence', async () => {
    const lowConfidenceOutput = JSON.stringify({
      food_name: 'Unknown Item',
      wellness_level: 'Moderate Concern',
      analysis: 'The image provided is unclear or does not seem to contain recognizable food. This is an approximate estimate.',
      suggestion: 'Please upload a clearer image of your food.',
      estimated_nutrition: {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0
      }
    });

    mockGenerateContent.mockResolvedValueOnce({ text: lowConfidenceOutput });

    const result = await geminiService.analyzeFood({
      image: {
        base64: 'unclear-image-data-base64',
        mimeType: 'image/jpeg'
      }
    });

    expect(result.food_name).toBe('Unknown Item');
    expect(result.analysis).toContain('unclear');
  });

  // Test 4: Malformed Gemini JSON
  test('Test 4: Malformed Gemini JSON causes validation failure and throws controlled error', async () => {
    // Malformed JSON (truncated string)
    const malformedOutput = '{"food_name": "Chicken Biryani", "wellness_level": "Mod';

    mockGenerateContent.mockResolvedValueOnce({ text: malformedOutput });

    await expect(
      geminiService.analyzeFood({ foodDescription: 'Biryani' })
    ).rejects.toThrow('AI Analysis Failed: AI response is not valid JSON');
  });

  // Test 5: Gemini API failure
  test('Test 5: Gemini API failure throws controlled user-friendly error', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API key not valid. Please check your credentials.'));

    await expect(
      geminiService.analyzeFood({ foodDescription: 'Biryani' })
    ).rejects.toThrow('AI Service Configuration Error: Invalid or missing API key.');
  });
});
