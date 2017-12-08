import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

import {DataService} from './data.service';
import {TEST_USERS, User} from './model';

@Component({
	selector : 'user-list',
	templateUrl: 'user-list.component.html'
})
export class UserListComponent{

	public user_list$:Observable<User[]>;
	public loading=false;
	public selected_user:User=undefined;

	constructor(private ds:DataService) {
		this.load_users();
	}

	public edit_user(user:User){
		this.selected_user=user;
	}

	public load_users() {
		this.loading=true;
		this.user_list$=this.ds.get_users()
			.finally(() => {this.loading=false;});
		this.selected_user=undefined;
	}
};
