
export function hexToUint8Array(
	hex:string,
):Uint8Array{
	return Uint8Array.from((hex.match(/../g)??[]).map((x:string)=>'0x'+x).map((x:string)=>Number.parseInt(x)));
};
