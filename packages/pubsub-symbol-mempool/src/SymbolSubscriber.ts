
import {SymbolWebSocketClient} from './SymbolWebSocketClient';
import {
	discover,
	hexToUint8Array,
} from './utils';
import symbolSdk from 'symbol-sdk';

export class SymbolSubscriber{

	public nodes:string[]=[];
	private ws:SymbolWebSocketClient[]=[];
	public onmessage=(_:any)=>{};
	private messages:string[]=[];

	public constructor(
	){
	}

	private onmessageInternal(
		msg:any,
	){
		const hash=msg.data.meta.hash;
		if(this.messages.indexOf(hash)<0){
			this.messages.push(hash);
			this.messages=this.messages.splice(-5);
			if(msg.data.transaction.message!==undefined){
				this.onmessage(hexToUint8Array(msg.data.transaction.message));
			}
		}
	}

	async start(
		nodes:string[],
	){
		const result=await Promise.all(nodes.map((node:string)=>discover(node)));
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
