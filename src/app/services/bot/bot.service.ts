import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../../model/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions'; 
  private apiKey = "" ;

  constructor(private http: HttpClient) { }

  sendMessage(conversation: Chat): Observable<any> {
    const messages = conversation.messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const body = {
      model: 'gpt-3.5-turbo',
      messages: messages,
    };

    return this.http.post(this.apiUrl, body, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
