
import symbolSdk from 'symbol-sdk';

export class SymbolWebSocketClient{

	protected reconnectTimeout:number|undefined=undefined;
	protected autoreconnect=true;
	protected reconnectionDelay=2000;
	protected endpoint:string;
	protected ws:WebSocket|undefined;
	protected uid:string|undefined=undefined;
	protected subscription:string[]=[];
	public onmessage=(message:any)=>{}

	public constructor(
		origin:string,
	){
		this.endpoint=origin.replace(/^http/,'ws')+'/ws';
		this.connect();
	}

	connect(
	){
		const self=this;
		this.ws=new WebSocket(this.endpoint);
		this.ws.addEventListener(
			'message',
			(ev)=>{
				const parsed=JSON.parse(ev.data);
				if(parsed.uid!==undefined&&this.uid===undefined&&this.ws!==undefined){
					this.uid=parsed.uid;
					for(const address_as_string of this.subscription){
						const msg={
							uid:this.uid,
							subscribe:'unconfirmedAdded/'+address_as_string,
						};
						this.ws.send(JSON.stringify(msg));
					}
				}else if(parsed.topic!==undefined){
					self.onmessage(parsed);
				}
			},
		)
		this.ws.addEventListener(
			'close',
			(ev)=>{
				if(this.autoreconnect){
					self.uid=undefined;
					self.ws=undefined;
					this.reconnectTimeout=setTimeout(
						()=>{
							self.connect();
							self.reconnectTimeout=undefined;
						},
						self.reconnectionDelay,
					);
				}
			},
		)
	}

	subscribe(
		address:string|typeof symbolSdk.symbol.Address,
	){
		const address_as_string=address.toString();
		if(this.uid!==undefined&&this.ws!==undefined){
			const msg={
				uid:this.uid,
				subscribe:'unconfirmedAdded/'+address_as_string,
			};
			this.ws.send(JSON.stringify(msg));
		}
		this.subscription.push(address_as_string);
	}

	close(
	){
		this.autoreconnect=false;
		if(this.reconnectTimeout!==undefined){
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout=undefined;
		}
		if(this.ws!==undefined){
			this.ws.close();
		}
		this.uid=undefined;
		this.ws=undefined;
	}

};
