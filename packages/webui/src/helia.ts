
import {
	bootstrap,
} from '@libp2p/bootstrap';

import {
	IDBBlockstore,
} from 'blockstore-idb';

import {
	IDBDatastore,
} from 'datastore-idb';

import {
	createHelia,
	libp2pDefaults,
} from 'helia';

const heliaNodes=[
	'/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
	'/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
	'/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
	'/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
	'/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
	'/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
	'/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS',
	'/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN',
];

export async function createHeliaWithAdditionalBootstrapNodes(){
	const libp2pOptions=libp2pDefaults();
	libp2pOptions.peerDiscovery=[
		bootstrap(
			{
				list:heliaNodes,
			},
		),
	];
	const blockstore=new IDBBlockstore('helia/blockstore');
	const datastore=new IDBDatastore('helia/datastore');
	await Promise.all([
		blockstore.open(),
		datastore.open(),
	])
	const helia=await createHelia(
		{
			blockstore,
			datastore,
			libp2p:libp2pOptions,
		},
	);
	return helia;
}
