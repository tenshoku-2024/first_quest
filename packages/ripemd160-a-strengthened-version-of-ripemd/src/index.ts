
import {Buffer} from 'buffer';
// @ts-ignore
import RIPEMD160 from '@dashincubator/ripemd160';

export default class{

	private ripemd160:any;

	constructor(
	){
		this.ripemd160=(RIPEMD160 as any).create();
	}

	update(
		buf:Buffer,
	){
		this.ripemd160.update(Uint8Array.from(buf));
		return this;
	}

	digest(
	){
		return this.ripemd160.digest();
	}
};
