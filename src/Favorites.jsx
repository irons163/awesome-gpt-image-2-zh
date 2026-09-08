import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {Heart} from 'lucide-react';
import {useGalleryAuth} from './GalleryAuth';
const Favorites = createContext(null);
export const useFavorites = () => useContext(Favorites);
export function FavoritesProvider({children}) {
  const {session, authClient, login} = useGalleryAuth();
  const [ids,setIds] = useState([]);
  const [pending,setPending] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [onlyFavorites,setOnlyFavorites] = useState(false);
  const generation = useRef(0);
  const locks = useRef(new Set());
  useEffect(() => {
    const current = ++generation.current;
    setIds([]); setPending([]); setError(''); locks.current.clear();
    if (!session) { setLoading(false);setOnlyFavorites(false); return; }
    setLoading(true);
    fetch('/api/favorites',{headers:{Authorization:`Bearer ${session.access_token}`}})
      .then(async r => {if (!r.ok) throw Error(); return r.json();})
      .then(data => {if (current === generation.current) setIds(data.caseIds);})
      .catch(() => {if (current === generation.current) setError('load');})
      .finally(()=>{if(current === generation.current) setLoading(false);});
  }, [session?.user?.id]);
  async function toggle(id) {
    if (!session) { await login(); return; }
    if (locks.current.has(id)) return;
    const current = generation.current;
    locks.current.add(id); setPending([...locks.current]); setError('');
    const removing = ids.includes(id);
    try {
      const {data} = await authClient.auth.getSession();
      if (!data.session) throw Error();
      const response = await fetch('/api/favorites'+(removing ? `?caseId=${id}`:''), {
        method:removing?'DELETE':'POST',
        headers:{Authorization:`Bearer ${data.session.access_token}`,'Content-Type':'application/json'},
        ...(removing?{}:{body:JSON.stringify({caseId:id})})
      });
      if (!response.ok) throw Error();
      if (current === generation.current) setIds(old=>removing?old.filter(x=>x!==id):[...new Set([...old,id])]);
    } catch { if(current === generation.current) setError('save'); }
    finally { if(current === generation.current) {locks.current.delete(id);setPending([...locks.current]);} }
  }
  return <Favorites.Provider value={{ids,pending,loading,error,onlyFavorites,setOnlyFavorites,toggle}}>{children}</Favorites.Provider>;
}
export function FavoriteButton({id,language}) {
 const {ids,pending,loading,toggle} = useFavorites();
 const active=ids.includes(id);
 return <button type="button" className={'favoriteAction'+(active?' active':'')} aria-pressed={active} disabled={loading || pending.includes(id)} onClick={()=>toggle(id)}>
  <Heart size={17}/>{language==='zh'?(active?'已加入最愛':'加入最愛'):(active?'Favorited':'Favorite')}
 </button>;
}
