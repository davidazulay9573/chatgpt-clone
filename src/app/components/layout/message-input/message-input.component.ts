import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports : [FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})

export class MessageInputComponent {
  messageContent: string = '';

  @Output() messageSent = new EventEmitter<string>(); 

  sendMessage() {
    if (this.messageContent.trim()) {
      this.messageSent.emit(this.messageContent);  
      this.messageContent = '';
    }
  }
}
