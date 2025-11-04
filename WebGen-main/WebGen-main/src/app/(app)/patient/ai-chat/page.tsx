
import { AiChatbot } from '@/components/patient/ai-chatbot';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AiChatPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'ai-chat-background');
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Bot className="h-8 w-8 text-primary"/>
        <h1 className="text-3xl font-bold font-headline">AI Medical Advisor</h1>
      </div>
      <p className="text-muted-foreground">
        Have a health question? Describe your symptoms to get advice from our AI assistant.
        This tool is for informational purposes only and is not a substitute for professional medical advice.
      </p>
      <Card className="h-[65vh] overflow-hidden relative">
        {bgImage && (
            <Image 
                src={bgImage.imageUrl}
                alt={bgImage.description}
                fill
                className="object-cover opacity-10"
                data-ai-hint={bgImage.imageHint}
            />
        )}
        <CardContent className="p-0 h-full relative z-10 bg-transparent">
            <AiChatbot />
        </CardContent>
      </Card>
    </div>
  );
}
