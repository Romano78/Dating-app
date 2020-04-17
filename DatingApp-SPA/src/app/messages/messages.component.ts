import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Message } from '../_models/Message';
import { Pagination, PaginatedResult } from '../_models/pagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private userService: UserService, private authService: AuthService,
              private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
    console.log(this.messages);
    console.log('hello');
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  loadMessages() {
    this.userService
    .getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
    .subscribe((res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;
    }, error => {
        this.alertify.error(error);
    });

  }

  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete this message this cannot be undone', () => {
      this.userService.deleteUserMessage(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('Message succesfuly deleted');
      }, error => {
        this.alertify.error(error);
      });
    });
  }
}
