
import symbolSdk from 'symbol-sdk';

import {
	announceTransaction,
	discover,
} from './utils';

export class SymbolPublisher{

	public duration=2000;
	private secret_key;
	private key_pair;
	private facade;
	private network:string='testnet';
	public nodes:string[]=[];

	public constructor(
		secret:string,
	){
		this.facade=new symbolSdk.facade.SymbolFacade(this.network);
		this.secret_key=new symbolSdk.PrivateKey(secret);
		this.key_pair=new symbolSdk.symbol.KeyPair(this.secret_key);
	}

	async start(
		nodes:string[],
	):Promise<void>{
		for(const result of await Promise.all(nodes.map((x:string)=>discover(x)))){
			const tmp=this.nodes.concat(result);
			// deduplicate elements
			this.nodes=tmp.filter((e,i)=>tmp.indexOf(e)===i);
		}
	}

	createSignedTransaction(
		recipientAddress:string,
		message:Uint8Array,
	){
		const now=this.facade.network.fromDatetime(new Date());
		const deadline=new symbolSdk.symbol.NetworkTimestamp(now)
			.addMilliseconds(this.duration)
			.timestamp;
		const transaction=this.facade.transactionFactory.create({
			type:'transfer_transaction_v1',
			signerPublicKey:this.key_pair.publicKey,
			//@ts-ignore
			recipientAddress,
			message,
			deadline,
		});
		transaction.fee=new symbolSdk.symbol.Amount(BigInt(transaction.size)*100n);
		const signature=this.facade.signTransaction(this.key_pair,transaction);
		return this
			.facade
			.transactionFactory
			.constructor
			// @ts-ignore
			.attachSignature(transaction,signature);
	}

	async publish(
		address:string,
		message:Uint8Array,
	):Promise<void>{
		const json=this.createSignedTransaction(address,message);
		await announceTransaction(this.nodes[Math.floor(Math.random()*this.nodes.length)],json);
	}
};
