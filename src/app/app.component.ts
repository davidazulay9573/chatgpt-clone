import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ConversationsListComponent } from './components/layout/conversations-list/conversations-list.component';
import { MessageInputComponent } from './components/layout/message-input/message-input.component';
import { Conversation } from './model/Conversation';
import { ConversationService } from './services/conversation/conversation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConversationsListComponent, MessageInputComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent implements OnInit {
  conversations: Conversation[] = []; 

  constructor(private router: Router, private conversationService: ConversationService) {}

  ngOnInit() {
    this.conversationService.getConversations().subscribe(conversations => {
      this.conversations = conversations;
    });
  }

  onMessageSent(message: string) {
    const newConversationId = this.createNewConversation(message);
    this.router.navigate([`/conversations/${newConversationId}`]);
  }

  onConversationSelected(conversationId: string) {
    this.router.navigate([`/conversations/${conversationId}`]);
  }

  createNewConversation(message: string): number {
    const newConversation: Conversation = {
      id: Math.floor(Math.random() * 1000).toString(), 
      name : "ooo",
      messages: [message] 
    };

    this.conversationService.addConversation(newConversation); 
    return parseInt(newConversation.id);
  }
}
