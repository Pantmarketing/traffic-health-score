import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "./useAuth";

export const useAudits = () => {
  const { user } = useAuth();
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAudits = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "audits"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const auditsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Normalização básica para o Dashboard não quebrar
        created_at: doc.data().createdAt?.toDate() || new Date(),
        project_name: "Auditoria de Tráfego",
        channels: []
      }));
      auditsData.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      setAudits(auditsData);
    } catch (error) {
      console.error("Error fetching audits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [user]);

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
