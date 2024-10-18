import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../services/chat/chat.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
})
export class chatComponent implements OnInit {
  chatId: string | null = null;
  messages: { sender: string, content: string }[] = [];

  constructor(private route: ActivatedRoute, private chatService: ChatService) {}

  ngOnInit() {
    // Subscribe to the route parameters to get the chat ID
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id');
      
      // Fetch the chat details using the chat service
      if (this.chatId) {
        this.chatService.getChat(this.chatId).subscribe(chat => {
          if (chat) {
            this.messages = chat.messages; // Assuming `messages` is an array in your chat model
          }
        });
      }
    });
  }
}
