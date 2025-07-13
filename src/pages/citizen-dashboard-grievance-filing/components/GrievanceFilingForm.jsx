import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { suggestDepartment, analyzePriority } from '../../../utils/openaiServices';

const GrievanceFilingForm = ({ onSubmit, isSubmitting }) => {
  const [grievanceText, setGrievanceText] = useState('');
  const [suggestedDepartment, setSuggestedDepartment] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [aiSuggestionTimeout, setAiSuggestionTimeout] = useState(null);
  const [aiSuggestionData, setAiSuggestionData] = useState(null);
  const [priorityAnalysis, setPriorityAnalysis] = useState(null);

  const departmentOptions = [
    { value: 'water-supply', label: 'Water Supply & Sanitation' },
    { value: 'electricity', label: 'Electricity & Power' },
    { value: 'roads-transport', label: 'Roads & Transportation' },
    { value: 'health-medical', label: 'Health & Medical Services' },
    { value: 'education', label: 'Education & Schools' },
    { value: 'police-security', label: 'Police & Security' },
    { value: 'municipal-services', label: 'Municipal Services' },
    { value: 'revenue-taxation', label: 'Revenue & Taxation' },
    { value: 'agriculture', label: 'Agriculture & Farming' },
    { value: 'environment', label: 'Environment & Pollution' },
    { value: 'social-welfare', label: 'Social Welfare' },
    { value: 'other', label: 'Other Department' }
  ];

  useEffect(() => {
    if (grievanceText.length > 20) {
      if (aiSuggestionTimeout) {
        clearTimeout(aiSuggestionTimeout);
      }
      
      const timeout = setTimeout(() => {
        processAiSuggestion(grievanceText);
      }, 1000);
      
      setAiSuggestionTimeout(timeout);
    }
    
    return () => {
      if (aiSuggestionTimeout) {
        clearTimeout(aiSuggestionTimeout);
      }
    };
  }, [grievanceText]);

  const processAiSuggestion = async (text) => {
    setIsAiProcessing(true);
    
    try {
      // Use OpenAI to suggest department and analyze priority
      const [departmentSuggestion, priorityData] = await Promise.all([
        suggestDepartment(text),
        analyzePriority(text)
      ]);
      
      setAiSuggestionData(departmentSuggestion);
      setPriorityAnalysis(priorityData);
      setSuggestedDepartment(departmentSuggestion.suggestedDepartment);
      
      if (!selectedDepartment) {
        setSelectedDepartment(departmentSuggestion.suggestedDepartment);
      }
    } catch (error) {
      console.error('AI suggestion failed:', error);
      // Fallback is handled within the service
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (!grievanceText.trim() || !selectedDepartment) return;
    setShowConfirmation(true);
  };

  const confirmSubmission = () => {
    const grievanceData = {
      description: grievanceText.trim(),
      department: selectedDepartment,
      suggestedByAi: suggestedDepartment === selectedDepartment,
      timestamp: new Date().toISOString(),
      aiAnalysis: {
        departmentSuggestion: aiSuggestionData,
        priorityAnalysis: priorityAnalysis
      }
    };
    
    onSubmit(grievanceData);
    setShowConfirmation(false);
    setGrievanceText('');
    setSelectedDepartment('');
    setSuggestedDepartment('');
    setAiSuggestionData(null);
    setPriorityAnalysis(null);
  };

  const cancelSubmission = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="bg-card rounded-lg shadow-government border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="MessageSquare" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">File a Grievance</h2>
          <p className="text-sm font-body text-muted-foreground">Describe your issue and our AI will help route it to the right department</p>
        </div>
      </div>

      {!showConfirmation ? (
        <div className="space-y-6">
          {/* Grievance Description */}
          <div>
            <label className="block text-sm font-body font-medium text-foreground mb-2">
              Describe your grievance
            </label>
            <textarea
              value={grievanceText}
              onChange={(e) => setGrievanceText(e.target.value)}
              placeholder="Please describe your issue in detail. Include location, dates, and any relevant information that will help us understand and resolve your concern..."
              className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-body"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-caption text-muted-foreground">
                {grievanceText.length}/1000 characters
              </span>
              {isAiProcessing && (
                <div className="flex items-center space-x-2 text-xs font-caption text-accent">
                  <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <span>AI analyzing...</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Results */}
          {aiSuggestionData && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Sparkles" size={16} className="text-accent" />
                <span className="text-sm font-body font-medium text-accent">AI Analysis</span>
                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                  {Math.round(aiSuggestionData.confidence * 100)}% confidence
                </span>
              </div>
              
              <div>
                <p className="text-sm font-body text-foreground mb-2">
                  <span className="font-medium">Department:</span> {departmentOptions.find(dept => dept.value === aiSuggestionData.suggestedDepartment)?.label}
                </p>
                <p className="text-sm font-body text-foreground mb-2">
                  <span className="font-medium">Category:</span> {aiSuggestionData.category}
                </p>
                <p className="text-xs font-body text-muted-foreground">
                  {aiSuggestionData.reasoning}
                </p>
              </div>

              {priorityAnalysis && (
                <div className="border-t border-accent/20 pt-3">
                  <p className="text-sm font-body text-foreground mb-1">
                    <span className="font-medium">Priority:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      priorityAnalysis.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      priorityAnalysis.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      priorityAnalysis.priority === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {priorityAnalysis.priority}
                    </span>
                  </p>
                  <p className="text-xs font-body text-muted-foreground">
                    {priorityAnalysis.reasoning}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Department Selection */}
          <div>
            <Select
              label="Select Department"
              description="Choose the department that should handle your grievance"
              options={departmentOptions}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Select a department"
              searchable
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!grievanceText.trim() || !selectedDepartment || isAiProcessing}
            iconName="Send"
            iconPosition="right"
            iconSize={16}
            fullWidth
          >
            Submit Grievance
          </Button>
        </div>
      ) : (
        /* Confirmation Dialog */
        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-3">Confirm Submission</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-body font-medium text-muted-foreground">Department:</span>
                <p className="text-sm font-body text-foreground mt-1">
                  {departmentOptions.find(dept => dept.value === selectedDepartment)?.label}
                </p>
              </div>
              
              <div>
                <span className="text-sm font-body font-medium text-muted-foreground">Description:</span>
                <p className="text-sm font-body text-foreground mt-1 bg-background p-3 rounded border">
                  {grievanceText}
                </p>
              </div>

              {aiSuggestionData && (
                <div>
                  <span className="text-sm font-body font-medium text-muted-foreground">AI Analysis:</span>
                  <div className="text-xs font-body text-muted-foreground mt-1 space-y-1">
                    <p>Category: {aiSuggestionData.category}</p>
                    <p>Confidence: {Math.round(aiSuggestionData.confidence * 100)}%</p>
                    {priorityAnalysis && <p>Priority: {priorityAnalysis.priority}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} className="text-accent mt-0.5" />
              <div>
                <p className="text-sm font-body text-foreground">
                  Your grievance will be recorded on the blockchain for transparency and immutability. 
                  You'll receive a unique grievance ID for tracking purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={cancelSubmission}
              disabled={isSubmitting}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={16}
              className="flex-1"
            >
              Back to Edit
            </Button>
            <Button
              variant="default"
              onClick={confirmSubmission}
              loading={isSubmitting}
              iconName="Check"
              iconPosition="left"
              iconSize={16}
              className="flex-1"
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceFilingForm;