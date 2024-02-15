import React, { useState, useEffect } from "react";
import Footer from "../components/layout/Footer/Footer";
import Image from "next/image";
import Filter from "../components/Filter/Filter";
import ProductElements from "../components/cards/ProductElements";
import Pagination from "../components/Pagination/Pagination";
import css from "./Collection.module.css";

// Массивы значений фильтров
// const sortBy = [
//   { name: "Featured", id: 111 },
//   { name: "Best Seller", id: 112 },
//   { name: "Price: Low To Hight", id: 113 },
//   { name: "Price: Hight To Low", id: 114 },
// ];
// const sizeOption = [
//   { name: "XS / US (0-4)", id: 115 },
//   { name: "S / US (4-6)", id: 116 },
//   { name: "M / US (6-10)", id: 117 },
//   { name: "L / US (10-14)", id: 118 },
//   { name: "XL / US (12-16)", id: 119 },
// ];
// const fabricOptions = [
//   { name: "cotton", id: 120 },
//   { name: "linen", id: 121 },
//   { name: "wool", id: 122 },
//   { name: "silk", id: 123 },
//   { name: "cashmere", id: 124 },
// ];
// const colorOptions = [
//   { name: "black", id: 125 },
//   { name: "red", id: 126 },
//   { name: "green", id: 127 },
//   { name: "yellow", id: 128 },
//   { name: "dark Blue", id: 129 },
//   { name: "brown", id: 130 },
//   { name: "pink", id: 131 },
//   { name: "light blue", id: 132 },
//   { name: "orange", id: 133 },
//   { name: "white", id: 134 },
// ];

// Получение данных с сервера
// export const getStaticProps = async () => {
//   const response = await fetch("http://localhost:3000/products");
//   const data = await response.json();

//   return {
//     props: { products: data },
//   };
// };

const Collection = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const result = await response.json();
        // if (isMounted) {
          setProducts(result);
        // }
      } catch (error) {
        console.log("Ошибка загрузки данных");
      }
     
    };
    fetchData();
    // Функция для проверки, размонтирован ли компонент
    // return () => {
    //   isMounted = false;
    // };
  }, []);

  console.log(products);
  // Объект всех фильтров
  const filters = {
    sort: [
      // "Featured",
      // "Best Seller",   возможно добавить позже
      "Price: Low To Hight",
      "Price: Hight To Low",
    ],
    color: [
      "black",
      "red",
      "green",
      "yellow",
      "dark Blue",
      "brown",
      "pink",
      "light blue",
      "orange",
      "white",
    ],
    fabric: ["cotton", "linen", "wool", "silk", "cashmere"],
    size: [
      "XS / US (0-4)",
      "S / US (4-6)",
      "M / US (6-10)",
      "L / US (10-14)",
      "XL / US (12-16)",
    ],
  };
  //Все связано с пагинацией
  // const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const [checkedOption, setCheckedOption] = useState({
    sort: [],
    fabric: [],
    color: [],
    size: [],
  });
  console.log(products);

  const handleCheckboxChange = (filterType, value) => {
    setCheckedOption((prevFilter) => {
      if (filterType === "sort") {
        // проверка есть ли опция уже в массиве sortBy
        const isValueIncluded = prevFilter.sort.includes(value);

        //если значение уже есть то итеррируюсь по массиву опций
        const updatedSortBy = isValueIncluded
          ? prevFilter.sort.filter(
              (option) =>
                // option === value ? value : option
                option !== value
            )
          : [value];

        return {
          ...prevFilter,
          sort: updatedSortBy,
        };
      }

      // если массив категории уже имеет значение, то оно удаляется, иначе оно добавляется в массив
      const updatedOption = prevFilter[filterType].includes(value)
        ? prevFilter[filterType].filter((item) => item !== value)
        : [...prevFilter[filterType], value];
      // копируем старый массив и заменяем категорию новым значением
      return {
        ...prevFilter,
        [filterType]: updatedOption,
      };
    });
  };
  const sortByPrice = (products, arraySortBy) => {
    if (arraySortBy.includes("Price: Low To Hight")) {
      return products.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (arraySortBy.includes("Price: Hight To Low")) {
      return products.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return products;
  };

  let filteredProducts = products.filter((product) => {
    const colorMatch =
      checkedOption.color.length === 0 ||
      checkedOption.color.includes(product.color);
    const fabricMatch =
      checkedOption.fabric.length === 0 ||
      checkedOption.fabric.includes(product.fabric);
    const sizeMatch =
      checkedOption.size.length === 0 ||
      checkedOption.size.some((item) => product.size.includes(item));
    return colorMatch && fabricMatch && sizeMatch;
  });

  filteredProducts = sortByPrice(filteredProducts, checkedOption.sort);

  // Код для пагинации
  const lastProdactsIndex = currentPage * productsPerPage;
  const firstProdactsIndex = lastProdactsIndex - productsPerPage;
  const currentProducts = filteredProducts.slice(
    firstProdactsIndex,
    lastProdactsIndex
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageChange = (number) => {
    paginate(number);
    throwingBeginingCards();
  };
  const throwingBeginingCards = () => {
    const containerCards = document.querySelector("#container-cards");
    if (containerCards) {
      containerCards.scrollIntoView({ behavior: "smooth" });
    }
  };
  // Кнопка предыдущая страница
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((currentPage) => {
        return currentPage - 1;
      });
      throwingBeginingCards();
    }
  };
  // Кнопка следующая страница
  const nextPage = () => {
    if (currentPage < products.length / productsPerPage) {
      setCurrentPage((currentPage) => {
        return currentPage + 1;
      });
      throwingBeginingCards();
    }
  };

  return (
    <section className="collection">
      {/* Главный баннер страницы Collection */}
      <div className="mb-[2.4rem] ">
        <Image
          src="/collection-banner.png"
          width={1566}
          height={881}
          alt="banner"
          className="w-full h-[66rem] object-cover"
        ></Image>
      </div>
      <div className="container">
        <div className="flex mb-[4.8rem]">
          <div className="w-1/3">
            <h3 className="main-title">Filters</h3>
            {Object.keys(filters).map((keyFilters) => {
              return (
                <Filter
                  key={keyFilters}
                  nameFilter={keyFilters}
                  options={filters[keyFilters]}
                  checkedOption={checkedOption}
                  handleCheckboxChange={handleCheckboxChange}
                ></Filter>
              );
            })}
          </div>
          {/* Отрисовка карточек */}
          <ProductElements products={currentProducts}></ProductElements>
        </div>
        {/* Пагинация */}
        <div className={css.pagination__centre}>
          <div className={css.pagination__container}>
            <button className={css.pagination__button} onClick={prevPage}>
              &lt;
            </button>
            <Pagination
              productsPerPage={productsPerPage}
              totalProducts={filteredProducts.length}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
            ></Pagination>

            <button className={css.pagination__button} onClick={nextPage}>
              &gt;
            </button>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </section>
  );
};

export default Collection;
