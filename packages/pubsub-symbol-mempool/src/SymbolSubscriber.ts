
import {SymbolWebSocketClient} from './SymbolWebSocketClient';

import symbolSdk from 'symbol-sdk';

export class SymbolSubscriber{

	private nodes:string[]=[];
	private ws:SymbolWebSocketClient[]=[];
	public onmessage=(_:any)=>{};
	private messages:string[]=[];

	public constructor(
	){
	}

	static async node_is_available(
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
	}

	static async discover(
		node:string,
	):Promise<string[]>{
		const response=await fetch(
			node+'/node/peers',
		);
		const parsed=JSON.parse(await response.text());
		const candidates=parsed
			.map((x:any)=>x.host)
			.map((x:string)=>'https://'+x+':3001');
		const passed:any=await Promise.allSettled(candidates.map((x:any)=>SymbolSubscriber.node_is_available(x)));
		return candidates
			.filter((_:any,i:number)=>passed[i].status==='fulfilled'&&passed[i]!.value);
	}

	static hexToUint8Array(
		hex:string,
	):Uint8Array{
		return Uint8Array.from((hex.match(/../g)??[]).map((x:string)=>'0x'+x).map((x:string)=>Number.parseInt(x)));
	}

	private onmessageInternal(
		msg:any,
	){
		const hash=msg.data.meta.hash;
		if(this.messages.indexOf(hash)<0){
			this.messages.push(hash);
			this.messages=this.messages.splice(-5);
			if(msg.data.transaction.message!==undefined){
				this.onmessage(SymbolSubscriber.hexToUint8Array(msg.data.transaction.message));
			}
		}
	}

	async start(
		nodes:string[],
	){
		const result=await Promise.all(nodes.map((node:string)=>SymbolSubscriber.discover(node)));
		for(const res of result){
			const tmp=this.nodes.concat(res);
			// deduplicate array elements
			this.nodes=tmp.filter((e,i,self)=>self.indexOf(e)===i);
		}
		this.ws=this.nodes.map((origin:string)=>new SymbolWebSocketClient(origin));
		const self=this;
		this.ws.forEach((ws:SymbolWebSocketClient)=>{ws.onmessage=(msg:any)=>{self.onmessageInternal(msg)}});
	}

	async subscribe(
		address:string|typeof symbolSdk.symbol.Address,
	){
		this.ws.forEach((ws:SymbolWebSocketClient)=>{ws.subscribe(address.toString());});
	}
};
