
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, ArrowLeft, Plus, Trash2, Type, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Question, TitleConfig } from '@/types/question';

interface QuestionEditorProps {
  questions: Question[];
  titles: TitleConfig;
  onQuestionsUpdate: (questions: Question[]) => void;
  onTitlesUpdate: (titles: TitleConfig) => void;
  onBack: () => void;
}

const QuestionEditor = ({ questions, titles, onQuestionsUpdate, onTitlesUpdate, onBack }: QuestionEditorProps) => {
  const { toast } = useToast();
  const [editingQuestions, setEditingQuestions] = useState<Question[]>(questions);
  const [editingTitles, setEditingTitles] = useState<TitleConfig>(titles);

  const handleQuestionChange = (id: string, field: keyof Question, value: string | boolean | number) => {
    setEditingQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, [field]: value } : q)
    );
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      text: '',
      type: 'text',
      required: false
    };
    setEditingQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setEditingQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleTitleChange = (field: keyof TitleConfig, value: string) => {
    setEditingTitles(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveQuestions = () => {
    const validQuestions = editingQuestions.filter(q => q.text.trim() !== '');
    onQuestionsUpdate(validQuestions);
    toast({
      title: "Questions updated!",
      description: "The form questions have been successfully updated."
    });
  };

  const saveTitles = () => {
    // Validate that titles are not empty
    const hasEmptyTitles = Object.values(editingTitles).some(title => !title.trim());
    if (hasEmptyTitles) {
      toast({
        title: "Validation Error",
        description: "All titles must be filled out.",
        variant: "destructive"
      });
      return;
    }

    onTitlesUpdate(editingTitles);
    toast({
      title: "Titles updated!",
      description: "The form titles have been successfully updated."
    });
  };

  const saveAll = () => {
    const hasEmptyTitles = Object.values(editingTitles).some(title => !title.trim());
    if (hasEmptyTitles) {
      toast({
        title: "Validation Error",
        description: "All titles must be filled out.",
        variant: "destructive"
      });
      return;
    }

    const validQuestions = editingQuestions.filter(q => q.text.trim() !== '');
    onQuestionsUpdate(validQuestions);
    onTitlesUpdate(editingTitles);
    toast({
      title: "All changes saved!",
      description: "Questions and titles have been successfully updated."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2 mb-4 min-h-[44px] w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {titles.editorTitle}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              {titles.editorSubtitle}
            </p>
          </div>
        </div>

        <Card className="shadow-form border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              Form Editor
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="questions" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Questions
                </TabsTrigger>
                <TabsTrigger value="titles" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Titles
                </TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="space-y-6">
                {editingQuestions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                      <Button
                        onClick={() => removeQuestion(question.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive min-h-[44px] w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Textarea
                          value={question.text}
                          onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                          placeholder="Enter your question here..."
                          className="min-h-[80px] text-base"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <RadioGroup
                            value={question.type}
                            onValueChange={(value) => handleQuestionChange(question.id, 'type', value)}
                          >
                            <div className="flex items-center space-x-2 min-h-[44px]">
                              <RadioGroupItem value="text" id={`${question.id}-text`} className="h-5 w-5" />
                              <Label htmlFor={`${question.id}-text`} className="text-base cursor-pointer">Short Text</Label>
                            </div>
                            <div className="flex items-center space-x-2 min-h-[44px]">
                              <RadioGroupItem value="textarea" id={`${question.id}-textarea`} className="h-5 w-5" />
                              <Label htmlFor={`${question.id}-textarea`} className="text-base cursor-pointer">Long Text</Label>
                            </div>
                            <div className="flex items-center space-x-2 min-h-[44px]">
                              <RadioGroupItem value="radio" id={`${question.id}-radio`} className="h-5 w-5" />
                              <Label htmlFor={`${question.id}-radio`} className="text-base cursor-pointer">Yes/No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="flex items-center space-x-2 min-h-[44px]">
                          <input
                            type="checkbox"
                            id={`${question.id}-required`}
                            checked={question.required || false}
                            onChange={(e) => handleQuestionChange(question.id, 'required', e.target.checked)}
                            className="rounded border-input h-5 w-5"
                          />
                          <Label htmlFor={`${question.id}-required`} className="text-base cursor-pointer">Required field</Label>
                        </div>
                        
                        {question.type === 'textarea' && (
                          <div className="space-y-2">
                            <Label>Character Limit</Label>
                            <Input
                              type="number"
                              value={question.maxLength || 1500}
                              onChange={(e) => handleQuestionChange(question.id, 'maxLength', parseInt(e.target.value))}
                              min="100"
                              max="5000"
                              className="min-h-[44px] text-base"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <Button
                    onClick={addQuestion}
                    variant="outline"
                    className="flex items-center gap-2 min-h-[48px] text-base w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Question
                  </Button>
                  
                  <Button
                    onClick={saveQuestions}
                    className="flex items-center gap-2 bg-gradient-primary hover:opacity-90 transition-all min-h-[48px] text-base w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4" />
                    Save Questions
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="titles" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="formTitle">Form Title</Label>
                    <Input
                      id="formTitle"
                      value={editingTitles.formTitle}
                      onChange={(e) => handleTitleChange('formTitle', e.target.value)}
                      placeholder="Enter form title..."
                      className="min-h-[44px] text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="formSubtitle">Form Subtitle</Label>
                    <Input
                      id="formSubtitle"
                      value={editingTitles.formSubtitle}
                      onChange={(e) => handleTitleChange('formSubtitle', e.target.value)}
                      placeholder="Enter form subtitle..."
                      className="min-h-[44px] text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardTitle">Card Title</Label>
                    <Input
                      id="cardTitle"
                      value={editingTitles.cardTitle}
                      onChange={(e) => handleTitleChange('cardTitle', e.target.value)}
                      placeholder="Enter card title..."
                      className="min-h-[44px] text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="essayTitle">Essay Section Title</Label>
                    <Input
                      id="essayTitle"
                      value={editingTitles.essayTitle}
                      onChange={(e) => handleTitleChange('essayTitle', e.target.value)}
                      placeholder="Enter essay section title..."
                      className="min-h-[44px] text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editorTitle">Editor Title</Label>
                    <Input
                      id="editorTitle"
                      value={editingTitles.editorTitle}
                      onChange={(e) => handleTitleChange('editorTitle', e.target.value)}
                      placeholder="Enter editor title..."
                      className="min-h-[44px] text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editorSubtitle">Editor Subtitle</Label>
                    <Input
                      id="editorSubtitle"
                      value={editingTitles.editorSubtitle}
                      onChange={(e) => handleTitleChange('editorSubtitle', e.target.value)}
                      placeholder="Enter editor subtitle..."
                      className="min-h-[44px] text-base"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="essayQuestion">Essay Question</Label>
                  <Textarea
                    id="essayQuestion"
                    value={editingTitles.essayQuestion}
                    onChange={(e) => handleTitleChange('essayQuestion', e.target.value)}
                    placeholder="Enter the essay question..."
                    className="min-h-[80px] text-base"
                  />
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Character count: {Object.values(editingTitles).join('').length}
                  </div>
                  
                  <Button
                    onClick={saveTitles}
                    className="flex items-center gap-2 bg-gradient-primary hover:opacity-90 transition-all min-h-[48px] text-base w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4" />
                    Save Titles
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-6" />
            
            <div className="flex justify-center">
              <Button
                onClick={saveAll}
                size="lg"
                className="flex items-center gap-2 bg-gradient-primary hover:opacity-90 transition-all min-h-[48px] text-base px-8"
              >
                <Save className="h-4 w-4" />
                Save All Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionEditor;
