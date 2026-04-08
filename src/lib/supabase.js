import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Dev-safe stub for when Supabase isn't configured or init fails
const makeStub = () => {
	const noopPromise = async (val = null) => ({ data: val, error: null });
	const chainable = () => ({ select: () => noopPromise([]), order: () => chainable(), eq: () => chainable(), maybeSingle: () => noopPromise(null), single: () => noopPromise(null) });
	return {
		from: (table) => ({
			select: () => Promise.resolve({ data: [], error: null }),
			order: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
			insert: () => ({ select: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }),
			update: () => ({ eq: () => ({ select: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
			delete: () => ({ eq: () => ({ then: async () => ({ data: null, error: null }) }) }),
			maybeSingle: async () => ({ data: null, error: null }),
		}),
		auth: {
			getSession: async () => ({ data: { session: null } }),
			onAuthStateChange: (cb) => ({ data: { subscription: { unsubscribe: () => {} } } }),
			signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
			updateUser: async () => ({ error: { message: 'Supabase not configured' } }),
			signOut: async () => ({ error: null }),
		},
		functions: {
			invoke: async () => ({ data: null, error: { message: 'Supabase functions not configured' } }),
		},
		storage: {
			from: () => ({ upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }), download: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }),
		},
	};
};

const stub = makeStub();

let supabase;
if (supabaseUrl && supabaseAnonKey) {
	try {
		supabase = createClient(supabaseUrl, supabaseAnonKey);
	} catch (err) {
		// If createClient throws for any reason, fall back to stub to avoid crashing the app
		console.warn('Failed to init Supabase client; falling back to stub.', err);
		supabase = stub;
	}
} else {
	console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Using dev stub for supabase - server features disabled.');
	supabase = stub;
}

export { supabase };
