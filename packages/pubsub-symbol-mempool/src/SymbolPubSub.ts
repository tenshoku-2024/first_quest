
import {SymbolPublisher} from './SymbolPublisher';
import {SymbolSubscriber} from './SymbolSubscriber';

export class SymbolPubSub{

	public publisher:SymbolPublisher;
	public subscriber:SymbolSubscriber;
	public onmessage=(_1:any,_2:any)=>{};

	constructor(
		secret:string,
	){
		const self=this;
		this.publisher=new SymbolPublisher(secret);
		this.subscriber=new SymbolSubscriber();
		this.subscriber.onmessage=(message:any,raw:any)=>{
			self.onmessage(message,raw);
		}
	}

	async start(
		nodes:string[],
	):Promise<void>{
		await this.subscriber.start(nodes);
		this.publisher.nodes=this.subscriber.nodes;
	}

	async publish(
		address:string,
		message:Uint8Array,
	):Promise<void>{
		await this.publisher.publish(address,message);
	}

	subscribe(
		address:string,
	){
		this.subscriber.subscribe(address);
	}
}
