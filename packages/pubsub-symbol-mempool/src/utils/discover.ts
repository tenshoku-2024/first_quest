
import {nodeIsAvailable} from './nodeIsAvailable';

export async function discover(
	node:string,
):Promise<string[]>{
	const response=await fetch(
		node+'/node/peers',
	);
	const parsed=JSON.parse(await response.text());
	const candidates=parsed
		.map((x:any)=>x.host)
		.map((x:string)=>'https://'+x+':3001');
	const passed:any=await Promise.allSettled(candidates.map((x:any)=>nodeIsAvailable(x)));
	return candidates
		.filter((_:any,i:number)=>passed[i].status==='fulfilled'&&passed[i]!.value);
};
