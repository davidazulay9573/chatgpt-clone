import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Conversation {
  id: string;
  name: string;
}

@Component({
  selector: 'app-conversations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css'] 
})

export class ConversationsListComponent {
  @Input() conversations: Conversation[] = []; 
  @Output() conversationSelected = new EventEmitter<string>();

  selectConversation(id: string) {
    this.conversationSelected.emit(id);
  }
}
