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
import symbolSdk from 'symbol-sdk';

const globals:any=inject('globals');
const helia=globals.value.helia;

const network=ref('testnet');
const node=ref('https://localhost:3001');
const mosaicId=ref('');

const title=ref('');
const files=ref(<any>[]);

async function view(){
	const targetAddress=await fetch(
		node.value+'/mosaics/'+mosaicId.value,
	)
		.then((x:any)=>x.json())
		.then((x:any)=>x.mosaic.ownerAddress)
		.then((x:string)=>x.split(/(..)/g).filter(x=>x))
		.then((x:string[])=>x.map(x=>Number.parseInt('0x'+x)))
		.then((x:number[])=>Uint8Array.from(x))
		.then((x:Uint8Array)=>new symbolSdk.symbol.Address(x).toString())
	;

	let symbolMetadata=<number[]>[];
	let i=0n;
	while(true){
		try{
			const buf=await fetch(
				node.value
					+'/metadata?targetAddress='
					+targetAddress
					+'&scopedMetadataKey='
					+('0'.repeat(16)+i.toString(16)).slice(-16)
					+'&targetId='
					+mosaicId.value,
			)
				.then((x:any)=>x.json())
				.then((x:any)=>x.data[0].metadataEntry.value)
				.then((x:string)=>x.split(/(..)/g).filter(x=>x))
				.then((x:string[])=>x.map(x=>Number.parseInt('0x'+x)))
			;
			i+=1n;
			symbolMetadata=symbolMetadata.concat(buf);
		}catch(e){
			break;
		}

	}

	const d=dagCbor(helia);
	const fs=unixfs(helia);
	const rootCid=CID.decode(Uint8Array.from(symbolMetadata));
	const recursedCid=<CID[]>[];
	async function recurse(cid:CID,path:string,name:string):Promise<any[]>{
		if(recursedCid.filter((x:any)=>x.toString()==cid.toString()).length>0){
			return [];
		}
		recursedCid.push(cid);
		let ret=[];
		if(cid.multihash.code==identity.code){
			await helia.blockstore.put(cid,cid.multihash.digest);
		}
		ret.push(
			{
				cid,
				path,
				name,
				download:cid.code!==raw.code?undefined:async()=>{
					const blob=new Blob([await helia.blockstore.get(cid)]);
					const url=URL.createObjectURL(blob);
					const a=window.document.createElement('a');
					a.download=name;
					a.href=url;
					a.click();
					a.remove();
					URL.revokeObjectURL(url);
				},
			},
		);
		if(cid.code!==raw.code){
			for await(const entry of fs.ls(cid)){
				ret=ret.concat(await recurse(entry.cid,path+'/'+entry.name,entry.name));
			}
		}
		return ret;
	}
	const allFiles=await recurse(rootCid,'.','.');
	files.value=allFiles
		.filter((x:any)=>x.path!=='.')
		.filter((x:any)=>x.path!=='./.metadata.cbor')
	;
	const metadata:any=await d.get(allFiles.filter((x:any)=>x.path=='./.metadata.cbor')[0].cid);
	title.value=metadata.title;
}
</script>

<template>
	<div class="border-2 border-blue-300 p-4 m-4 flex flex-col space-y-2">
		<h3 class="text-2xl p-2">
			(N)FTを見る
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
			モザイクID
			<input v-model="mosaicId" type="text" class="border-2 border-blue-500"/>
		</div>
		<div>
			<button class="rounded-xl border-2 border-blue-500 p-2" @click="view">
				みる
			</button>
		</div>
		<h4 class="text-2xl">
			{{title}}
		</h4>
		<div>
			<div v-for="file in files" @click="()=>{if(file.download!==undefined){file.download();}}">
				{{file.path}}
			</div>
		</div>
	</div>
</template>
