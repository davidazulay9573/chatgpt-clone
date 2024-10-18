import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation.component.html',
  styleUrl : './conversation.component.css'
})
export class ConversationComponent {
  conversationId: string | null = null;
  messages: { sender: string, content: string }[] = [];

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.conversationId = params.get('id');
      this.loadConversation(this.conversationId); 
    });
  }

  private loadConversation(conversationId: string | null) {
    if (conversationId) {
      this.messages = [
        { sender: 'User', content: 'Hello, how are you?' },
        { sender: 'Bot', content: 'I am a bot, how can I assist you today?' },
        { sender: 'User', content: 'Tell me a joke.' },
        { sender: 'Bot', content: 'Why did the scarecrow win an award? Because he was outstanding in his field!' }
      ];
    }
  }
}
