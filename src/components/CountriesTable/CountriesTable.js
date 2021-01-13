import Link from "next/Link";
import {
    KeyboardArrowDownRounded,
    KeyboardArrowUpRounded,
} from "@material-ui/icons";
import { useState } from "react";
import styles from "./CountriesTable.module.css";

const orderBy = (countries, value, direction) => {
    if (direction === "asc") {
        return [...countries].sort((a, b) => (a[value] > b[value] ? 1 : -1));
    }

    if (direction === "desc") {
        return [...countries].sort((a, b) => (a[value] > b[value] ? -1 : 1));
    }

    return countries;
};

const SortArrow = ({ direction }) => {
    if (!direction === "desc") {
        return <></>;
    }

    if (direction === "desc") {
        return (
            <div className={styles.heading_arrow}>
                <KeyboardArrowDownRounded color="inherit" />
            </div>
        );
    } else {
        return (
            <div className={styles.heading_arrow}>
                <KeyboardArrowUpRounded color="inherit" />
            </div>
        );
    }
};

const CountriesTable = ({ countries }) => {
    const [direction, setDirection] = useState();
    const [value, setValue] = useState();

    const orderedCountries = orderBy(countries, value, direction);

    // NOTE: 방향이 없다면 desc, 방향이 desc면 asc로 변경해준다.
    const switchDirection = () => {
        if (!direction) {
            setDirection("desc");
        } else if (direction === "desc") {
            setDirection("asc");
        } else {
            setDirection(null);
        }
    };

    const setValueAndDirection = (value) => {
        switchDirection();
        setValue(value);
    };

    return (
        <div>
            <div className={styles.heading}>
                <button
                    className={styles.heading_name}
                    onClick={() => setValueAndDirection("population")}
                >
                    <div>Name</div>

                    <SortArrow />
                </button>

                <button
                    className={styles.heading_population}
                    onClick={() => setValueAndDirection("population")}
                >
                    <div>Population</div>

                    <SortArrow direction={direction} />
                </button>
            </div>

            {orderedCountries.map((country) => (
                <Link href={`/country/${country.alpha3Code}`}>
                    <div className={styles.row}>
                        <div className={styles.name}>{country.name}</div>
                        <div className={styles.population}>
                            {country.population}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default CountriesTable;
