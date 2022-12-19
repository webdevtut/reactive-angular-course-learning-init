import {Component, OnInit} from '@angular/core';
import { LoadingService } from './loading.service';
import { MessagesService } from './messages/messages.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[
    LoadingService, // added here to be available in this component and it's child
    MessagesService
  ]
})
export class AppComponent implements  OnInit {

    constructor() {

    }

    ngOnInit() {


    }

  logout() {

  }

}
