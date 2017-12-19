import { Injectable } from '@angular/core';
import { Message } from '../message.model';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MessagesService {
  lastId= 0;

  private postsUrl = 'https://nameless-peak-71330.herokuapp.com/posts';

  httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  messages: Message[] = [];
  messageSource= new BehaviorSubject<Message>(new Message({userName: 'Admin', body: 'Welcome to NyanChat'}));
  currentMessage= this.messageSource.asObservable();


  constructor(private http: HttpClient ) {
  }

  postMessage(message: Message): MessagesService {
    if (!message.postId) {
      message.postId = ++this.lastId;
    }
    this.messages.push(message);
    console.log('msg srv: ' + message.content);
    let mess;
    //this.getPosts.subscribe(message1 => console.log(mess = message1));

    this.messageSource.next(message);

    this.http.post<string>(this.postsUrl, message, this.httpOptions);

    return this;
  }

  getAllMessages() {
    //this.messages = this.http.get<Message[]>(this.postsUrl, this.httpOptions);
    return this.messages;
  }

  getMessagesById(id: number): Message {
    return this.messages.filter(message => message.postId === id).pop();
  }

  getMessagesByUserName(userName: string): Message {
    return this.messages.filter(message => message.userName === userName).pop();
  }

  deleteMessageById(id: number): MessagesService {
    this.messages = this.messages.filter(message => message.postId !== id);
    return this;
  }

  updateMessageById(id: number, values: Object = {}): Message {
    const message = this.getMessagesById(id);
    if (!message) {
      return null;
    }
    Object.assign(message, values);
    return message;
  }
}