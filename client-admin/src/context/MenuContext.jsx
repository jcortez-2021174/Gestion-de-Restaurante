import {
  createContext,
  useContext,
  useState
} from "react";

const MenuContext = createContext();

export const MenuProvider = ({
  children
}) => {

  const [dishes, setDishes] = useState([

    {
      id: 1,
      name: "Costillas de Cordero",
      category: "Platos Fuertes",
      price: "Q165.00",
      status: "Disponible",
      image: "/plato1.jpeg",
      description:
        "Jugosas y perfectamente asadas."
    },

    {
      id: 2,
      name: "Cheesecake",
      category: "Postres",
      price: "Q65.00",
      status: "Disponible",
      image: "/plato4.jpeg",
      description:
        "Suave cheesecake artesanal."
    }

  ]);

  const addDish = (dish) => {

    setDishes((prev) => [
      ...prev,
      dish
    ]);
  };

  const editDish = (updatedDish) => {

    setDishes((prev) =>
      prev.map((dish) =>

        dish.id === updatedDish.id
          ? updatedDish
          : dish
      )
    );
  };

  const deleteDish = (id) => {

    setDishes((prev) =>
      prev.filter(
        (dish) => dish.id !== id
      )
    );
  };

  return (

    <MenuContext.Provider
      value={{
        dishes,
        addDish,
        editDish,
        deleteDish
      }}
    >

      {children}

    </MenuContext.Provider>
  );
};

export const useMenu = () =>
  useContext(MenuContext);