
import React, { useState } from 'react';
import ScholarshipForm from '@/components/ScholarshipForm';
import QuestionEditor from '@/components/QuestionEditor';
import AdminAuth from '@/components/AdminAuth';
import type { Question } from '@/types/question';

const Index = () => {
  const [currentView, setCurrentView] = useState<'form' | 'auth' | 'editor'>('form');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Default questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'member_question',
      text: 'Are you a member of Spring Chapel MBC?',
      type: 'radio',
      required: false
    },
    {
      id: 'membership_duration',
      text: 'If so, how long have you been a member?',
      type: 'text',
      required: false
    },
    {
      id: 'college_plans',
      text: 'Do you plan to attend college in the Fall?',
      type: 'radio',
      required: false
    },
    {
      id: 'college_location',
      text: 'If so, where?',
      type: 'text',
      required: false
    }
  ]);

  const handleEditQuestions = () => {
    if (isAuthenticated) {
      setCurrentView('editor');
    } else {
      setCurrentView('auth');
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('editor');
  };

  const handleBackToForm = () => {
    setCurrentView('form');
  };

  const handleQuestionsUpdate = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    setCurrentView('form');
  };

  if (currentView === 'auth') {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'editor') {
    return (
      <QuestionEditor
        questions={questions}
        onQuestionsUpdate={handleQuestionsUpdate}
        onBack={handleBackToForm}
      />
    );
  }

  return (
    <ScholarshipForm
      questions={questions}
      onEditQuestions={handleEditQuestions}
    />
  );
};

export default Index;
