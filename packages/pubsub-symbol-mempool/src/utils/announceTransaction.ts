
export async function announceTransaction(
	origin:string,
	json:any,
):Promise<void>{
	await Promise.race([
		await fetch(
			origin+'/transactions',
			{
				method:'PUT',
				headers:{
					'Content-Type':'application/json',
				},
				body:json,
			},
		),
		new Promise((_,reject)=>{
			setTimeout(()=>{
				reject();
			},1000);
		}),
	])
};
