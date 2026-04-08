import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { SEED_SHOES } from './seed-data';

const ShoeContext = createContext(null);

export const ShoeProvider = ({ children }) => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShoes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shoes')
        .select('*')
        .order('created_date', { ascending: false });
      if (error) {
        console.error('Error fetching shoes:', error);
        // In development, fallback to seeded local data for easier testing
        if (import.meta.env.DEV && SEED_SHOES && SEED_SHOES.length) {
          setShoes(SEED_SHOES);
        } else {
          setShoes([]);
        }
      } else if (!data || data.length === 0) {
        // No rows in DB — use seed data in dev for convenience
        if (import.meta.env.DEV && SEED_SHOES && SEED_SHOES.length) {
          setShoes(SEED_SHOES);
        } else {
          setShoes(data || []);
        }
      } else {
        setShoes(data || []);
      }
    } catch (e) {
      console.error('Unexpected error fetching shoes:', e);
      if (import.meta.env.DEV && SEED_SHOES && SEED_SHOES.length) setShoes(SEED_SHOES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShoes();
  }, [fetchShoes]);

  const addShoe = async (shoeData) => {
    // Remove id so Supabase generates a UUID
    const { id: _id, ...rest } = shoeData;
    const payload = { ...rest, created_date: rest.created_date || new Date().toISOString() };
    const { data, error } = await supabase.from('shoes').insert([payload]).select().single();
    if (error) { console.error('Error adding shoe:', error); return null; }
    setShoes((prev) => [data, ...prev]);
    return data;
  };

  const updateShoe = async (id, shoeData) => {
    const { id: _id, ...rest } = shoeData;
    const payload = { ...rest, updated_date: new Date().toISOString() };
    const { data, error } = await supabase.from('shoes').update(payload).eq('id', id).select().single();
    if (error) { console.error('Error updating shoe:', error); return null; }
    setShoes((prev) => prev.map((s) => (s.id === id ? data : s)));
    return data;
  };

  const deleteShoe = async (id) => {
    const { error } = await supabase.from('shoes').delete().eq('id', id);
    if (error) { console.error('Error deleting shoe:', error); return; }
    setShoes((prev) => prev.filter((s) => s.id !== id));
  };

  const clearAll = async () => {
    const { error } = await supabase.from('shoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) { console.error('Error clearing inventory:', error); return; }
    setShoes([]);
  };

  const getShoe = (id) => shoes.find((s) => s.id === id);
  const listShoes = () => shoes;

  const filterShoes = (criteria) => {
    return shoes.filter((shoe) => {
      for (const [key, value] of Object.entries(criteria)) {
        if (shoe[key] !== value) return false;
      }
      return true;
    });
  };

  const value = {
    shoes,
    loading,
    addShoe,
    updateShoe,
    deleteShoe,
    clearAll,
    getShoe,
    listShoes,
    filterShoes,
    refreshShoes: fetchShoes,
  };

  return (
    <ShoeContext.Provider value={value}>
      {children}
    </ShoeContext.Provider>
  );
};

export const useShoes = () => {
  const context = useContext(ShoeContext);
  if (!context) {
    throw new Error('useShoes must be used within ShoeProvider');
  }
  return context;
};
