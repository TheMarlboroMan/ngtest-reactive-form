export class User {
	public id:number=0;
	public name:string="";
	public aboutme:string="";
	public email:string="";
	public type:string="";
	public dishes:Dish[];
}

export class Dish {
	public id:number=0;
	public name:string="";
	public description:string="";
	public type:string="";
}

export const user_types=['Novice', 'Intermediate', 'Expert', 'Master'];
export const dish_types=['Entree', 'Main', 'Side', 'Dessert'];

export const TEST_USERS:User[]=[
	{id:1,
	name:"The user",
	email:"theuser@mailserver.net",
	aboutme:"I am just an user",
	type:user_types[0],
	dishes:[
		{id:1,
		name:"Patatas fritas",
		description:"A modern classic",
		type:dish_types[0]},
		{id:2,
		name:"Pizza",
		description:"Something just for the hungry",
		type:dish_types[1]}
	]},
	{id:2,
	name:"You can't save this user",
	email:"hardcodedtofail@mailserver.net",
	aboutme:"This thing fails on saving",
	type:user_types[0],
	dishes:[
		{id:3,
		name:"Lentejas",
		description:"Something not everybody can eat",
		type:dish_types[1]},
		{id:4,
		name:"Lomo a la sal",
		description:"Delicious, tasty and satisfying",
		type:dish_types[1]}
	]},
	{id:3,
	name:"Watcher",
	email:"watcher@mailserver.net",
	aboutme:"I just watch, I don't to any dishes",
	type:user_types[0],
	dishes: []}
];
