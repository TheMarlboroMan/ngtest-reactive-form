import {Component, Input, OnChanges} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

import {DataService} from './data.service';
import {User, Dish, user_types, dish_types} from './model';

@Component({
	selector: 'user-detail',
	templateUrl: 'user-detail.component.html'
})
export class UserDetailComponent {

	@Input() user:User=null;
	public userform:FormGroup;
	public name_changelog:string=null; //Just part of a worthless observable exercise. It was originally an array where values were pushed.
	public user_types=user_types;
	public dish_types=dish_types;
	public dish_model_changed:boolean=false; //We'll use this flag to detect changes in the dishes array (deletions and additions) not caught by Angular. 

	public constructor(
		private formbuilder:FormBuilder,
		private dataservice:DataService){

		//Init the form... this could go into another method, but well...
		this.userform=this.formbuilder.group(
			{
				user: this.formbuilder.group({
					id: [''],
					name: ['', [Validators.required, Validators.minLength(3)]],
					email: ['', [Validators.required, Validators.email]],
					aboutme: [''],
					type:[user_types[0], Validators.required]
				}),
				
				//This is just an empty array, for now. Later, shit is added.
				uploaded_dishes: this.formbuilder.array([])
			}
		);

		//Start logger... Completely worthless except for the observable exercise.
		this.start_name_logger();
	}

	//This demonstrates an Observable (valueChanges), and how this forEach
	//is binded to it. From a regular code perspective this should only happen
	//once, but given that this shit is Observable, it will trigger the lambda
	//each time something is registered at valueChanges.
	//Notice how the valueChanges is linked to the form Model, not to the model
	//object itself...
	public start_name_logger() {
		this.userform.get('user.name').valueChanges.forEach(
			(nv:string) => {this.name_changelog=nv;});
	}

	//This is one tricky motherfucker... See, whenever the input property changes
	//we execute this, so we can reload the form values.
	public ngOnChanges() {

		//Because the user model has "dishes" instead of "uploaded_dishes", we can't just do "user: this.user"...
		let formvalues={
			user: {
				name: this.user.name,
				email: this.user.email,
				aboutme: this.user.aboutme,
				type: this.user. type
			},
			uploaded_dishes: this.user.dishes[0] || new Dish()
		};

		this.userform.reset(formvalues); //This does reset and set values.
		this.set_dishes(this.user.dishes); //This will fill the uploaded_dishes array.
		this.dish_model_changed=false;
	}

	//We create a group for each dish, set the validators for each
	//of them and finally put them into an array where we replace
	//the ones that there are. When setting the validators we
	//refer to the dish model, since it's basically the same crap.
	public set_dishes(dishes:Dish[]) {
		let dish_formgroup = dishes.map(dish => this.formbuilder.group(dish));
		dish_formgroup.forEach(this.set_dish_validators);
		this.userform.setControl('uploaded_dishes', this.formbuilder.array(dish_formgroup));
	}

	private set_dish_validators(fg:FormGroup){
		fg.get('name').setValidators(Validators.required);
		fg.get('description').setValidators(Validators.required);
		fg.get('type').setValidators(Validators.required);
	}

	//This is a shortcut for the template... It might as well go userform.get('uploaded_dishes').
	public get_dishes_formarray():FormArray {
		return this.userform.get('uploaded_dishes') as FormArray;
	}

	//Creates a new dish in the formarray from an Empty dish. Notice how it adds validators.
	public create_dish_formarray():void {
		let fg=this.formbuilder.group(new Dish());
		this.set_dish_validators(fg);
		this.get_dishes_formarray().push(fg);
		this.dish_model_changed=true;
	}

	//Does some checking before performing the actual deletion. Fun thing, this
	//should only delete from the form model, never from a server side piece
	//so in order for this to work in a non-nosql context, we would grab the 
	//deleted id to send it along after we confirm the changes.
	public delete_dish_formarray(dish_data:FormGroup){
		//This would be for server side shit... Of course, we should SAVE changes...
//		console.log("The id was... "+dish_data.controls['id'].value);
		let index=this.get_dishes_formarray().controls.indexOf(dish_data);
		if(index==-1) return;
		this.get_dishes_formarray().removeAt(index);
		this.dish_model_changed=true;
	}

	//Reset the values of the form from the data on "user".
	public discard_changes() {
		this.ngOnChanges();
	}

	//This is bound to the ngSubmit property of the template form.
	public form_submit() {
		//Update user model...	
		let readyuser:User=this.prepare_saved_user();

		//It subscribes to an observable, which is different from the promises I am used to.
		this.dataservice.save_user(readyuser).subscribe(
			(result:boolean) => {
				if(!result) {
					alert("Something failed when saving");
				}
				else {
					this.user=readyuser;
				}
				this.ngOnChanges();
			});
	}

	//Mash form model data and user data.
	private prepare_saved_user():User {

		//This is the data of the user as it appears in the form...
		const form_model=this.userform.value;

		//Make a deep copy of the dishes as they appear in the form...
		const dishes_deep_copy:Dish[]=form_model.uploaded_dishes.map(
			(dish:Dish) => {return Object.assign({}, dish);});

		let result:User={
			id:	this.user.id,
			name: 	form_model.user.name as string,
			email: 	form_model.user.email as string,
			aboutme:form_model.user.aboutme as string,
			type: 	form_model.user.type as string,
			dishes: dishes_deep_copy
		};

		return result;
	}
}
