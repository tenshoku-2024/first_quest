<script setup lang="ts">

import {
	ref,
	inject,
} from 'vue';

import {dagCbor} from '@helia/dag-cbor';
import {unixfs} from '@helia/unixfs';

import {CID} from 'multiformats/cid';
import * as raw from 'multiformats/codecs/raw';
import {identity} from 'multiformats/hashes/identity';
import {sha256} from 'multiformats/hashes/sha2';
import symbolSdk from 'symbol-sdk';

const globals:any=inject('globals');
const helia=globals.value.helia;

const network=ref('testnet');
const node=ref('https://localhost:3001');
const metadataType=ref('on');
const wallet_sec=ref('');
const target_sec=ref('');
const feePerSize=ref('100');

const isDir=ref(false);

const nonce=ref('0');
const mosaicId=ref('');

const divisibility=ref('0');

const supplyMutable=ref(true);
const transferable=ref(true);
const restrictable=ref(true);
const revokable=ref(true);

const supply=ref('1');

const title=ref('Empty Directory');
const mimeType=ref('inode/directory');

const filename=ref('Directory');
const filechooser=ref();
const paths=ref();

let file:any;
const status=ref('');

async function ondrop(ev:any){
	paths.value=undefined
	const item=ev.dataTransfer.items[0];
	if(item===undefined){
		return;
	}
	const entry=item.webkitGetAsEntry();
	file=entry;
	if(item.type!==""){
		mimeType.value=item.type;
	}else if(entry.isDirectory){
		mimeType.value='inode/directory';
	}
	const walk=async(entry:any,base:string):Promise<any[]>=>{
		const name=base+'/'+entry.name;
		if(entry.isDirectory){
			const reader=entry.createReader();
			const entries=await new Promise<any[]>(
				(resolve:any)=>{
					reader.readEntries(resolve);
				},
			);
			const ret:any=[].concat.apply([],await Promise.all(entries.map((x:any)=>walk(x,name)))as any);
			ret.unshift({entry,name})
			return ret;
		}
		return [{entry,name}];
	}
	const files=await walk(entry,'.');
	paths.value=files.map(x=>x.name);
}

