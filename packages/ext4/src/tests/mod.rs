
use core::mem::size_of;
use super::*;

#[test]
fn size_of_super_block_is_correct(){
	assert_eq!(size_of::<SuperBlock>(),0x400);
}

#[test]
fn size_of_group_descriptor_is_correct(){
	assert_eq!(size_of::<GroupDescriptor>(),0x40);
}

#[test]
fn size_of_multiple_mount_protection_is_correct(){
	assert_eq!(size_of::<MultipleMountProtection>(),0x400);
}
