import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Conversation } from '../../model/Conversation';


@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private conversations: Conversation[] = [];
  private conversationsSubject: BehaviorSubject<Conversation[]> = new BehaviorSubject<Conversation[]>([]); 

  constructor() {
    this.conversations = [
      { id: "1", name : "Eli", messages: [] },
      { id: "2", name : "Bob", messages: [] },
    ];
    this.conversationsSubject.next(this.conversations);
  }

  getConversations(): Observable<Conversation[]> {
    return this.conversationsSubject.asObservable();
  }

  addConversation(conversation: Conversation): void {
    this.conversations.push(conversation);
    this.conversationsSubject.next(this.conversations);
  }
}
