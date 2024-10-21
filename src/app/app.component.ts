import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ChatHistoryComponent } from './components/layout/chat-history/chat-history.component';
import { MessageInputComponent } from './components/layout/message-input/message-input.component';
import { NgClass } from '@angular/common';
import { Chat } from './model/interfaces';
import { ChatService } from './services/chat/chat.service';
import { BotService } from './services/bot/bot.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ChatHistoryComponent, MessageInputComponent, NgClass],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  chats: Chat[] = [];
  messageContent: string = '';
  showSidebar: boolean = false;

  constructor(
    private router: Router, 
    private chatService: ChatService, 
    private botService: BotService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    this.chatService.getChats().subscribe(chats => {
      this.chats = chats;
    });

    if (isPlatformBrowser(this.platformId)) { 
      this.router.events.subscribe(() => {
        if (window?.innerWidth < 768) {
          this.showSidebar = false;
        }
      });
    }
  }

  onToggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  onChatSelected(chatId: string) {
    this.router.navigate([`/chat/${chatId}`]);
    if (isPlatformBrowser(this.platformId) && window.innerWidth < 768) {
      this.showSidebar = false;
    }
  }

  onSubmit(message: string) {
    const currentChatId = this.getCurrentChatId(); 

    if (currentChatId) {
      this.chatService.getChat(currentChatId).subscribe(chat => {
        if (chat) {
          this.onExistingChat(chat.id, message);
        } else {
          this.onNewChat(message);
        }
      });
    } else {
      this.onNewChat(message);
    }
  }

  /* ------------------------- */
  
  private onExistingChat(chatId : string, message : string) : void{
    this.botComunication(chatId, message); 
  }

  private onNewChat(message: string): void {
    const newChat: Chat = {
      id: Date.now().toString(), 
      name: message,
      messages: []
    };

    this.chatService.addChat(newChat);
    this.botComunication(newChat.id, message); 
    this.router.navigate([`/chat/${newChat.id}`]);
  }

  private botComunication(chatId: string, message: string) {
    this.chatService.getChat(chatId).subscribe(chat => {
      if (chat) {
        this.chatService.addMessage(chat.id, { sender: 'user', content: message });
        
        this.botService.sendMessage(chat).subscribe(response => {
          const botMessage = response.choices[0].message.content;
          this.chatService.addMessage(chat.id, { sender: 'bot', content: botMessage });
        });  
      }
    })
  }

  private getCurrentChatId(): string | null {
    const currentUrl = this.router.url;
    const match = currentUrl.match(/chat\/(\d+)/);
    return match ? match[1] : null;
  }
}