async function create(){

	const d=dagCbor(helia);
	const fs=unixfs(helia);

	const emptyDirCid=CID.parse('bafyaabakaieac');
	await helia.blockstore.put(emptyDirCid,emptyDirCid.multihash.digest);

	const addOptions={
		hasher:metadataType.value==='on'?identity:sha256,
	};
	async function recurseFiles(entry:any){
		if(entry.isDirectory){
			let cid=emptyDirCid;
			let reader=entry.createReader();
			for(const entry of await new Promise<any>((resolve,reject)=>{reader.readEntries(resolve,reject);})){
				const tmpcid=await fs.cp(
					await recurseFiles(entry),
					cid,
					entry.name,
				);
				const tmpbin=await helia.blockstore.get(tmpcid);
				cid=CID.createV1(tmpcid.code,await addOptions.hasher.digest(tmpbin));
				await helia.blockstore.put(cid,tmpbin)
			}
			return cid;
		}
		const f:any=await new Promise((resolve,reject)=>{entry.file(resolve,reject)});
		const ab=await f.arrayBuffer();
		const content=new Uint8Array(ab);
		const cid=CID.createV1(
			raw.code,
			await addOptions.hasher.digest(content),
		);
		await helia.blockstore.put(cid,content);
		return cid;
	}
	const tokenMetadataObject={
		title:title.value,
		contents:[
			{
				mimetype:mimeType.value,
				path:file.name,
			},
		],
	};
	const tokenMetadataCborCidCbor=await d.add(tokenMetadataObject,addOptions);
	const tokenMetadataCborCidRaw=CID.createV1(raw.code,tokenMetadataCborCidCbor.multihash);
	const contentCid=await recurseFiles(file);
	const rootWithMetadataCidUnknown=await fs.cp(
		tokenMetadataCborCidRaw,
		emptyDirCid,
		'.metadata.cbor',
	)
	const rootWithMetadata=await helia.blockstore.get(rootWithMetadataCidUnknown);
	const rootWithMetadataCidDesired=CID.createV1(rootWithMetadataCidUnknown.code,await addOptions.hasher.digest(rootWithMetadata));
	await helia.blockstore.put(rootWithMetadataCidDesired,rootWithMetadata);
	const rootCidUnknown=await fs.cp(
		contentCid,
		rootWithMetadataCidDesired,
		file.name,
	)
	const root=await helia.blockstore.get(rootCidUnknown);
	const rootCidDesired=CID.createV1(rootCidUnknown.code,await addOptions.hasher.digest(root));

	const indexOfDot=supply.value.lastIndexOf('.');
	const tokenAmount=BigInt(supply.value.replace(/\./,''))*(10n**(BigInt(divisibility.value)-(indexOfDot<0?0n:BigInt(supply.value.length-indexOfDot-1))));

	const facade=new symbolSdk.facade.SymbolFacade(network.value);

	const src_private=new symbolSdk.PrivateKey(wallet_sec.value);
	const src_pair=new symbolSdk.symbol.KeyPair(src_private);
	const src_address=facade.network.publicKeyToAddress(src_pair.publicKey);

	const dst_private=new symbolSdk.PrivateKey(target_sec.value);
	const dst_pair=new symbolSdk.symbol.KeyPair(dst_private);
	const dst_address=facade.network.publicKeyToAddress(dst_pair.publicKey);

	const deadline=new symbolSdk.symbol.NetworkTimestamp(facade.network.fromDatetime(new Date)).addSeconds(60).timestamp;

	const nonce1=Number.parseInt(nonce.value);
	const mosaicIdBigInt=symbolSdk.symbol.generateMosaicId(dst_address,nonce1);
	mosaicId.value=mosaicIdBigInt.toString(16);

	const transactions=[
		facade.transactionFactory.createEmbedded({
			type:'transfer_transaction_v1',
			signerPublicKey:src_pair.publicKey,
			recipientAddress:dst_address,
			mosaics:[
				{
					mosaicId:symbolSdk.symbol.generateMosaicAliasId('symbol.xym'),
					amount:50000000n,
				},
			],
		}),
		facade.transactionFactory.createEmbedded({
			type:'mosaic_definition_transaction_v1',
			signerPublicKey:dst_pair.publicKey,
			divisibility:0,
			duration:0n,
			id:mosaicIdBigInt,
			nonce:nonce1,
			flags:new symbolSdk.symbol.MosaicFlags(
					symbolSdk.symbol.MosaicFlags.NONE.value
					|(supplyMutable.value?symbolSdk.symbol.MosaicFlags.SUPPLY_MUTABLE.value:symbolSdk.symbol.MosaicFlags.NONE.value)
					|(transferable.value?symbolSdk.symbol.MosaicFlags.TRANSFERABLE.value:symbolSdk.symbol.MosaicFlags.NONE.value)
					|(restrictable.value?symbolSdk.symbol.MosaicFlags.RESTRICTABLE.value:symbolSdk.symbol.MosaicFlags.NONE.value)
					|(revokable.value?symbolSdk.symbol.MosaicFlags.REVOKABLE.value:symbolSdk.symbol.MosaicFlags.NONE.value)
				),
		}),
		facade.transactionFactory.createEmbedded({
			type:'mosaic_supply_change_transaction_v1',
			signerPublicKey:dst_pair.publicKey,
			delta:tokenAmount,
			mosaicId:mosaicIdBigInt,
			action:symbolSdk.symbol.MosaicSupplyChangeAction.INCREASE,
		}),
		facade.transactionFactory.createEmbedded({
			type:'transfer_transaction_v1',
			signerPublicKey:dst_pair.publicKey,
			recipientAddress:src_address,
			mosaics:[
				{
					mosaicId:mosaicIdBigInt,
					amount:tokenAmount,
				},
			],
		}),
	];

	let i=0n;
	let metadata=rootCidDesired.bytes;
	while(transactions.length<100){
		const tmp=metadata
		metadata=tmp.slice(1024)
		if(tmp.length==0){
			break;
		}
		transactions.push(
			facade.transactionFactory.createEmbedded({
				type:'mosaic_metadata_transaction_v1',
				signerPublicKey:dst_pair.publicKey,
				scopedMetadataKey:i,
				targetAddress:dst_address,
				targetMosaicId:mosaicIdBigInt,
				valueSizeDelta:tmp.length,
				value:tmp,
			}),
		);
		i+=1n;
	}

	const transactionsHash=(facade.constructor as any).hashEmbeddedTransactions(transactions);
	const tx=facade.transactionFactory.create({
		type:'aggregate_complete_transaction_v2',
		signerPublicKey:src_pair.publicKey,
		deadline,
		transactions,
		transactionsHash,
	});
	tx.fee=new symbolSdk.symbol.Amount(BigInt(tx.size)*100n);

	const sig=facade.signTransaction(src_pair,tx);
	(facade.transactionFactory.constructor as any).attachSignature(tx,sig);

	const dst_sig=new symbolSdk.symbol.Cosignature();
	dst_sig.version=0n;
	dst_sig.signature=new symbolSdk.symbol.Signature(dst_pair.sign(facade.hashTransaction(tx).bytes).bytes);
	dst_sig.signerPublicKey=new symbolSdk.symbol.PublicKey(dst_pair.publicKey.bytes);

	(tx as any).cosignatures=[
		dst_sig,
	];
	const signed_tx_json=JSON.stringify({payload:symbolSdk.utils.uint8ToHex(tx.serialize())})

	await fetch(
		node.value+'/transactions',
		{
			method:'PUT',
			headers:{
				'Content-Type':'application/json',
			},
			body:signed_tx_json,
		},
	);

}

