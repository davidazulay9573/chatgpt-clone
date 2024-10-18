
export interface Chat {
  id: string;
  name: string;
  messages: Message[]
}

export interface Message { 
  sender: string; 
  content: string; 
}
