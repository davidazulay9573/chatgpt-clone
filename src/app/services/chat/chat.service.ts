import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat, Message } from '../../model/interfaces';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})

export class ChatService {
  private chats: Chat[] = [];
  private chatsSubject: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  private readonly storageKey = 'chats'; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadChats(); 
  }

  private loadChats(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedChats = localStorage.getItem(this.storageKey);
      if (savedChats) {
        this.chats = JSON.parse(savedChats);
        this.chatsSubject.next(this.chats);
      }
    }
  }

  getChats(): Observable<Chat[]> {
    return this.chatsSubject.asObservable();
  }

  getChat(id: string): Observable<Chat | undefined> {
    return new Observable<Chat | undefined>((observer) => {
      const chat = this.chats.find(convo => convo.id === id);
      observer.next(chat);
      observer.complete();
    });
  }

  addChat(chat: Chat): void {
    this.chats.push(chat);
    this.chatsSubject.next(this.chats);
    this.saveChats(); 
  }

  updateChat(updatedChat: Chat): void {
    const chatIndex = this.chats.findIndex(chat => chat.id === updatedChat.id);
    if (chatIndex !== -1) {
      this.chats[chatIndex] = updatedChat;
      this.chatsSubject.next(this.chats); 
      this.saveChats(); 
    }
  }

  addMessage(chatId: string, message: Message): void {
    const chat = this.chats.find(chat => chat.id === chatId);

    if (chat) {
      chat.messages.push(message);
      this.chatsSubject.next(this.chats);
      this.saveChats();
    }
  }

  /* ------------------------ */
  private saveChats(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.chats));
    }
  }
}
