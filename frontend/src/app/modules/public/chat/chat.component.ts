/*import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService, ChatGetDTO, ChatCreateDTO } from '../../../services/chat.service';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { UserService, MyAppUserDTO } from '../../../services/user.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  isOpen = false;
  messageText = '';
  messages: { from: 'user' | 'bot', text: string }[] = [];
  isLoading = false;

  senderId!: number | null;
  receiverId!: number;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private authService: MyAuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.senderId = this.authService.getCurrentUserId();

    if (!this.senderId) {
      console.error('Nema prijavljenog korisnika!');
      return;
    }

    if (this.authService.isCustomer()) {
      // Ako je kupac, dohvati jednog farmaceuta
      this.userService.getPharmacists().subscribe({
        next: (pharmacists: MyAppUserDTO[]) => {
          if (pharmacists.length === 0) {
            console.error('Nema dostupnih farmaceuta.');
            return;
          }

          this.receiverId = pharmacists[0].id; // uzmi prvog iz liste
          this.loadMessages();
        },
        error: (err) => {
          console.error('Greška pri dohvatu farmaceuta:', err);
        }
      });
    } else if (this.authService.isPharmacist()) {
      // Ako je farmaceut, koristi npr. hardkodiran ID korisnika za test
      this.receiverId = this.getCustomerIdFromContext();
      this.loadMessages();
    } else {
      console.error('Korisnik nije ni kupac ni farmaceut.');
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  loadMessages(): void {
    if (!this.senderId || !this.receiverId) return;

    this.isLoading = true;
    this.chatService.getConversation(this.senderId, this.receiverId).subscribe({
      next: (chatMessages: ChatGetDTO[]) => {
        this.messages = chatMessages.map(m => ({
          from: m.isResponse ? 'bot' : 'user',
          text: m.message
        }));
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.messages = [];
        } else {
          console.error('Neuspjelo dohvaćanje poruka', err);
        }
      }
    });
  }

  sendMessage(): void {
    const text = this.messageText.trim();
    if (!text || !this.senderId || !this.receiverId) return;

    const newMessage: ChatCreateDTO = {
      senderId: this.senderId,
      receiverId: this.receiverId,
      message: text,
      typeOfMessage: 'question',
      status: 'sent',
      isResponse: false
    };

    this.messages.push({ from: 'user', text });
    this.messageText = '';
    this.scrollToBottom();

    this.chatService.sendMessage(newMessage).subscribe(() => {
      setTimeout(() => {
        this.messages.push({ from: 'bot', text: 'Hvala na poruci! Javit ćemo se uskoro.' });
        this.scrollToBottom();
      }, 1000);
    });
  }

  sendQuickReply(text: string): void {
    this.messageText = text;
    this.sendMessage();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  // Placeholder za testiranje - možeš zamijeniti kontekstom iz aplikacije
  getCustomerIdFromContext(): number {
    return 1; // npr. ID korisnika kojem farmaceut odgovara
  }
}
*/
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService, ChatGetDTO, ChatCreateDTO } from '../../../services/chat.service';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { UserService, MyAppUserDTO } from '../../../services/user.service';

@Component({
  selector: 'app-chat',
  standalone:false,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  isOpen = false;
  messageText = '';
  messages: { from: 'user' | 'bot', text: string }[] = [];
  isLoading = false;

  senderId!: number | null;
  receiverId!: number;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private authService: MyAuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.senderId = this.authService.getCurrentUserId();

    if (!this.senderId) {
      console.error('Nema prijavljenog korisnika!');
      return;
    }

    if (this.authService.isCustomer()) {
      this.userService.getPharmacists().subscribe({
        next: (pharmacists: MyAppUserDTO[]) => {
          if (pharmacists.length === 0) {
            console.error('Nema dostupnih farmaceuta.');
            return;
          }

          this.receiverId = pharmacists[0].id;
          this.loadMessages();
          this.startPolling();
        },
        error: (err) => console.error('Greška pri dohvatu farmaceuta:', err)
      });
    } else if (this.authService.isPharmacist()) {
      this.receiverId = this.getCustomerIdFromContext();
      this.loadMessages();
      this.startPolling();
    } else {
      console.error('Korisnik nije ni kupac ni farmaceut.');
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }


  loadMessages(): void {
    if (!this.senderId || !this.receiverId) return;

    this.isLoading = true;
    this.chatService.getConversation(this.senderId, this.receiverId).subscribe({
      next: (chatMessages: ChatGetDTO[]) => {
        this.messages = chatMessages.map(m => ({
          from: m.senderId === this.senderId ? 'user' : 'bot',
          text: m.message
        }));

        this.isLoading = false;
        if (this.isOpen) {
          setTimeout(() => this.scrollToBottom(), 0);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.messages = [];
        } else {
          console.error('Neuspjelo dohvaćanje poruka', err);
        }
      }
    });
  }


  sendMessage(): void {
    const text = this.messageText.trim();
    if (!text || !this.senderId || !this.receiverId) return;

    const newMessage: ChatCreateDTO = {
      senderId: this.senderId,
      receiverId: this.receiverId,
      message: text,
      typeOfMessage: 'question',
      status: 'sent',
      isResponse: false
    };

    this.messages.push({ from: 'user', text });
    this.messageText = '';
    setTimeout(() => this.scrollToBottom(), 0);

    this.chatService.sendMessage(newMessage).subscribe(() => {
      // Osvježi poruke sa servera umjesto da simuliraš odgovor
      this.loadMessages();
    });
  }

  sendQuickReply(text: string): void {
    this.messageText = text;
    this.sendMessage();
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Greška pri skrolanju:', err);
    }
  }


  startPolling(): void {
    setInterval(() => {
      this.loadMessages();
    }, 5000); // osvježavanje svakih 5 sekundi
  }

  getCustomerIdFromContext(): number {
    return 1; // zamijeni stvarnim ID-jem ako treba
  }
}

