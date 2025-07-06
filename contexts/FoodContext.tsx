import React, { createContext, useState, ReactNode } from 'react';

type FoodItem = {
  foodName: string;
  quantity: string;
  fee: string;
  location: string;
  pickupTime: string;
  username: string;
};

type FoodContextType = {
  foodList: FoodItem[];
  addFood: (food: FoodItem) => void;
};

export const FoodContext = createContext<FoodContextType>({
  foodList: [],
  addFood: () => {},
});

export const FoodProvider = ({ children }: { children: ReactNode }) => {
  const [foodList, setFoodList] = useState<FoodItem[]>([]);

  const addFood = (food: FoodItem) => {
    setFoodList([...foodList, food]);
  };

  return (
    <FoodContext.Provider value={{ foodList, addFood }}>
      {children}
    </FoodContext.Provider>
  );
};
