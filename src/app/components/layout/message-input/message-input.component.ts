import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
})

export class MessageInputComponent {
  messageContent: string = '';
  @Input() isBotTyping: boolean = false; 

  @Output() messageSent = new EventEmitter<string>(); 

  sendMessage() {
    if (this.messageContent.trim() || this.isBotTyping) {
      this.messageSent.emit(this.messageContent);  
      this.messageContent = '';
    }
  }
}
