
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MapPin, Phone, HelpCircle, FileText, Download, Send, Settings } from 'lucide-react';
import type { Question } from './QuestionEditor';

interface FormData {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  dynamicAnswers: Record<string, string>;
  essayResponse: string;
}

interface ScholarshipFormProps {
  questions: Question[];
  onEditQuestions: () => void;
}

const ScholarshipForm = ({ questions, onEditQuestions }: ScholarshipFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    dynamicAnswers: {},
    essayResponse: ''
  });

  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'essayResponse') {
      setCharCount(value.length);
    }
  };

  const handleDynamicAnswerChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dynamicAnswers: {
        ...prev.dynamicAnswers,
        [questionId]: value
      }
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.fullName.trim()) errors.push('Full name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.email.includes('@')) errors.push('Email must be valid');
    
    // Validate required dynamic questions
    questions.forEach(question => {
      if (question.required && !formData.dynamicAnswers[question.id]?.trim()) {
        errors.push(`${question.text} is required`);
      }
    });
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Form submitted successfully!",
        description: "Your application was sent to dljackson1277@gmail.com"
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const exportToCSV = () => {
    const headers = [
      'Full Name', 'Email', 'Address', 'Phone',
      ...questions.map(q => q.text),
      'Essay Response'
    ];
    
    const values = [
      formData.fullName, formData.email, formData.address, formData.phone,
      ...questions.map(q => formData.dynamicAnswers[q.id] || ''),
      formData.essayResponse
    ];
    
    const csvContent = `${headers.join(',')}\n${values.map(v => `"${v}"`).join(',')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scholarship-application.csv';
    a.click();
    
    toast({
      title: "Export successful!",
      description: "CSV file downloaded"
    });
  };

  const renderDynamicQuestion = (question: Question) => {
    const value = formData.dynamicAnswers[question.id] || '';
    
    switch (question.type) {
      case 'radio':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {question.text} {question.required && '*'}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(newValue) => handleDynamicAnswerChange(question.id, newValue)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                <Label htmlFor={`${question.id}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${question.id}-no`} />
                <Label htmlFor={`${question.id}-no`}>No</Label>
              </div>
            </RadioGroup>
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.text} {question.required && '*'}
            </Label>
            <Textarea
              value={value}
              onChange={(e) => handleDynamicAnswerChange(question.id, e.target.value)}
              className="min-h-[100px] transition-all duration-200 focus:shadow-elegant resize-none"
              placeholder="Enter your response..."
              maxLength={question.maxLength || 1500}
            />
            {question.maxLength && (
              <div className="text-right text-sm text-muted-foreground">
                {value.length}/{question.maxLength} characters
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.text} {question.required && '*'}
            </Label>
            <Input
              type="text"
              value={value}
              onChange={(e) => handleDynamicAnswerChange(question.id, e.target.value)}
              className="transition-all duration-200 focus:shadow-elegant"
              placeholder="Enter your response..."
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Application Form
              </h1>
              <p className="text-xl text-muted-foreground">
                Scholarship | Spring Chapel MBC
              </p>
            </div>
            <Button
              onClick={onEditQuestions}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Edit Questions
            </Button>
          </div>
        </div>

        <Card className="shadow-form border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Scholarship Application
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Full name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="transition-all duration-200 focus:shadow-elegant"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="transition-all duration-200 focus:shadow-elegant"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Complete address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="transition-all duration-200 focus:shadow-elegant"
                    placeholder="Street, number, city, state, ZIP code"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone (with area code)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="transition-all duration-200 focus:shadow-elegant"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {questions.length > 0 && (
                <>
                  <Separator className="my-8" />

                  {/* Dynamic Questions */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold text-foreground">Questions</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {questions.map((question) => (
                        <div key={question.id}>
                          {renderDynamicQuestion(question)}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator className="my-8" />

              {/* Essay Question */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Essay Question</h2>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="essayResponse" className="text-sm font-medium">
                    How would a scholarship benefit you in your educational pursuits?
                  </Label>
                  <Textarea
                    id="essayResponse"
                    value={formData.essayResponse}
                    onChange={(e) => handleInputChange('essayResponse', e.target.value)}
                    className="min-h-[150px] transition-all duration-200 focus:shadow-elegant resize-none"
                    placeholder="Describe how a scholarship would benefit your educational goals..."
                    maxLength={1500}
                  />
                  <div className="text-right text-sm text-muted-foreground">
                    {charCount}/1500 characters | {Math.floor(charCount / 6)}/250 words (approx.)
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={exportToCSV}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-primary hover:opacity-90 transition-all"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScholarshipForm;
