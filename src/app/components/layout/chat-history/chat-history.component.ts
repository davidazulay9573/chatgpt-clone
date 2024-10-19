import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface chat {
  id: string;
  name: string;
}

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-history.component.html',
})

export class ChatHistoryComponent {
  @Input() chats: chat[] = []; 
  @Output() chatSelected = new EventEmitter<string>();

  selectchat(id: string) {
    this.chatSelected.emit(id);
  }
}
