
import React, { useState, useEffect } from 'react';
import ScholarshipForm from '@/components/ScholarshipForm';
import QuestionEditor from '@/components/QuestionEditor';
import AdminAuth from '@/components/AdminAuth';
import type { Question, TitleConfig } from '@/types/question';

const Index = () => {
  const [currentView, setCurrentView] = useState<'form' | 'auth' | 'editor'>('form');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Default titles
  const defaultTitles: TitleConfig = {
    formTitle: 'Application Form',
    formSubtitle: 'Scholarship | Spring Chapel MBC',
    cardTitle: 'Scholarship Application',
    essayTitle: 'Essay Question',
    essayQuestion: 'How would a scholarship benefit you in your educational pursuits?',
    editorTitle: 'Question Editor',
    editorSubtitle: 'Customize the scholarship application questions'
  };

  // Load titles from localStorage or use defaults
  const [titles, setTitles] = useState<TitleConfig>(() => {
    const saved = localStorage.getItem('scholarship-titles');
    return saved ? JSON.parse(saved) : defaultTitles;
  });
  
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

  const handleTitlesUpdate = (newTitles: TitleConfig) => {
    setTitles(newTitles);
    localStorage.setItem('scholarship-titles', JSON.stringify(newTitles));
  };

  // Save titles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scholarship-titles', JSON.stringify(titles));
  }, [titles]);

  if (currentView === 'auth') {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'editor') {
    return (
      <QuestionEditor
        questions={questions}
        titles={titles}
        onQuestionsUpdate={handleQuestionsUpdate}
        onTitlesUpdate={handleTitlesUpdate}
        onBack={handleBackToForm}
      />
    );
  }

  return (
    <ScholarshipForm
      questions={questions}
      titles={titles}
      onEditQuestions={handleEditQuestions}
    />
  );
};

export default Index;
