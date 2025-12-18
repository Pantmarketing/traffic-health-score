import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Audit {
  id: string;
  project_name: string;
  channels: string[];
  score: number;
  answers: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export function useAudits() {
  const { user } = useAuth();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAudits();
    } else {
      setAudits([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAudits = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching audits:', error);
    } else {
      setAudits(data as Audit[]);
    }
    setLoading(false);
  };

  const createAudit = async (
    projectName: string,
    channels: string[],
    answers: Record<string, boolean>,
    score: number
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('audits')
      .insert({
        user_id: user.id,
        project_name: projectName,
        channels,
        answers,
        score,
      })
      .select()
      .single();

    if (!error && data) {
      setAudits((prev) => [data as Audit, ...prev]);
    }

    return { data, error };
  };

  const deleteAudit = async (id: string) => {
    const { error } = await supabase.from('audits').delete().eq('id', id);

    if (!error) {
      setAudits((prev) => prev.filter((a) => a.id !== id));
    }

    return { error };
  };

  return {
    audits,
    loading,
    fetchAudits,
    createAudit,
    deleteAudit,
  };
}
