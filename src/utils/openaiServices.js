import openai from './openaiClient';

/**
 * Analyzes grievance text and suggests appropriate department using OpenAI
 * @param {string} grievanceText - The grievance description text
 * @returns {Promise<object>} Structured response with department suggestion and confidence
 */
export async function suggestDepartment(grievanceText) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that analyzes citizen grievances and suggests the appropriate government department. 
          Analyze the grievance text and determine which department should handle it based on the following departments:
          - water-supply: Water Supply & Sanitation issues
          - electricity: Electricity & Power related problems  
          - roads-transport: Roads & Transportation issues
          - health-medical: Health & Medical Services
          - education: Education & Schools
          - police-security: Police & Security matters
          - municipal-services: Municipal Services (garbage, civic amenities)
          - revenue-taxation: Revenue & Taxation
          - agriculture: Agriculture & Farming
          - environment: Environment & Pollution
          - social-welfare: Social Welfare
          - other: Other Department (if none match)
          
          Provide your response in the exact JSON format specified.`
        },
        {
          role: 'user',
          content: grievanceText
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'department_suggestion',
          schema: {
            type: 'object',
            properties: {
              suggestedDepartment: { type: 'string' },
              confidence: { type: 'number' },
              reasoning: { type: 'string' },
              category: { type: 'string' }
            },
            required: ['suggestedDepartment', 'confidence', 'reasoning', 'category'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error suggesting department:', error);
    // Fallback to basic keyword matching
    return fallbackDepartmentSuggestion(grievanceText);
  }
}

/**
 * Analyzes grievance text for priority classification
 * @param {string} grievanceText - The grievance description text
 * @returns {Promise<object>} Priority analysis result
 */
export async function analyzePriority(grievanceText) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Analyze the urgency and priority level of this citizen grievance. Consider factors like:
          - Public safety impact
          - Number of people affected
          - Severity of the issue
          - Time sensitivity
          
          Classify as: urgent, high, medium, or low priority.`
        },
        {
          role: 'user',
          content: grievanceText
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'priority_analysis',
          schema: {
            type: 'object',
            properties: {
              priority: { type: 'string' },
              reasoning: { type: 'string' },
              affectedPeople: { type: 'string' },
              timeframe: { type: 'string' }
            },
            required: ['priority', 'reasoning', 'affectedPeople', 'timeframe'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing priority:', error);
    return {
      priority: 'medium',
      reasoning: 'Default priority assigned due to analysis error',
      affectedPeople: 'Unknown',
      timeframe: 'Standard processing time'
    };
  }
}

/**
 * Generates summary and insights for admin dashboard
 * @param {Array} grievances - Array of grievance objects
 * @returns {Promise<object>} Analytics insights
 */
export async function generateAnalyticsInsights(grievances) {
  try {
    const grievancesSummary = grievances.map(g => ({
      id: g.grievanceId,
      department: g.department,
      status: g.status,
      priority: g.priority,
      description: g.description?.substring(0, 100) + '...'
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an AI analyst for government grievance management. Analyze the provided grievance data and generate insights about:
          - Common issues and trends
          - Department performance patterns
          - Priority distribution analysis
          - Recommendations for improvement
          
          Provide actionable insights for administrators.`
        },
        {
          role: 'user',
          content: `Analyze these grievances: ${JSON.stringify(grievancesSummary)}`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'analytics_insights',
          schema: {
            type: 'object',
            properties: {
              commonIssues: { type: 'array', items: { type: 'string' } },
              departmentInsights: { type: 'array', items: { type: 'string' } },
              recommendations: { type: 'array', items: { type: 'string' } },
              trends: { type: 'string' },
              summary: { type: 'string' }
            },
            required: ['commonIssues', 'departmentInsights', 'recommendations', 'trends', 'summary'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating analytics insights:', error);
    return {
      commonIssues: ['Infrastructure maintenance', 'Utility services', 'Public safety'],
      departmentInsights: ['Performance analysis unavailable'],
      recommendations: ['Improve response times', 'Enhanced citizen communication'],
      trends: 'Data analysis currently unavailable',
      summary: 'Analytics insights generation failed. Using fallback data.'
    };
  }
}

/**
 * Fallback department suggestion using keyword matching
 * @param {string} text - Grievance text
 * @returns {object} Department suggestion
 */
function fallbackDepartmentSuggestion(text) {
  const keywords = text.toLowerCase();
  let suggestion = 'municipal-services';
  let category = 'General';
  let confidence = 0.6;

  if (keywords.includes('water') || keywords.includes('tap') || keywords.includes('drainage')) {
    suggestion = 'water-supply';
    category = 'Utilities';
    confidence = 0.8;
  } else if (keywords.includes('electricity') || keywords.includes('power') || keywords.includes('light')) {
    suggestion = 'electricity';
    category = 'Utilities';
    confidence = 0.8;
  } else if (keywords.includes('road') || keywords.includes('transport') || keywords.includes('bus')) {
    suggestion = 'roads-transport';
    category = 'Transportation';
    confidence = 0.8;
  } else if (keywords.includes('health') || keywords.includes('hospital') || keywords.includes('doctor')) {
    suggestion = 'health-medical';
    category = 'Healthcare';
    confidence = 0.8;
  } else if (keywords.includes('school') || keywords.includes('education') || keywords.includes('teacher')) {
    suggestion = 'education';
    category = 'Education';
    confidence = 0.8;
  } else if (keywords.includes('police') || keywords.includes('crime') || keywords.includes('security')) {
    suggestion = 'police-security';
    category = 'Security';
    confidence = 0.8;
  }

  return {
    suggestedDepartment: suggestion,
    confidence,
    reasoning: 'Keyword-based analysis (fallback method)',
    category
  };
}