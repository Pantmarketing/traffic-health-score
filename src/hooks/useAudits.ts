import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, type DocumentData } from "firebase/firestore";
import { useAuth } from "./useAuth";

type Audit = {
  id: string;
  created_at: Date;
  project_name: string;
  channels: unknown[];
} & DocumentData;

export const useAudits = () => {
  const { user } = useAuth();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAudits = useCallback(async () => {
    if (!user) return;
    try {
      const auditsQuery = query(collection(db, "audits"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(auditsQuery);
      const auditsData: Audit[] = querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        const createdAt = (data.createdAt as { toDate?: () => Date } | undefined)?.toDate?.() ?? new Date();

        return {
          id: docSnapshot.id,
          ...data,
          // Normalização básica para o Dashboard não quebrar
          created_at: createdAt,
          project_name: "Auditoria de Tráfego",
          channels: Array.isArray(data.channels) ? data.channels : [],
        };
      });
      auditsData.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      setAudits(auditsData);
    } catch (error) {
      console.error("Error fetching audits:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const deleteAudit = async (id: string) => {
    try {
      await deleteDoc(doc(db, "audits", id));
      setAudits(prev => prev.filter(a => a.id !== id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return { audits, loading, deleteAudit, refresh: fetchAudits };
};
