/**
 * Unit tests for aiParser.js
 */

const { parseAndValidateFoodAnalysis, parseAndValidateDailyInsight } = require('../../src/services/ai/aiParser');

describe('AI Parser - parseAndValidateFoodAnalysis', () => {
  test('successfully parses valid JSON response', () => {
    const raw = JSON.stringify({
      food_name: 'Chicken Biryani',
      wellness_level: 'Moderate Concern',
      analysis: 'This meal may be relatively high in calories.',
      suggestion: 'Consider a smaller portion.',
      estimated_nutrition: {
        calories: 648,
        protein: 28,
        carbohydrates: 72,
        fat: 24,
        fiber: 4
      }
    });

    const parsed = parseAndValidateFoodAnalysis(raw);
    expect(parsed.food_name).toBe('Chicken Biryani');
    expect(parsed.wellness_level).toBe('Moderate Concern');
    expect(parsed.estimated_nutrition.calories).toBe(648);
  });

  test('successfully strips markdown blocks if present', () => {
    const raw = `\`\`\`json
    {
      "food_name": "Salad",
      "wellness_level": "Low Concern",
      "analysis": "Healthy salad.",
      "suggestion": "Keep it up.",
      "estimated_nutrition": {
        "calories": 150,
        "protein": 3,
        "carbohydrates": 10,
        "fat": 11,
        "fiber": 4
      }
    }
    \`\`\``;

    const parsed = parseAndValidateFoodAnalysis(raw);
    expect(parsed.food_name).toBe('Salad');
    expect(parsed.wellness_level).toBe('Low Concern');
  });

  test('corrects and maps invalid wellness_level values', () => {
    const raw = JSON.stringify({
      food_name: 'Ice Cream',
      wellness_level: 'Very High Risk!', // Invalid level
      analysis: 'High sugar.',
      suggestion: 'Eat less.',
      estimated_nutrition: { calories: 300, protein: 4, carbohydrates: 40, fat: 15, fiber: 1 }
    });

    const parsed = parseAndValidateFoodAnalysis(raw);
    // Maps "Very High Risk!" to "High Concern" because it contains "high"
    expect(parsed.wellness_level).toBe('High Concern');
  });

  test('coerces nutrition string values to rounded integers', () => {
    const raw = JSON.stringify({
      food_name: 'Apple',
      wellness_level: 'Low Concern',
      analysis: 'Nutritious.',
      suggestion: 'Great snack.',
      estimated_nutrition: {
        calories: '95.6',
        protein: '0.5',
        carbohydrates: '25',
        fat: '0.3',
        fiber: '4.4'
      }
    });

    const parsed = parseAndValidateFoodAnalysis(raw);
    expect(parsed.estimated_nutrition.calories).toBe(96);
    expect(parsed.estimated_nutrition.protein).toBe(1);
    expect(parsed.estimated_nutrition.fiber).toBe(4);
  });

  test('throws error for malformed/invalid JSON', () => {
    const raw = "{ food_name: 'Salad', }"; // Invalid JSON format (missing quotes, trailing comma)
    expect(() => parseAndValidateFoodAnalysis(raw)).toThrow('AI response is not valid JSON');
  });

  test('throws error for missing required fields', () => {
    const raw = JSON.stringify({
      food_name: 'Salad'
      // missing wellness_level, analysis, etc.
    });
    expect(() => parseAndValidateFoodAnalysis(raw)).toThrow('AI response is missing required field');
  });
});

describe('AI Parser - parseAndValidateDailyInsight', () => {
  test('successfully parses valid insight JSON', () => {
    const raw = JSON.stringify({
      title: 'Watch your fats',
      text: 'Try reducing fried food intake.'
    });

    const parsed = parseAndValidateDailyInsight(raw);
    expect(parsed.title).toBe('Watch your fats');
    expect(parsed.text).toBe('Try reducing fried food intake.');
  });

  test('throws error if fields are missing', () => {
    const raw = JSON.stringify({
      title: 'Title without description'
    });
    expect(() => parseAndValidateDailyInsight(raw)).toThrow('AI insight response is missing required fields');
  });
});
