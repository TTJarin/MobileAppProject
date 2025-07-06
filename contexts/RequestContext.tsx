import React, { createContext, useState, ReactNode } from 'react';
import uuid from 'react-native-uuid';

type Request = {
  id: string;
  foodName: string;
  donorUsername: string;
  requestedBy: string;
  status: 'pending' | 'accepted' | 'declined';
};

type RequestContextType = {
  requests: Request[];
  addRequest: (foodName: string, donorUsername: string, requestedBy: string) => void;
  updateRequestStatus: (id: string, status: 'accepted' | 'declined') => void;
};

export const RequestContext = createContext<RequestContextType>({
  requests: [],
  addRequest: () => {},
  updateRequestStatus: () => {},
});

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<Request[]>([]);

  const addRequest = (foodName: string, donorUsername: string, requestedBy: string) => {
    const newRequest: Request = {
      id: uuid.v4() as string, // 👈 guaranteed works in Expo
      foodName,
      donorUsername,
      requestedBy,
      status: 'pending',
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const updateRequestStatus = (id: string, status: 'accepted' | 'declined') => {
    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status } : req))
    );
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest, updateRequestStatus }}>
      {children}
    </RequestContext.Provider>
  );
};
