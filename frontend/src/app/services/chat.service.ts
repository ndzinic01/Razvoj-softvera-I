import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTO za prikaz poruka (ChatGetDTO)
export interface ChatGetDTO {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  message: string;
  date: Date;
  typeOfMessage: string;
  status: string;
  isResponse: boolean;
}

// DTO za slanje poruka (ChatCreateDTO)
export interface ChatCreateDTO {
  senderId: number;
  receiverId: number;
  message: string;
  typeOfMessage: string;
  status: string;
  isResponse: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseApiUrl = 'https://localhost:7057/api';   // ← tvoj backend

  constructor(private http: HttpClient) {}

  /* 1. dohvati poruke */
  getConversation(senderId: number, receiverId: number): Observable<ChatGetDTO[]> {
    return this.http.get<ChatGetDTO[]>(
      `${this.baseApiUrl}/GetChatEndpoint/conversation?senderId=${senderId}&receiverId=${receiverId}`
    );
  }


  /* 2. pošalji (nova) poruka ili odgovor – jedna metoda je dosta */
  sendMessage(dto: ChatCreateDTO) {
    return this.http.post(`${this.baseApiUrl}/Chat`, dto);
  }
}

