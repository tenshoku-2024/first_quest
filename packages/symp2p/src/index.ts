
import {gossipsub} from '@chainsafe/libp2p-gossipsub';

import {
	multiaddr,
	Multiaddr,
} from '@multiformats/multiaddr';

import {
	createHelia,
	libp2pDefaults,
} from 'helia';

import {SymbolPubSub} from 'pubsub-symbol-mempool';

const heliaNodes=[
	'/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
	'/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
	'/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS',
	'/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN',
];

export class Symp2p{

	public helia:any;
	public symbolAddresses:string[]=[];
	public maxNumberOfMultiaddrsInAdvertisement:number=5;
	public symbolNodes:string[]=[];
	public symbolPubSub:any;
	public topics:string[]=[];
	public onmessagefromsymbol=(_:any)=>{};

	constructor(
		secret:string,
	){
		const self=this;
		this.symbolPubSub=new SymbolPubSub(secret);
		this.symbolPubSub.onmessage=async (message:Uint8Array)=>{
			try{
				const parsed=JSON
					.parse(
						new TextDecoder()
							.decode(message),
					);
				await Promise.race(
					parsed
						.map(
							async (e:string)=>{
								await self
									.helia
									.libp2p
									.dial(multiaddr(e));
							},
					),
				);
			}catch(e){
			}
			self.onmessagefromsymbol(message);
		};
	}

	async start(
		symbolNodes:string[],
	):Promise<void>{
		const self=this;
		const libp2pOptions=libp2pDefaults();
		(libp2pOptions.services as any).pubsub=gossipsub();
		this.helia=await createHelia(
			{
				libp2p:libp2pOptions,
			},
		);
		heliaNodes.forEach((x)=>{this.helia.libp2p.dial(multiaddr(x))});
		this.symbolNodes=this.symbolNodes.concat(symbolNodes);
		await Promise.allSettled([
			this.symbolPubSub.start(this.symbolNodes),
		]);
		this.helia.libp2p.addEventListener(
			'connection:open',
			(_:any)=>{
				self
					.topics
					.forEach(
						(topic:string)=>{
							self
								.helia
								.libp2p
								.services
								.pubsub
								.subscribe(topic);
						}
					);
			}
		)
	}

	subscribe(
		address:string,
	){
		this.symbolAddresses.push(address);
		this.symbolPubSub.subscribe(address);
	}

	async advertise(
	):Promise<void>{
		const addresses=this
			.helia
			.libp2p
			.getMultiaddrs()
			.filter((e:Multiaddr)=>e.protos().filter((f:any)=>f.name==='p2p-circuit').length>0)
			.filter((e:Multiaddr)=>e.protos().filter((f:any)=>f.name==='dns4'||f.name==='dns6').length>0)
			.map((e:Multiaddr)=>e.toString())
			.splice(0,this.maxNumberOfMultiaddrsInAdvertisement);
		const advertisement=JSON.stringify(addresses);
		await Promise.all(
			this.symbolAddresses.map(
				(address:string)=>this
					.symbolPubSub
					.publish(
						address,
						new TextEncoder()
							.encode(advertisement),
					),
			),
		);
	}
}