</script>

<template>
	<div class="border-2 border-blue-300 p-4 m-4 flex flex-col space-y-2">
		<h3 class="text-2xl p-2">
			(N)FTを作る
		</h3>
		<div>
			ネットワーク
			<select v-model="network">
				<option value="testnet">
					テストネット
				</option>
				<option value="mainnet">
					メインネット
				</option>
			</select>
		</div>
		<div>
			ノード
			<input v-model="node" type="text" class="border-2 border-blue-500"/>
		</div>
		<div>
			メタデータ
			<select v-model="metadataType">
				<option value="on">
					オンチェーン（この画面で作れるのはまだ96KiBまで）
				</option>
				<option value="off">
					オフチェーン（別途pinする必要がある）（←わかんなければ非推奨）
				</option>
			</select>
		</div>
		<div>
			作者の秘密鍵
			<input v-model="wallet_sec" type="text" class="border-2 border-blue-500"/>
		</div>
		<div>
			メタデータ格納先の秘密鍵
			<input v-model="target_sec" type="text" class="border-2 border-blue-500"/>
		</div>
		<div>
			大きさあたりの手数料
			<input v-model="feePerSize" type="text" class="border-2 border-blue-500"/>
		</div>
		<div>
			nonce
			<input v-model="nonce" type="text"  class="border-2 border-blue-500"/>
		</div>
		<div>
			mosaicId
			<input v-model="mosaicId" disabled type="text"  class="border-2 border-blue-500"/>
		</div>
		<div>
			divisibility
			<input v-model="divisibility" type="text"  class="border-2 border-blue-500"/>
		</div>
		<div>
			supplyMutable
			<input v-model="supplyMutable" type="checkbox"  class="border-2 border-blue-500"/>
		</div>
		<div>
			transferable
			<input v-model="transferable" type="checkbox"  class="border-2 border-blue-500"/>
		</div>
		<div>
			restrictable
			<input v-model="restrictable" type="checkbox"  class="border-2 border-blue-500"/>
		</div>
		<div>
			revokable
			<input v-model="revokable" type="checkbox"  class="border-2 border-blue-500"/>
		</div>
		<div>
			supply
			<input v-model="supply" type="text" class="border-2 border-blue-500"/>
		</div>

		<div>
			題目
			<input v-model="title" class="border-2 border-blue-500"/>
		</div>
		<div>
			MIME type
			<input v-model="mimeType" type="text" class="border-2 border-blue-500"/>
		</div>
		<template v-if="true">
			<div
				class="border-2 border-blue-500 flex justify-center items-center min-h-[200px]" @dragover.prevent="()=>{}" @drop.prevent="ondrop">
				ここにドロップ
			</div>
		</template>
		<template v-else>
			<div>
				<template v-if="isDir">フォルダ</template><template v-else>ファイル</template>名
				<input v-model="filename" class="border-2 border-blue-500"/>
			</div>
			<div>
				<input v-model="isDir" type="checkbox"/>
				フォルダ
				<input ref="filechooser" type="file" :webkitdirectory="isDir"/>
			</div>
		</template>
		<div>
			内容
			<div v-if="paths!==undefined" v-for='path in paths'>
				{{path}}
			</div>
		</div>
		<div>
			<button class="rounded-xl border-2 border-blue-500 p-2" @click="create">
				つくる
			</button>
		</div>
		<div>
			{{status}}
		</div>
	</div>
</template>
