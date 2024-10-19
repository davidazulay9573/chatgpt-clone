import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../services/chat/chat.service';
import { Chat, Message } from '../../../model/interfaces';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  chatId: string | null = null;
  chat: Chat | null = null;

  constructor(private route: ActivatedRoute, private chatService: ChatService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.chatId = params.get('id');

      if (this.chatId) {
        this.chatService.getChat(this.chatId).subscribe((chat) => {
          if (chat) {
            this.chat = chat;
          }
        });
      }
    });
  }

  splitMessage(content: string): { text: string; isCodeBlock: boolean }[] {
    const codeBlockRegex = /```([\s\S]*?)```/g; 
    const parts = content.split(codeBlockRegex); 
    const parsedContent: { text: string; isCodeBlock: boolean }[] = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        parsedContent.push({ text: parts[i], isCodeBlock: false });
      } else {
        parsedContent.push({ text: parts[i], isCodeBlock: true });
      }
    }

    return parsedContent;
  }
}
