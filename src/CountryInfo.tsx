import React, { useState, useEffect } from "react";
import {
  Country,
  State,
  ICountry,
  City,
  ICity,
  IState,
} from "country-state-city";
import { data, dataAllCountries } from "./data";
import { CSVLink } from "react-csv";

interface LocationProps {
  cd_pais: string;
  cd_estado: string;
  ds_estado: string;
  ds_cidade: string;
  latitude: string;
  longitude: string;
}

interface ICountries {
  pais: string;
  sigla: string;
}

// codigo_pais, codigo_estado, nome_estado, ds_cidade, latitude, longitude

function App() {
  const [locations, setLocations] = useState<LocationProps[]>([]);
  const [countries, setCountries] = useState<ICountries[]>([]);

  useEffect(() => {
    const getAllLocation = () => {
      const countries: ICountry[] = Country.getAllCountries();
      const allLocations: any = [];
      const allCountries: ICountries[] = [];

      countries.forEach((country) => {
        const states: IState[] = State.getStatesOfCountry(country.isoCode);

        allCountries.push({
          pais: country.name
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\x20-\xFF]/g, ""),
          sigla: country.isoCode
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\x20-\xFF]/g, ""),
        });

        states.forEach((state) => {
          const cities: ICity[] = City.getCitiesOfState(
            country.isoCode,
            state.isoCode
          );

          cities.forEach((city) => {
            allLocations.push({
              cd_pais: country.isoCode
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\x20-\xFF]/g, ""),
              cd_estado: state.isoCode
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\x20-\xFF]/g, ""),
              ds_estado: state.name
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\x20-\xFF]/g, ""),
              ds_cidade: city.name
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\x20-\xFF]/g, ""),
              latitude: city.latitude,
              longitude: city.longitude,
            });
          });
        });
      });

      setLocations(allLocations);
      setCountries(allCountries);
    };

    getAllLocation();
  }, []);

  const allLocations = locations.filter(function (location) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (location.cd_pais === element) {
        return false; // Se encontrarmos uma correspondência, retornamos false imediatamente
      }
    }
    return true; // Se não houver correspondência, retornamos true
  });

  const allCountries = countries.filter(function (countries) {
    for (let index = 0; index < data.length; index++) {
      const element = dataAllCountries[index];
      if (countries.sigla === element) {
        return false; // Se encontrarmos uma correspondência, retornamos false imediatamente
      }
    }
    return true; // Se não houver correspondência, retornamos true
  });

  return (
    <div className="App">
      <div>
        <CSVLink data={allLocations}>
          {" "}
          Download de: {allLocations.length}
        </CSVLink>
        <hr />
        {/* <ul>
          {allCountries.map((location, index) => (
            <li key={index}>
              {
                "INSERT INTO public.pais (cd_pais, cd_moeda, ds_pais, ds_sigla_pais, dt_desativado, dt_inserido, cd_usuario_gravou, dt_alterado, cd_usuario_alterou, inserido_por, alterado_por) VALUES ("
              }
              {"fn_get_new_key('pais', 'cd_pais')"},{"1"},{"'"}
              {location.pais}
              {"'"},{"'"}
              {location.sigla}
              {"'"}, {"NULL"}, {"now()"}, {"1"}, {"now()"},{"1"},{" "}
              {"'SYS_ADMIM'"}, {"'SYS_ADMIM'"}
              {");"}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

export default App;
