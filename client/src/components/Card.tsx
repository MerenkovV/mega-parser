import React from "react";
import "../style/CardStyle.css";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { setFavorite } from "../api/housesApi";

interface CardProps {
  description: string;
  number: number;
  price: string;
  address: string;
  images: Array<{ link: string; id: number } | null>;
  favorite: boolean;
  id: number;
}

const Card: (props: CardProps) => JSX.Element = observer(
  ({ id, description, number, price, address, images, favorite }) => {
    const { changeFavorite } = useStore();
    return (
      <div className="card">
        <div
          className="card__favorite"
          onClick={() => {
            setFavorite(id, !favorite);
            changeFavorite(id);
          }}
        >
          <svg id="stars" version="1.1">
            <path
              fill={favorite ? "yellow" : "white"}
              d="M9.5 14.25l-5.584 2.936 1.066-6.218L.465 6.564l6.243-.907L9.5 0l2.792 5.657 6.243.907-4.517 4.404 1.066 6.218"
            />
          </svg>
        </div>
        <div className="card__image-wrapper">
          {images.map((item) => (
            <img
              key={item?.id}
              src={item?.link}
              alt="house"
              className="card__image"
            />
          ))}
        </div>
        <a
          className="card__link"
          target="_blank"
          rel="noreferrer"
          href={`https://www.tomsk.ru09.ru/realty?subaction=detail&id=${number}`}
        >
          Перейти к объявлению
        </a>
        <h3 className="card__price">{price}</h3>
        <p className="card__address">{address.replace(/\+/g, " ")}</p>
        <p className="card__description">{description}</p>
      </div>
    );
  }
);

export default Card;
