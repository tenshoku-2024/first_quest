
import child_process from 'child_process';
import path from 'path';
import fs from 'fs';

async function rmfr(
	file:string,
):Promise<void>{
	let stat;
	try{
		stat=await fs.promises.stat(file);
	}catch(e){
		return;
	}
	if(stat.isDirectory()){
		for(const item of await fs.promises.readdir(file)){
			await rmfr(path.join(file,item));
		}
		await fs.promises.rmdir(file);
	}else{
		await fs.promises.unlink(file);
	}
}

async function copyDirectory(
	src:string,
	dst:string,
	exclude:string[]=[],
):Promise<void>{
	for(const file of exclude){
		if((path.normalize(src)+path.sep).startsWith(path.normalize(file)+path.sep)){
			return;
		}
	}
	const stat=await fs.promises.stat(src);
	if(stat.isDirectory()){
		await fs.promises.mkdir(dst).catch(()=>{});
		for(const item of await fs.promises.readdir(src)){
			await copyDirectory(
				path.join(src,item),
				path.join(dst,item),
				exclude,
			);
		}
	}else{
		await fs.promises.copyFile(src,dst);
	}
}

interface makeLatexOptions{
	maxIteration:number;
	cwd:string,
}

async function makeLatex(
	latex:string,
	sourceFile:string,
	options:Partial<makeLatexOptions>={},
):Promise<void>{
	const opts:makeLatexOptions={
		maxIteration:5,
		cwd:'.',
		...options,
	};
	let numRerunfilecheck=0;
	const reRerunfilecheck=/^\(rerunfilecheck\)/;
	const ondata=(data:any)=>{
		process.stdout.write(data);
		for(const line of data.toString().split('\n')){
			if(line.match(reRerunfilecheck)!==null){
				numRerunfilecheck+=1;
			}
		}
	};
	for(let i=0;i<opts.maxIteration;i++){
		await new Promise(
			(resolve:any,reject:any)=>{
				const inferior=child_process.spawn(
					latex,
					[
						sourceFile,
						'latex='+latex,
					],
					{
						cwd:opts.cwd,
					},
				);
				inferior.stdout.on('data',ondata);
				inferior.stdin.end();
				inferior.on(
					'exit',
					(code:any,signal:any)=>{
						if(code===0){
							resolve();
						}else{
							reject();
						}
					},
				);
			},
		);
		if(numRerunfilecheck<2){
			break;
		}
		numRerunfilecheck=0;
	}
}

const sourceFileName='./slides.tex';
const sourceDirName='.';
const buildDirName='./build';

await rmfr(buildDirName);
await fs.promises.mkdir(buildDirName);

await copyDirectory(sourceDirName,buildDirName,[buildDirName]);

await makeLatex(
	'xelatex',
	path.normalize(sourceFileName),
	{
		maxIteration:5,
		cwd:buildDirName,
	}
);
