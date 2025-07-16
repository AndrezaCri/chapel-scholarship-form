import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MapPin, Phone, HelpCircle, FileText, Download, Send } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  isMember: string;
  membershipDuration: string;
  planToAttendCollege: string;
  collegeLocation: string;
  essayResponse: string;
}

const ScholarshipForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    isMember: '',
    membershipDuration: '',
    planToAttendCollege: '',
    collegeLocation: '',
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

  const validateForm = () => {
    const errors = [];
    
    if (!formData.fullName.trim()) errors.push('Nome completo é obrigatório');
    if (!formData.email.trim()) errors.push('E-mail é obrigatório');
    if (!formData.email.includes('@')) errors.push('E-mail deve ser válido');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Erro de validação",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Sua inscrição foi enviada para dljackson1277@gmail.com"
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const exportToCSV = () => {
    const headers = [
      'Nome Completo', 'E-mail', 'Endereço', 'Telefone',
      'Membro da Igreja', 'Tempo de Membros', 'Planos de Faculdade',
      'Local da Faculdade', 'Resposta do Essay'
    ];
    
    const values = [
      formData.fullName, formData.email, formData.address, formData.phone,
      formData.isMember, formData.membershipDuration, formData.planToAttendCollege,
      formData.collegeLocation, formData.essayResponse
    ];
    
    const csvContent = `${headers.join(',')}\n${values.map(v => `"${v}"`).join(',')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scholarship-application.csv';
    a.click();
    
    toast({
      title: "Exportado com sucesso!",
      description: "Arquivo CSV baixado"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Formulário de Inscrição
          </h1>
          <p className="text-xl text-muted-foreground">
            Bolsa de Estudos | Spring Chapel MBC
          </p>
        </div>

        <Card className="shadow-form border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Inscrição para Bolsa de Estudos
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Informações Pessoais */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Informações Pessoais</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Nome completo *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="transition-all duration-200 focus:shadow-elegant"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      E-mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="transition-all duration-200 focus:shadow-elegant"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Endereço completo
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="transition-all duration-200 focus:shadow-elegant"
                    placeholder="Rua, número, cidade, estado, CEP"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Telefone (com DDD)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="transition-all duration-200 focus:shadow-elegant"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* Perguntas Abertas */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Perguntas Abertas</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Are you a member of Spring Chapel MBC?
                    </Label>
                    <RadioGroup
                      value={formData.isMember}
                      onValueChange={(value) => handleInputChange('isMember', value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="member-yes" />
                        <Label htmlFor="member-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="member-no" />
                        <Label htmlFor="member-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="membershipDuration" className="text-sm font-medium">
                      If so, how long have you been a member?
                    </Label>
                    <Input
                      id="membershipDuration"
                      type="text"
                      value={formData.membershipDuration}
                      onChange={(e) => handleInputChange('membershipDuration', e.target.value)}
                      className="transition-all duration-200 focus:shadow-elegant"
                      placeholder="ex: 2 years, since 2020..."
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Do you plan to attend college in the Fall?
                    </Label>
                    <RadioGroup
                      value={formData.planToAttendCollege}
                      onValueChange={(value) => handleInputChange('planToAttendCollege', value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="college-yes" />
                        <Label htmlFor="college-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="college-no" />
                        <Label htmlFor="college-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="collegeLocation" className="text-sm font-medium">
                      If so, where?
                    </Label>
                    <Input
                      id="collegeLocation"
                      type="text"
                      value={formData.collegeLocation}
                      onChange={(e) => handleInputChange('collegeLocation', e.target.value)}
                      className="transition-all duration-200 focus:shadow-elegant"
                      placeholder="Nome da universidade/faculdade"
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="Descreva como uma bolsa de estudos beneficiaria seus objetivos educacionais..."
                    maxLength={1500}
                  />
                  <div className="text-right text-sm text-muted-foreground">
                    {charCount}/1500 caracteres | {Math.floor(charCount / 6)}/250 palavras (aprox.)
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
                  Exportar CSV
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-primary hover:opacity-90 transition-all"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Inscrição'}
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