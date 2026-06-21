import { useEffect, useRef, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type MqttStatus = "connecting" | "connected" | "disconnected" | "error";

export interface MqttData {
  debit: number;
  volume: number;
  credit: number;
  alarme: string | null;
  lastUpdate: Date | null;
}

interface UseMQTTOptions {
  brokerUrl?: string;
  userId?: string | null;
  meterId?: string | null;
  persist?: boolean; // sauvegarder dans Supabase
}

const DEFAULT_BROKER = "wss://broker.hivemq.com:8884/mqtt";
const TOPICS = {
  data: "compteur/eau/data",
  credit: "compteur/eau/credit",
  alarme: "compteur/eau/alarme",
};

export function useMQTT({
  brokerUrl = DEFAULT_BROKER,
  userId = null,
  meterId = null,
  persist = true,
}: UseMQTTOptions = {}) {
  const [status, setStatus] = useState<MqttStatus>("connecting");
  const [data, setData] = useState<MqttData>({
    debit: 0,
    volume: 0,
    credit: 0,
    alarme: null,
    lastUpdate: null,
  });
  const clientRef = useRef<MqttClient | null>(null);
  const latest = useRef({ debit: 0, volume: 0, credit: 0 });
  const persistTimer = useRef<number | null>(null);

  useEffect(() => {
    const clientId = `smartwater_${Math.random().toString(16).slice(2, 10)}`;
    const client = mqtt.connect(brokerUrl, {
      clientId,
      reconnectPeriod: 3000,
      connectTimeout: 8000,
      clean: true,
    });
    clientRef.current = client;

    client.on("connect", () => {
      setStatus("connected");
      Object.values(TOPICS).forEach((t) => client.subscribe(t, { qos: 0 }));
    });
    client.on("reconnect", () => setStatus("connecting"));
    client.on("close", () => setStatus("disconnected"));
    client.on("error", (err) => {
      console.error("MQTT error", err);
      setStatus("error");
    });

    client.on("message", (topic, payload) => {
      let parsed: any = {};
      const raw = payload.toString();
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = { value: raw };
      }

      setData((prev) => {
        const next = { ...prev, lastUpdate: new Date() };
        if (topic === TOPICS.data) {
          if (parsed.debit !== undefined) next.debit = Number(parsed.debit);
          if (parsed.volume !== undefined) next.volume = Number(parsed.volume);
        } else if (topic === TOPICS.credit) {
          if (parsed.solde !== undefined) next.credit = Number(parsed.solde);
        } else if (topic === TOPICS.alarme) {
          const msg = parsed.message ?? parsed.value ?? raw;
          next.alarme = msg;
          if (msg) toast.warning(`⚠️ ${msg}`);
        }
        latest.current = { debit: next.debit, volume: next.volume, credit: next.credit };
        return next;
      });

      // Persist : debounced à 1 message / 3 s pour éviter de saturer la DB
      if (persist && userId) {
        if (persistTimer.current) return;
        persistTimer.current = window.setTimeout(async () => {
          persistTimer.current = null;
          const alarme = topic === TOPICS.alarme ? (parsed.message ?? parsed.value ?? raw) : null;
          await supabase.from("water_readings").insert({
            user_id: userId,
            meter_id: meterId,
            debit: latest.current.debit,
            volume: latest.current.volume,
            credit: latest.current.credit,
            alarme,
          });
        }, 3000);
      }
    });

    return () => {
      if (persistTimer.current) {
        clearTimeout(persistTimer.current);
        persistTimer.current = null;
      }
      client.end(true);
      clientRef.current = null;
    };
  }, [brokerUrl, userId, meterId, persist]);

  const publish = (topic: string, message: string) => {
    clientRef.current?.publish(topic, message);
  };

  return { status, data, publish, topics: TOPICS };
}
