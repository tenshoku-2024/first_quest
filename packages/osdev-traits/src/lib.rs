#![feature(error_in_core)]
#![no_std]

extern crate alloc;

use alloc::boxed::Box;
use core::error::Error;
use core::result::Result;

pub trait BlockDevice128{

	fn block_size(
		&mut self,
	)->Result<u128,Box<dyn Error>>;

	fn blocks(
		&mut self,
	)->Result<u128,Box<dyn Error>>;

	fn read_block(
		&mut self,
		block:u128,
		buf:&mut[u8],
	)->Result<(),Box<dyn Error>>;

	fn write_block(
		&mut self,
		block:u128,
		buf:&[u8],
	)->Result<(),Box<dyn Error>>;
}
