import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Loader, Heart, AlertTriangle, Calendar, Pill, Activity } from 'lucide-react';
import { UserRole } from '../App';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  suggestions?: string[];
  quickActions?: {
    label: string;
    action: string;
    icon?: React.ComponentType<any>;
  }[];
}

interface ChatbotProps {
  userRole: UserRole;
  onQuickAction?: (action: string) => void;
}

export function Chatbot({ userRole, onQuickAction }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'bot',
      message: userRole === 'patient' 
        ? "Hello! I'm your AI health assistant. I can help you with health questions, medication reminders, appointment scheduling, and emergency guidance. How can I assist you today?"
        : userRole === 'doctor'
        ? "Hello Doctor! I'm your AI medical assistant. I can help with patient information, clinical guidelines, drug interactions, and administrative tasks. What would you like assistance with?"
        : "Hello Admin! I'm your system assistant. I can help with user management, system monitoring, troubleshooting, and platform analytics. How can I help?",
      timestamp: new Date(),
      quickActions: userRole === 'patient' ? [
        { label: 'Check Symptoms', action: 'symptoms', icon: Activity },
        { label: 'Medication Info', action: 'medication', icon: Pill },
        { label: 'Book Appointment', action: 'appointment', icon: Calendar },
        { label: 'Emergency Help', action: 'emergency', icon: AlertTriangle }
      ] : userRole === 'doctor' ? [
        { label: 'Patient Lookup', action: 'patient-lookup', icon: User },
        { label: 'Drug Interactions', action: 'drug-interactions', icon: Pill },
        { label: 'Clinical Guidelines', action: 'guidelines', icon: Heart },
        { label: 'Schedule Management', action: 'schedule', icon: Calendar }
      ] : [
        { label: 'User Management', action: 'user-management', icon: User },
        { label: 'System Status', action: 'system-status', icon: Activity },
        { label: 'Analytics', action: 'analytics', icon: Heart },
        { label: 'Support Tickets', action: 'support', icon: AlertTriangle }
      ]
    };
    setMessages([welcomeMessage]);
  }, [userRole]);

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let quickActions: ChatMessage['quickActions'] = [];

    // Patient responses
    if (userRole === 'patient') {
      if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
        response = "I understand you're experiencing pain. Can you describe the location and intensity (1-10 scale)? If it's severe (8+) or you have chest pain, please seek immediate medical attention or call emergency services.";
        suggestions = ['Rate pain 1-10', 'Describe location', 'Call emergency services'];
        quickActions = [
          { label: 'Emergency Call', action: 'emergency-call', icon: AlertTriangle },
          { label: 'Contact Doctor', action: 'contact-doctor', icon: User }
        ];
      } else if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
        response = "I can help with medication information. Are you looking for dosage instructions, side effects, or interaction warnings? Always consult your healthcare provider before making changes.";
        suggestions = ['Check dosage', 'Side effects info', 'Drug interactions'];
      } else if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
        response = "I can help you schedule an appointment. Would you like to book a routine check-up, follow-up visit, or urgent consultation?";
        suggestions = ['Routine check-up', 'Follow-up visit', 'Urgent consultation'];
        quickActions = [
          { label: 'Book Now', action: 'book-appointment', icon: Calendar }
        ];
      } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
        response = "For medical emergencies, call 911 immediately. For urgent but non-emergency situations, I can help you contact your healthcare provider or find urgent care options.";
        quickActions = [
          { label: 'Call 911', action: 'call-911', icon: AlertTriangle },
          { label: 'Contact Doctor', action: 'contact-doctor', icon: User },
          { label: 'Find Urgent Care', action: 'urgent-care', icon: Heart }
        ];
      } else {
        response = "I'm here to help with your health-related questions. I can assist with symptoms, medications, appointments, and general health guidance. What specific area would you like help with?";
        suggestions = ['Symptom checker', 'Medication help', 'Book appointment', 'Health tips'];
      }
    }
    
    // Doctor responses
    else if (userRole === 'doctor') {
      if (lowerMessage.includes('patient') || lowerMessage.includes('lookup')) {
        response = "I can help you find patient information. Please provide the patient's name or ID, and I'll retrieve their medical history, current medications, and recent vitals.";
        suggestions = ['Search by name', 'Search by ID', 'Recent patients'];
      } else if (lowerMessage.includes('drug') || lowerMessage.includes('interaction')) {
        response = "I can check drug interactions and contraindications. Please specify the medications you'd like me to analyze, and I'll provide interaction warnings and alternative suggestions.";
        suggestions = ['Check interactions', 'Alternative medications', 'Dosage guidelines'];
      } else if (lowerMessage.includes('guideline') || lowerMessage.includes('protocol')) {
        response = "I have access to current clinical guidelines and protocols. What condition or procedure would you like guidance on?";
        suggestions = ['Hypertension guidelines', 'Diabetes protocols', 'Emergency procedures'];
      } else if (lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
        response = "I can help manage your schedule. Would you like to view today's appointments, reschedule a patient, or check availability?";
        suggestions = ['Today\'s schedule', 'Reschedule patient', 'Check availability'];
      } else {
        response = "I'm your medical AI assistant. I can help with patient lookups, drug interactions, clinical guidelines, scheduling, and administrative tasks. What do you need assistance with?";
        suggestions = ['Patient information', 'Drug interactions', 'Clinical guidelines', 'Schedule management'];
      }
    }
    
    // Admin responses
    else {
      if (lowerMessage.includes('user') || lowerMessage.includes('account')) {
        response = "I can help with user management tasks. Would you like to create new accounts, modify permissions, or review user activity?";
        suggestions = ['Create account', 'Modify permissions', 'User activity'];
      } else if (lowerMessage.includes('system') || lowerMessage.includes('status')) {
        response = "System status: All services operational. Current uptime: 99.9%. Would you like detailed metrics on server performance, database status, or network connectivity?";
        suggestions = ['Server metrics', 'Database status', 'Network status'];
      } else if (lowerMessage.includes('analytics') || lowerMessage.includes('report')) {
        response = "I can generate various analytics reports. What type of data would you like to analyze - user engagement, system performance, or health metrics?";
        suggestions = ['User engagement', 'System performance', 'Health metrics'];
      } else {
        response = "I'm your system administration assistant. I can help with user management, system monitoring, analytics, and troubleshooting. What would you like assistance with?";
        suggestions = ['User management', 'System status', 'Generate reports', 'Troubleshooting'];
      }
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      message: response,
      timestamp: new Date(),
      suggestions,
      quickActions
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    if (onQuickAction) {
      onQuickAction(action);
    }
    
    // Add user message for the quick action
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: `Selected: ${action.replace('-', ' ')}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, actionMessage]);
    setIsTyping(true);

    // Generate appropriate response
    setTimeout(() => {
      const botResponse = generateBotResponse(action);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Health Assistant</h3>
            <p className="text-xs text-blue-100">
              {userRole === 'patient' ? 'Personal Health Guide' : 
               userRole === 'doctor' ? 'Medical Assistant' : 
               'System Assistant'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-blue-100 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg' 
                : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
            } p-3`}>
              <p className="text-sm">{message.message}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              {/* Quick Actions */}
              {message.quickActions && message.quickActions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.quickActions.map((action, index) => {
                    const Icon = action.icon || Bot;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.action)}
                        className="flex items-center space-x-2 w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-left p-2 rounded transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg p-3 flex items-center space-x-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your health..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
