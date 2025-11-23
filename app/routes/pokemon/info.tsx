import { useEffect } from "react";
import { useParams } from "react-router";

const Info = () => {
  const { pokemonId } = useParams();

  useEffect(() => {
    // if id is wrong redirect to 404
    if (isNaN(Number(pokemonId))) {
      window.location.href = "/404";
    }
  }, [pokemonId]);

  return <div className="">Pokemon {pokemonId}</div>;
};

export default Info;
