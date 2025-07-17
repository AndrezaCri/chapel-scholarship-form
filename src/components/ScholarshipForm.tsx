
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
import type { Question, TitleConfig } from '@/types/question';

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
  titles: TitleConfig;
  onEditQuestions: () => void;
}

const ScholarshipForm = ({ questions, titles, onEditQuestions }: ScholarshipFormProps) => {
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

  const sendEmailNotification = async (emailData: any, isAdmin = false) => {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });
    
    return response.ok;
  };

  const formatApplicationData = () => {
    let formattedData = `New Scholarship Application\n\n`;
    formattedData += `Personal Information:\n`;
    formattedData += `Name: ${formData.fullName}\n`;
    formattedData += `Email: ${formData.email}\n`;
    formattedData += `Address: ${formData.address}\n`;
    formattedData += `Phone: ${formData.phone}\n\n`;
    
    if (questions.length > 0) {
      formattedData += `Questions:\n`;
      questions.forEach(question => {
        const answer = formData.dynamicAnswers[question.id] || 'Not answered';
        formattedData += `${question.text}: ${answer}\n`;
      });
      formattedData += `\n`;
    }
    
    formattedData += `Essay Response:\n${formData.essayResponse}\n\n`;
    formattedData += `Submitted: ${new Date().toLocaleString()}`;
    
    return formattedData;
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
    
    try {
      // Email confirmation to candidate
      const confirmationEmail = {
        access_key: 'aa7fea55-5796-4468-aac2-5770b779709a',
        to: formData.email,
        subject: 'Confirmation - Darryl Jackson/SCMBC Scholarship Application',
        message: `Dear ${formData.fullName},\n\nYou have successfully applied for the Darryl Jackson/SCMBC Scholarship. You will be contacted by email if any additional information is needed.\n\nIf you have questions please email dljackson1277@gmail.com.\n\nBest regards,\nScholarship Committee`
      };

      // Email notification to admin with all form data
      const adminEmail = {
        access_key: 'aa7fea55-5796-4468-aac2-5770b779709a',
        to: 'dljackson1277@gmail.com',
        subject: `New Scholarship Application - ${formData.fullName}`,
        message: formatApplicationData()
      };

      // Send both emails
      const [confirmationSent, adminNotificationSent] = await Promise.allSettled([
        sendEmailNotification(confirmationEmail),
        sendEmailNotification(adminEmail, true)
      ]);

      // Check results and provide appropriate feedback
      const confirmationSuccess = confirmationSent.status === 'fulfilled' && confirmationSent.value;
      const adminSuccess = adminNotificationSent.status === 'fulfilled' && adminNotificationSent.value;

      if (confirmationSuccess && adminSuccess) {
        toast({
          title: "Application submitted successfully!",
          description: "Your application was sent and you'll receive a confirmation email."
        });
      } else if (confirmationSuccess && !adminSuccess) {
        toast({
          title: "Application submitted with issues",
          description: "Your confirmation email was sent, but admin notification failed. You will be contacted if additional information is needed.",
          variant: "destructive"
        });
      } else if (!confirmationSuccess && adminSuccess) {
        toast({
          title: "Application submitted with issues", 
          description: "Your application was sent to dljackson1277@gmail.com, but confirmation email failed.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Submission failed",
          description: "Both emails failed to send. Please try again or contact dljackson1277@gmail.com directly.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Email submission error:', error);
      toast({
        title: "Submission failed",
        description: "An error occurred while submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <div className="flex items-center space-x-2 min-h-[44px]">
                <RadioGroupItem value="yes" id={`${question.id}-yes`} className="h-5 w-5" />
                <Label htmlFor={`${question.id}-yes`} className="text-base cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 min-h-[44px]">
                <RadioGroupItem value="no" id={`${question.id}-no`} className="h-5 w-5" />
                <Label htmlFor={`${question.id}-no`} className="text-base cursor-pointer">No</Label>
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
              className="min-h-[100px] transition-all duration-200 focus:shadow-elegant resize-none text-base"
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
              className="transition-all duration-200 focus:shadow-elegant min-h-[44px] text-base"
              placeholder="Enter your response..."
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {titles.formTitle}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
                {titles.formSubtitle}
              </p>
            </div>
            <Button
              onClick={onEditQuestions}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 min-h-[44px] w-full sm:w-auto"
            >
              <Settings className="h-4 w-4" />
              Edit Questions
            </Button>
          </div>
        </div>

        <Card className="shadow-form border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              {titles.cardTitle}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Full name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="transition-all duration-200 focus:shadow-elegant min-h-[44px] text-base"
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
                      className="transition-all duration-200 focus:shadow-elegant min-h-[44px] text-base"
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
                    className="transition-all duration-200 focus:shadow-elegant min-h-[44px] text-base"
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
                    className="transition-all duration-200 focus:shadow-elegant min-h-[44px] text-base"
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
                  <h2 className="text-xl font-semibold text-foreground">{titles.essayTitle}</h2>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="essayResponse" className="text-sm font-medium">
                    {titles.essayQuestion}
                  </Label>
                  <Textarea
                    id="essayResponse"
                    value={formData.essayResponse}
                    onChange={(e) => handleInputChange('essayResponse', e.target.value)}
                    className="min-h-[150px] transition-all duration-200 focus:shadow-elegant resize-none text-base"
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
                  className="flex items-center gap-2 min-h-[48px] text-base w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-primary hover:opacity-90 transition-all min-h-[48px] text-base w-full sm:w-auto"
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
