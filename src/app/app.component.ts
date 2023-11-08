import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'
import { MyResponse } from './interfaces';

interface ResponseObject {
  [key: string]: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('chatMessages') chatMessages: ElementRef;


  title = 'PetGPT';
  isLoading = false;
  messages: any = ["Hello! What type of animal is your pet?"];
  result = '';
  userInput: string = '';
  initialMessage: boolean = true;
  searchTerm: string = '';
  searchResult: string = '';
  bulletPoints: string[] = [];
  showIncorrectInformationButton: boolean = false;
  showAskQuestionButton: boolean = false;

  constructor(private http: HttpClient) {
    this.chatMessages = new ElementRef(null);
  }

  ngOnInit() { 
        this.scrollToBottom();
    }

    ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    scrollToBottom(): void {
        try {
            this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
        } catch(err) { }                 
    }

  isStringArray(message: any): boolean {
    return Array.isArray(message);
  }

  getBasicCareInformation = async () => {
    const url = `${environment.apiUrl}/api/send-data`
    this.isLoading = true;
    this.messages.push("Typing...");
    const prompt = `Provide the ideal care conditions for a ${this.userInput}. Answer directly with only key value pairs for this message; do not use extra symbols. Use US standards for all units. Include the "Latin name" among the key value pairs.`

    await this.http.post<MyResponse>(url, { data: prompt, userMessage: this.userInput })
      .subscribe((response) => {
        this.isLoading = false;
        this.bulletPoints = response.message.content.split(/\n/g).filter(x => x.length > 0);
        // console.log(this.bulletPoints);
        this.messages.pop();
        this.messages.push(this.bulletPoints)
        this.scrollToBottom();
      });
  }

  sendMessage = () => {
    this.messages.push(this.userInput);
    this.scrollToBottom();
    this.sendDataToBackend();
    this.userInput = '';
  }

  sendDataToBackend = async () => {
    console.log("sending data to backend...");
    const url = `${environment.apiUrl}/api/send-data`
    this.isLoading = true;
    this.messages.push("Typing...");
    await this.http.post<MyResponse>(url, { data: this.userInput })
      .subscribe((response) => {
        this.isLoading = false;
        this.messages.pop();
        this.messages.push(response.message.content);
        this.scrollToBottom();
      });
  }

}
