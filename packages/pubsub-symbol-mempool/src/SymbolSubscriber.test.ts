
import {
	expect,
	test,
} from 'vitest';

import {SymbolSubscriber} from './SymbolSubscriber';

test('host with invalid hostname must be unavailable',async()=>{
	expect(await SymbolSubscriber.node_is_available('https://invalid hostname:3001')).toBe(false)
});
