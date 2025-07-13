import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { generateAnalyticsInsights } from '../../../utils/openaiServices';

const AIInsightsPanel = ({ grievances }) => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState(null);

  useEffect(() => {
    if (grievances?.length > 0) {
      generateInsights();
    }
  }, [grievances]);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const aiInsights = await generateAnalyticsInsights(grievances);
      setInsights(aiInsights);
      setLastAnalysisTime(new Date());
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInsights = () => {
    generateInsights();
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-government border border-border p-6">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-sm font-body text-muted-foreground">Generating AI insights...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-government border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <Icon name="Sparkles" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">AI Insights</h3>
            <p className="text-xs font-body text-muted-foreground">
              {lastAnalysisTime && `Last updated: ${lastAnalysisTime.toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshInsights}
          disabled={isLoading}
          iconName="RefreshCw"
          iconSize={14}
        >
          Refresh
        </Button>
      </div>

      {insights ? (
        <div className="space-y-6">
          {/* Summary */}
          <div>
            <h4 className="text-sm font-body font-semibold text-foreground mb-2">Executive Summary</h4>
            <p className="text-sm font-body text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {insights.summary}
            </p>
          </div>

          {/* Common Issues */}
          <div>
            <h4 className="text-sm font-body font-semibold text-foreground mb-3">Common Issues</h4>
            <div className="space-y-2">
              {insights.commonIssues?.map((issue, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-body text-foreground">{issue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Insights */}
          <div>
            <h4 className="text-sm font-body font-semibold text-foreground mb-3">Department Analysis</h4>
            <div className="space-y-2">
              {insights.departmentInsights?.map((insight, index) => (
                <div key={index} className="bg-accent/5 p-3 rounded-lg border border-accent/10">
                  <p className="text-xs font-body text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trends */}
          <div>
            <h4 className="text-sm font-body font-semibold text-foreground mb-2">Trends Analysis</h4>
            <p className="text-sm font-body text-muted-foreground bg-warning/10 p-3 rounded-lg border border-warning/20">
              {insights.trends}
            </p>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-sm font-body font-semibold text-foreground mb-3">Recommendations</h4>
            <div className="space-y-2">
              {insights.recommendations?.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Icon name="ArrowRight" size={14} className="text-success mt-0.5" />
                  <span className="text-sm font-body text-foreground">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Badge */}
          <div className="flex items-center justify-center pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-xs font-body text-muted-foreground">
              <Icon name="Brain" size={12} />
              <span>Powered by OpenAI GPT-4</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-sm font-body text-muted-foreground mb-4">
            No insights available yet. Add some grievances to get AI-powered analytics.
          </p>
          <Button
            variant="outline"
            onClick={generateInsights}
            iconName="Sparkles"
            iconPosition="left"
            iconSize={16}
          >
            Generate Insights
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;