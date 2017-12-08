import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/delay';

import {User, TEST_USERS} from './model';

@Injectable()
export class DataService {

	public get_users():Observable<User[]> {
		return of(TEST_USERS).delay(1500);
	};

	public save_user(user:User):Observable<boolean> {

		//This is just stupid, but I'd like to check the observables...
		if(user.id===2) {
			return of(false).delay(1000);
		}
		else {
			const old=TEST_USERS.find( val => {return val.id===user.id;});
			const newuser=Object.assign(old, user);
			return of(true).delay(1000);
		}
	}

};
