
export async function nodeIsAvailable(
	origin:string,
):Promise<boolean>{
	try{
		const response:any=await Promise.race([
			fetch(
				origin+'/node/health',
			),
			new Promise((_,reject)=>{
				setTimeout(()=>{
					reject(Error('timed out'));
				},2000);
			}),
		]);
		const parsed=JSON.parse(await response.text());
		return parsed.status.apiNode==='up'&&parsed.status.db==='up';
	}catch{
	}
	return false;
};
