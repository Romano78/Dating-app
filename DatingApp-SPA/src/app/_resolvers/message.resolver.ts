import {Injectable} from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Message } from '../_models/Message';
import { AuthService } from '../_services/auth.service';

@Injectable()

export class MessageResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';


    constructor(private userService: UserService, private router: Router,
                private alertifyService: AlertifyService, private authService: AuthService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        // tslint:disable-next-line: no-string-literal
        return this.userService.getMessages(this.authService.decodedToken.nameid,
            this.pageNumber, this.pageSize, this.messageContainer).pipe(
            catchError(error => {
                this.alertifyService.error('Problem retrieving messages');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}

