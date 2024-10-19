import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChatHistoryComponent } from './components/layout/chathistory/chathistory.component';
import { MessageInputComponent } from './components/layout/message-input/message-input.component';
import { Chat } from './model/interfaces';
import { ChatService } from './services/chat/chat.service';
import { BotService } from './services/bot/bot.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatHistoryComponent, MessageInputComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  chats: Chat[] = [];
  isBotTyping: boolean = false;
  messageContent: string = '';
  typingIntervalId: any = null; 

  constructor(
    private router: Router, 
    private chatService: ChatService, 
    private botService: BotService
  ) {}

  ngOnInit() {
    this.chatService.getChats().subscribe(chats => {
      this.chats = chats;
    });
  }

  onChatSelected(chatId: string) {
    this.router.navigate([`/chat/${chatId}`]);
  }

  onMessageSent(message: string) {
    if (this.isBotTyping) {
      this.stopTypingEffect();
      return;
    }

    const currentChatId = this.getCurrentChatId(); 

    if (currentChatId) {
      this.chatService.getChat(currentChatId).subscribe(chat => {
        if (chat) {
          this.continueChat(currentChatId, message); 
        } else {
          this.onNewChat(message);
        }
      });
    } else {
      this.onNewChat(message);
    }
  }

  private getCurrentChatId(): string | null {
    const currentUrl = this.router.url;
    const match = currentUrl.match(/chat\/(\d+)/);
    return match ? match[1] : null;
  }

  private continueChat(chatId: string, message: string) {
    this.chatService.getChat(chatId).subscribe(chat => {
      if (chat) {
        this.chatService.addMessage(chat.id, { sender: 'user', content: message });
        this.isBotTyping = true;

          this.botService.sendMessage(chat).subscribe(response => {
            const botMessage = response.choices[0].message.content;
            this.displayTypingEffect(chat.id, botMessage); 
          });
      
      }
    });
  }

  private displayTypingEffect(chatId: string, botMessage: string) {
    const words = botMessage.split('');  
    let typedMessage = '';
    let index = 0;

    this.chatService.addMessage(chatId, { sender: 'bot', content: '' });
    
    this.typingIntervalId = setInterval(() => {
      if (index < words.length) {
        typedMessage += words[index];  
        this.updateChatMessage(chatId, typedMessage); 
        index++;
      } else {
        this.stopTypingEffect(); 
      }
    }, 50);  
  }

  private updateChatMessage(chatId: string, message: string) {
    this.chatService.getChat(chatId).subscribe(chat => {
      if (chat) {
        const botMessageIndex = chat.messages.length - 1;
        if (botMessageIndex !== -1) {
          chat.messages[botMessageIndex].content = message;  
          this.chatService.updateChat(chat); 
        }
      }
    });
  }

  private stopTypingEffect() {
    if (this.typingIntervalId) {
      clearInterval(this.typingIntervalId); 
      this.typingIntervalId = null; 
    }
    this.isBotTyping = false; 
  }

  private onNewChat(message: string): void {
    const newChat: Chat = {
      id: Date.now().toString(), 
      name: message,
      messages: []
    };

    this.chatService.addChat(newChat);
    this.continueChat(newChat.id, message); 
    this.router.navigate([`/chat/${newChat.id}`]);
  }
}
